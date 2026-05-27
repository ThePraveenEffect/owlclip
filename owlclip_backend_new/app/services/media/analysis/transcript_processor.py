# app/services/media/analysis/transcript_processor.py

"""
Transcript Intelligence Layer

Purpose:
- Transform raw Azure transcript into AI-ready structure
- Reconstruct sentences from word timestamps
- Clean transcript noise
- Build semantic chunks
- Generate subtitle-ready segments

This layer sits between:
Transcription → LLM Analysis
"""

import json
import logging
import re

from pathlib import Path
from typing import Dict, List


logger = logging.getLogger(__name__)


# =========================================================
# CONFIG
# =========================================================

PAUSE_THRESHOLD = 1.0
MAX_CHUNK_DURATION = 35.0
SUBTITLE_MAX_WORDS = 5

FILLER_WORDS = {
    "um", "uh", "uh-huh", "mhm", "like", "you know", "i mean", 
    "actually", "basically", "literally", "sort of", "kind of"
}



# =========================================================
# HELPERS
# =========================================================

def load_transcript(
    transcript_path: str
) -> Dict:
    """Load transcript artifact"""

    path = Path(transcript_path)

    if not path.exists():
        raise FileNotFoundError(
            f"Transcript not found: {transcript_path}"
        )

    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def save_transcript(
    transcript_path: str,
    payload: Dict
):
    """Overwrite transcript artifact"""

    with open(transcript_path, "w", encoding="utf-8") as f:
        json.dump(
            payload,
            f,
            ensure_ascii=False,
            indent=2
        )


# =========================================================
# CLEANING
# =========================================================

def clean_sentence(
    text: str
) -> str:
    """
    Light transcript cleanup.

    DO NOT aggressively clean speech.
    Viral speech often contains imperfections.
    """

    text = text.strip()

    words = text.split()

    cleaned_words = []

    previous = None

    for word in words:

        normalized = (
            word.lower()
            .strip(",.!?")
        )

        # remove duplicate fillers
        if (
            normalized in FILLER_WORDS
            and normalized == previous
        ):
            continue

        cleaned_words.append(word)
        previous = normalized

    text = " ".join(cleaned_words)

    # cleanup spaces
    text = re.sub(r"\s+", " ", text)

    # capitalize first char
    if text:
        text = (
            text[0].upper() + text[1:]
        )

    return text.strip()


# =========================================================
# SENTENCE RECONSTRUCTION
# =========================================================

def reconstruct_sentences(
    words: List[Dict],
    full_text: str = ""
) -> List[Dict]:
    """
    Convert word timestamps into sentence-level structures.
    Uses punctuation from full_text/Azure Display results if possible,
    falling back to PAUSE_THRESHOLD.
    """

    if not words:
        return []

    sentences = []
    current_words = []
    sentence_start = words[0]["start"]
    previous_end = words[0]["end"]

    for i, word_data in enumerate(words):
        word = word_data["word"]
        start = word_data["start"]
        end = word_data["end"]
        
        current_words.append(word)
        
        # Sentence termination signals:
        # 1. Word ends with sentence-ending punctuation (. ! ?)
        # 2. Significant pause (fallback)
        # 3. Last word in the list
        
        has_punctuation = any(word.endswith(p) for p in [".", "!", "?", "。"])
        gap = start - previous_end
        is_last = (i == len(words) - 1)

        if has_punctuation or (gap > PAUSE_THRESHOLD and len(current_words) > 5) or is_last:
            sentence_text = " ".join(current_words)
            sentence_text = clean_sentence(sentence_text)
            
            if sentence_text:
                sentences.append({
                    "text": sentence_text,
                    "start": round(sentence_start, 3),
                    "end": round(end, 3),
                    "duration": round(end - sentence_start, 3),
                    "word_count": len(current_words)
                })
            
            # Reset for next sentence
            if not is_last:
                next_word = words[i+1]
                sentence_start = next_word["start"]
                current_words = []
        
        previous_end = end

    logger.info(f"🧠 Reconstructed {len(sentences)} sentences using punctuation & pause logic")
    return sentences


# =========================================================
# SEMANTIC CHUNKS
# =========================================================

def build_semantic_chunks(
    sentences: List[Dict]
) -> List[Dict]:
    """
    Group nearby sentences into narrative semantic chunks.
    Optimized for LLM context windows and narrative flow.
    """

    if not sentences:
        return []

    chunks = []
    current_chunk = []
    chunk_start = sentences[0]["start"]
    chunk_id = 1


    for i, sentence in enumerate(sentences):
        current_chunk.append(sentence)
        chunk_end = sentence["end"]
        
        # Check if we should close this chunk
        duration = chunk_end - chunk_start
        
        # Logic: 
        # - Max duration reached
        # - OR a natural break (long pause between sentences)
        # - OR not next_sentence
        
        is_too_long = duration >= MAX_CHUNK_DURATION
        
        next_sentence = sentences[i+1] if i + 1 < len(sentences) else None

        if is_too_long or not next_sentence:
            chunk_text = " ".join(s["text"] for s in current_chunk)
            
            chunks.append({
                "chunk_id": chunk_id,
                "text": chunk_text,
                "start": round(chunk_start, 3),
                "end": round(chunk_end, 3),
                "duration": round(chunk_end - chunk_start, 3),
                "sentence_count": len(current_chunk),
                "word_count": sum(s.get("word_count", 0) for s in current_chunk)
            })
            
            chunk_id += 1
            current_chunk = []
            if next_sentence:
                chunk_start = next_sentence["start"]

    logger.info(f"🧩 Built {len(chunks)} semantic chunks for LLM analysis")
    return chunks


# =========================================================
# SUBTITLE SEGMENTS
# =========================================================

def generate_subtitle_segments(
    words: List[Dict]
) -> List[Dict]:
    """
    Create subtitle-ready chunks.

    Keeps captions short for reels.
    """

    if not words:
        return []

    subtitles = []

    current_words = []

    subtitle_start = words[0]["start"]

    previous_end = words[0]["end"]

    for word_data in words:

        current_words.append(
            word_data["word"]
        )

        previous_end = word_data["end"]

        if (
            len(current_words)
            >= SUBTITLE_MAX_WORDS
        ):

            subtitles.append({
                "text": " ".join(
                    current_words
                ),
                "start": round(
                    subtitle_start,
                    3
                ),
                "end": round(
                    previous_end,
                    3
                )
            })

            current_words = []

            subtitle_start = previous_end

    # finalize last subtitle
    if current_words:

        subtitles.append({
            "text": " ".join(
                current_words
            ),
            "start": round(
                subtitle_start,
                3
            ),
            "end": round(
                previous_end,
                4
            )
        })

    logger.info(
        f"🎬 Generated "
        f"{len(subtitles)} subtitle segments"
    )

    return subtitles


# =========================================================
# MAIN PROCESSOR
# =========================================================

async def process_transcript(
    transcript_path: str
) -> Dict:
    """
    Main transcript intelligence processor.

    Steps:
    - Load transcript
    - Reconstruct sentences
    - Build semantic chunks
    - Generate subtitles
    - Save enhanced artifact
    """

    logger.info(
        f"🧠 Processing transcript: "
        f"{Path(transcript_path).name}"
    )

    payload = load_transcript(
        transcript_path
    )

    words = (
        payload
        .get("transcript", {})
        .get("segments", [])
    )

    full_text = (
        payload
        .get("transcript", {})
        .get("full_text", "")
    )

    # =====================================================
    # PROCESS
    # =====================================================

    sentences = reconstruct_sentences(
        words,
        full_text
    )

    semantic_chunks = (
        build_semantic_chunks(
            sentences
        )
    )

    subtitle_segments = (
        generate_subtitle_segments(
            words
        )
    )

    clean_text = " ".join(
        sentence["text"]
        for sentence in sentences
    )

    # =====================================================
    # SAVE ENHANCED STRUCTURE
    # =====================================================

    payload["processed_transcript"] = {

        "clean_text": clean_text,

        "sentences": sentences,

        "semantic_chunks": semantic_chunks,

        "subtitle_segments": (
            subtitle_segments
        )
    }

    save_transcript(
        transcript_path,
        payload
    )

    logger.info(
        f"✅ Transcript intelligence "
        f"processing complete"
    )

    return payload


# =========================================================
# BULK PROCESSOR
# =========================================================

async def process_transcript_clips(
    clips: List[Dict]
) -> List[Dict]:
    """
    Process transcript artifacts
    for all clips.
    """

    if not clips:
        return []

    processed = 0

    for clip in clips:

        try:

            transcript_path = (
                clip.get(
                    "transcript_path"
                )
            )

            if not transcript_path:
                continue

            payload = (
                await process_transcript(
                    transcript_path
                )
            )

            processed_data = (
                payload.get(
                    "processed_transcript",
                    {}
                )
            )

            clip["semantic_chunk_count"] = (
                len(
                    processed_data.get(
                        "semantic_chunks",
                        []
                    )
                )
            )

            clip["sentence_count"] = (
                len(
                    processed_data.get(
                        "sentences",
                        []
                    )
                )
            )

            processed += 1

        except Exception as e:

            logger.error(
                f"❌ Transcript processing failed: {e}",
                exc_info=True
            )

    logger.info(
        f"✅ Processed "
        f"{processed}/{len(clips)} transcripts"
    )

    return clips