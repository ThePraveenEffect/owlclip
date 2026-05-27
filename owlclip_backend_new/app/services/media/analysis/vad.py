import asyncio
import logging
import os
import json
import time
import warnings
import tempfile

from silero_vad import (
    load_silero_vad,
    read_audio,
    get_speech_timestamps
)

warnings.filterwarnings("ignore")

logger = logging.getLogger(__name__)

os.environ["PYTORCH_ENABLE_MPS_FALLBACK"] = "1"

_model = None
_model_lock = asyncio.Lock()

VAD_CONFIG = {
    "threshold": 0.5,
    "min_speech_duration_ms": 500,
    "min_silence_duration_ms": 700,
    "speech_pad_ms": 200,
}

async def get_model():
    global _model

    if _model is None:
        async with _model_lock:
            if _model is None:
                logger.info("Loading Silero VAD model...")
                _model = load_silero_vad(onnx=True)
                logger.info("✅ Silero VAD loaded")

    return _model


async def analyze_audio(wav_path: str) -> str:
    """
    Analyze audio for voice activity and save results to temp file.
    
    Args:
        wav_path: Path to WAV file
        
    Returns:
        Path to temp file containing VAD analysis (JSON)
    """
    start_time = time.time()

    try:
        if not os.path.exists(wav_path):
            raise FileNotFoundError(wav_path)

        logger.info(f"🔍 Processing: {wav_path}")

        model = await get_model()
        audio = read_audio(wav_path)

        speech_timestamps = get_speech_timestamps(
            audio,
            model,
            **VAD_CONFIG
        )

        # Save results to temp file
        temp_file = tempfile.NamedTemporaryFile(
            mode='w',
            suffix='.json',
            prefix='vad_analysis_',
            delete=False
        )
        
        vad_data = {
            "source_audio": wav_path,
            "timestamps": speech_timestamps,
            "segment_count": len(speech_timestamps),
            "config": VAD_CONFIG,
            "analysis_time_seconds": time.time() - start_time
        }
        
        json.dump(vad_data, temp_file)
        temp_file.close()
        
        logger.info(
            f"✅ Found {len(speech_timestamps)} segments "
            f"in {time.time() - start_time:.2f}s"
        )
        logger.info(f"📁 VAD analysis saved to: {temp_file.name}")

        return temp_file.name

    except Exception as e:
        logger.exception(f"❌ VAD failed: {e}")
        raise