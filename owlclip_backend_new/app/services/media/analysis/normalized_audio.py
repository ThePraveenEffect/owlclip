import subprocess
import os
import asyncio
import logging

logger = logging.getLogger(__name__)

async def normalize_and_convert(input_path: str) -> str:
    """
    Converts any audio (webm/mp3) to a normalized 16kHz mono WAV.
    ✅ Async-safe: Uses asyncio.to_thread for FFmpeg subprocess
    """
    
    output_path = input_path.rsplit(".", 1)[0] + "normalized.wav"  
    
    command = [
        "ffmpeg", "-y", "-i", input_path,
        "-ar", "16000",      # 16kHz sample rate
        "-ac", "1",          # Mono
        "-filter:a", "loudnorm",  # EBU R128 normalization
        output_path
    ]

    def _run_ffmpeg_sync():
        """Sync FFmpeg wrapper"""
        try:
            result = subprocess.run(
                command, 
                check=True, 
                capture_output=True,
                text=True,
                timeout=600  # 10 min timeout
            )
            logger.info(f"✅ Normalized audio saved: {output_path}")
            return output_path
        except subprocess.TimeoutExpired:
            raise Exception(f"FFmpeg normalization timeout for {input_path}")
        except subprocess.CalledProcessError as e:
            raise Exception(f"FFmpeg failed: {e.stderr}")

    try:
        # ✅ FIX: Run subprocess in thread pool to avoid blocking
        output = await asyncio.to_thread(_run_ffmpeg_sync)
        return output
    except Exception as e:
        logger.error(f"❌ Audio normalization failed: {e}")
        raise