# app/services/media/analysis/transcribe_candidates.py

"""
Azure Speech transcription pipeline for OwlClip.

Features:
- Async Azure transcription
- Word-level timestamps
- Temp transcript artifact storage
- Structured transcript JSON
- Clean pipeline architecture
- Better logging
- Production-ready temp handling
"""

import os
import json
import uuid
import asyncio
import tempfile
import logging

from pathlib import Path
from datetime import datetime, UTC
from typing import Dict, List, Optional

from azure.cognitiveservices.speech import (
    SpeechConfig,
    SpeechRecognizer
)

from app.core.config import settings
import azure.cognitiveservices.speech as speechsdk
from azure.cognitiveservices.speech.audio import AudioConfig

logger = logging.getLogger(__name__)


# =========================================================
# CONFIG
# =========================================================

TEMP_TRANSCRIPT_DIR = (
    Path(tempfile.gettempdir()) / "owlclip_transcripts"
)

TEMP_TRANSCRIPT_DIR.mkdir(
    parents=True,
    exist_ok=True
)


# =========================================================
# HELPERS
# =========================================================

def _get_azure_credentials():
    """Load Azure credentials"""


    speech_key = (
        settings.AZURE_SPEECH_KEY
        or os.getenv("AZURE_SPEECH_KEY")
    )

    speech_region = (
        settings.AZURE_SPEECH_REGION
        or os.getenv("AZURE_SPEECH_REGION")
    )

    if not speech_key or not speech_region:
        raise ValueError(
            "Azure credentials missing.\n"
            "Set:\n"
            "AZURE_SPEECH_KEY\n"
            "AZURE_SPEECH_REGION"
        )

    return speech_key, speech_region


def _build_transcript_payload(
    audio_path: str,
    text: str,
    segments: list,
    confidence: float,
    language: str = "en-US"
) -> Dict:
    """Structured transcript artifact"""

    word_count = len(text.split())

    return {
        "id": str(uuid.uuid4()),
        "created_at": datetime.now(UTC).isoformat(),

        "metadata": {
            "audio_path": audio_path,
            "filename": Path(audio_path).name,
            "language": language,
            "confidence": confidence,
            "word_count": word_count,
            "segment_count": len(segments)
        },

        "transcript": {
            "full_text": text,
            "segments": segments
        }
    }


def _save_temp_transcript(
    transcript_payload: Dict,
    clip_num: int
) -> str:
    """Save transcript artifact to temp storage"""

    file_id = uuid.uuid4().hex[:10]

    filename = f"clip_{clip_num}_{file_id}.json"

    file_path = TEMP_TRANSCRIPT_DIR / filename

    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(
            transcript_payload,
            f,
            ensure_ascii=False,
            indent=2
        )

    return str(file_path)


def cleanup_old_transcripts(max_age_hours: int = 1):
    """Delete old transcript artifacts"""

    import time

    now = time.time()

    deleted = 0

    for file in TEMP_TRANSCRIPT_DIR.glob("*.json"):

        age = now - file.stat().st_mtime

        if age > max_age_hours * 3600:
            try:
                file.unlink(missing_ok=True)
                deleted += 1

            except Exception as e:
                logger.warning(
                    f"Failed deleting {file}: {e}"
                )

    logger.info(
        f"🧹 Cleaned {deleted} old transcript files"
    )


# =========================================================
# TRANSCRIPTION
# =========================================================

def _transcribe_with_azure_sync(
    audio_path: str
) -> Dict:
    """
    Azure Continuous Transcription.
    Supports audio longer than 30 seconds.
    """

    if not Path(audio_path).exists():
        raise FileNotFoundError(
            f"Audio file not found: {audio_path}"
        )

    speech_key, speech_region = (
        _get_azure_credentials()
    )

    logger.info(
        f"🎤 Transcribing (Continuous): {Path(audio_path).name}"
    )

    speech_config = speechsdk.SpeechConfig(
        subscription=speech_key,
        region=speech_region
    )

    speech_config.speech_recognition_language = "en-US"
    speech_config.request_word_level_timestamps()   
    speech_config.output_format = speechsdk.OutputFormat.Detailed

    audio_config = speechsdk.audio.AudioConfig(
        filename=audio_path
    )

    recognizer = speechsdk.SpeechRecognizer(
        speech_config=speech_config,
        audio_config=audio_config
    )

    # State for accumulation
    all_text = []
    all_segments = []
    done = False
    error = None

    def stop_cb(evt):
        """Callback that signals to stop continuous recognition."""
        nonlocal done
        done = True

    def recognized_cb(evt):
        """Callback for recognized segments."""
        if evt.result.reason == speechsdk.ResultReason.RecognizedSpeech:
            if evt.result.text:
                all_text.append(evt.result.text.strip())
                
                # Parse word-level segments from this specific event
                segments = _parse_segments(evt.result, evt.result.text)
                all_segments.extend(segments)

    def canceled_cb(evt):
        """Callback for cancellations/errors."""
        nonlocal error, done
        if evt.result.reason == speechsdk.ResultReason.Canceled:
            cancellation_details = evt.result.cancellation_details
            if cancellation_details.reason == speechsdk.CancellationReason.Error:
                error = cancellation_details.error_details
                logger.error(f"Azure Error: {error}")
        done = True

    # Connect callbacks
    recognizer.recognized.connect(recognized_cb)
    recognizer.session_stopped.connect(stop_cb)
    recognizer.canceled.connect(canceled_cb)

    # Start continuous recognition
    recognizer.start_continuous_recognition()
    
    # Wait for completion (blocking in this sync wrapper)
    import time
    while not done:
        time.sleep(0.5)

    recognizer.stop_continuous_recognition()

    if error:
        raise Exception(f"Azure transcription failed: {error}")

    full_text = " ".join(all_text).strip()
    
    # Calculate average confidence if possible, or use a default
    # Note: For continuous, we'd need to track confidence per result
    # For now, we'll return 1.0 if we got text
    confidence = 1.0 if full_text else 0.0

    payload = _build_transcript_payload(
        audio_path=audio_path,
        text=full_text,
        segments=all_segments,
        confidence=confidence
    )

    logger.info(
        f"✅ {len(full_text.split())} words | "
        f"{len(all_segments)} segments"
    )

    return payload


async def transcribe_with_azure(
    audio_path: str
) -> Dict:
    """Async Azure wrapper"""

    loop = asyncio.get_event_loop()

    return await loop.run_in_executor(
        None,
        _transcribe_with_azure_sync,
        audio_path
    )


# =========================================================
# MAIN PIPELINE
# =========================================================

async def _process_single_clip(
    index: int,
    total: int,
    clip: Dict
) -> Dict:
    """Helper to process a single clip with error handling"""
    try:
        audio_path = clip.get("audio_path")
        if not audio_path:
            raise ValueError("Missing audio_path")

        logger.info(f"🎤 [{index}/{total}] Starting transcription: {Path(audio_path).name}")

        transcript_payload = await transcribe_with_azure(audio_path)

        transcript_path = _save_temp_transcript(
            transcript_payload,
            clip.get("clip_num", index)
        )

        metadata = transcript_payload["metadata"]

        clip.update({
            "transcript_path": transcript_path,
            "word_count": metadata["word_count"],
            "language": metadata["language"],
            "confidence": metadata["confidence"],
            "segment_count": metadata["segment_count"]
        })

        logger.info(f"💾 [{index}/{total}] Saved transcript: {Path(transcript_path).name}")
        return clip

    except Exception as e:
        logger.error(f"❌ Clip {index} transcription failed: {e}", exc_info=True)
        clip.update({
            "transcript_path": None,
            "word_count": 0,
            "language": None,
            "confidence": 0.0,
            "segment_count": 0
        })
        return clip


async def transcribe_audio_clips(
    clips: List[Dict]
) -> List[Dict]:
    """
    Transcribe candidate clips in parallel.
    """

    if not clips:
        logger.warning("No clips received for transcription")
        return []

    logger.info(f"🚀 Processing {len(clips)} clips in parallel")

    tasks = [
        _process_single_clip(i, len(clips), clip)
        for i, clip in enumerate(clips, start=1)
    ]

    # Run all transcriptions concurrently
    results = await asyncio.gather(*tasks)

    success_count = sum(1 for c in results if c.get("transcript_path"))
    
    logger.info(
        f"🏁 Finished: {success_count}/{len(clips)} successful"
    )

    return results


# =========================================================
# WORD TIMESTAMP PARSER
# =========================================================

def _parse_segments(
    result,
    text: str
) -> List[Dict]:
    """Extract word timestamps"""

    segments = []

    try:

        if hasattr(result, "json") and result.json:

            details = json.loads(result.json)

            nbest = details.get("NBest", [])

            if nbest:

                words = nbest[0].get(
                    "Words",
                    []
                )

                for word in words:

                    start = (
                        word.get("Offset", 0)
                        / 10_000_000
                    )

                    duration = (
                        word.get("Duration", 0)
                        / 10_000_000
                    )

                    segments.append({
                        "word": word.get(
                            "Word",
                            ""
                        ),

                        "start": round(
                            start,
                            3
                        ),

                        "end": round(
                            start + duration,
                            3
                        ),

                        "duration": round(
                            duration,
                            3
                        )
                    })

    except Exception as e:

        logger.warning(
            f"Segment parsing failed: {e}"
        )

    # fallback
    if not segments:

        for word in text.split():

            segments.append({
                "word": word,
                "start": 0.0,
                "end": 0.0,
                "duration": 0.0
            })

    return segments