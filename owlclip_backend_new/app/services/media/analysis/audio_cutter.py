# app/services/media/audio_cutter.py

"""
Cut audio segments from normalized WAV file based on candidate timestamps.
Efficient alternative to video cutting - only transcribe what you need!
"""

import asyncio
import logging
import tempfile
from pathlib import Path
from typing import List, Dict

try:
    import librosa
    import soundfile as sf
except ImportError:
    raise ImportError(
        "Required packages not installed. Install with:\n"
        "pip install librosa soundfile"
    )

logger = logging.getLogger(__name__)


async def cut_audio_segments(
    wav_path: str, 
    candidates: List[Dict]
) -> List[Dict]:
    """
    Cut audio segments from normalized WAV file based on candidate timestamps.
    
    This is much more efficient than video cutting:
    - No video download/processing overhead
    - Small audio files for fast transcription
    - Precise timestamps from audio analysis
    
    Args:
        wav_path: Path to normalized WAV file (e.g., from normalize_and_convert)
        candidates: List of candidate dicts with 'start', 'end', 'score', etc.
                   Example: [{"start": 59.977, "end": 179.954, "score": 0.185, ...}]
    
    Returns:
        List of clip dicts with audio_path ready for transcription:
        [
            {
                "clip_num": 1,
                "audio_path": "/tmp/segment_1_xyz.wav",
                "start": 59.977,
                "end": 179.954,
                "duration": 120.0,
                "score": 0.185,
                "energy": 0.0117,
                "dynamics": 0.177,
                "brightness": 0.231,
                "vad_coverage": 1.0,
                "transcript": "",
                "segments": []
            },
            ...
        ]
    
    Raises:
        FileNotFoundError: If wav_path doesn't exist
        ValueError: If candidates list is empty
    """
    
    if not candidates:
        raise ValueError("No candidates provided to cut")
    
    if not Path(wav_path).exists():
        raise FileNotFoundError(f"WAV file not found: {wav_path}")
    
    logger.info(f"🎵 Cutting {len(candidates)} audio segments from {Path(wav_path).name}")
    
    try:
        # Load audio once (efficient)
        logger.info(f"   Loading audio file...")
        y, sr = librosa.load(wav_path, sr=None)
        duration_sec = len(y) / sr
        logger.info(f"   ✅ Loaded: {duration_sec:.1f}s at {sr}Hz")
        
        clips = []
        
        for i, candidate in enumerate(candidates, 1):
            start_sec = float(candidate['start'])
            end_sec = float(candidate['end'])
            
            # Validate timestamps
            if start_sec < 0 or end_sec > duration_sec:
                logger.warning(
                    f"   ⚠️  Segment {i}: bounds outside audio "
                    f"({start_sec:.1f}-{end_sec:.1f}s) in {duration_sec:.1f}s file"
                )
                # Clamp to valid range
                start_sec = max(0, start_sec)
                end_sec = min(duration_sec, end_sec)
            
            # Convert to samples
            start_sample = int(start_sec * sr)
            end_sample = int(end_sec * sr)
            
            # Extract segment
            segment_audio = y[start_sample:end_sample]
            segment_duration = len(segment_audio) / sr
            
            logger.info(
                f"   ✂️  Segment {i}/{len(candidates)}: "
                f"{start_sec:.1f}s-{end_sec:.1f}s ({segment_duration:.1f}s) | "
                f"Score: {candidate.get('score', 0):.3f}"
            )
            
            # Save to temp file
            temp_file = tempfile.NamedTemporaryFile(
                suffix='.wav',
                prefix=f'segment_{i:02d}_',
                delete=False
            )
            
            sf.write(temp_file.name, segment_audio, sr)
            temp_file.close()
            
            # Create clip dict with all metadata
            clip = {
                "clip_num": i,
                "audio_path": temp_file.name,
                "start": float(start_sec),
                "end": float(end_sec),
                "duration": float(segment_duration),
                # Preserve audio analysis metrics
                "score": float(candidate.get('score', 0.0)),
                "energy": float(candidate.get('energy', 0.0)),
                "dynamics": float(candidate.get('dynamics', 0.0)),
                "brightness": float(candidate.get('brightness', 0.0)),
                "crispness": float(candidate.get('crispness', 0.0)),
                "mfcc": float(candidate.get('mfcc', 0.0)),
                "vad_coverage": float(candidate.get('vad_coverage', 0.0)),
                # To be filled by transcription service
                "transcript": "",
                "segments": []
            }
            
            clips.append(clip)
        
        logger.info(f"✅ Successfully cut {len(clips)} audio segments")
        logger.info(f"📊 Total audio to transcribe: {sum(c['duration'] for c in clips):.1f}s")
        
        return clips
        
    except Exception as e:
        logger.error(f"❌ Audio cutting failed: {e}", exc_info=True)
        raise


async def cleanup_audio_clips(clips: List[Dict]) -> None:
    """
    Clean up temporary audio files after processing.
    
    Args:
        clips: List of clips with audio_path to clean up
    """
    import os
    
    logger.info(f"🧹 Cleaning up {len(clips)} temporary audio files...")
    
    for clip in clips:
        audio_path = clip.get("audio_path")
        if audio_path and Path(audio_path).exists():
            try:
                os.remove(audio_path)
                logger.debug(f"   Deleted: {audio_path}")
            except Exception as e:
                logger.warning(f"   Failed to delete {audio_path}: {e}")
    
    logger.info(f"✅ Cleanup complete")