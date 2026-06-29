# app/services/media/extract_audio.py

import asyncio
import logging
import shutil
import tempfile
import os
import sys
from dataclasses import dataclass
from io import StringIO

import yt_dlp

logger = logging.getLogger(__name__)


@dataclass
class ExtractedAudio:
    audio_path: str
    temp_dir: str
    source_url: str


class AudioExtractionError(Exception):
    pass


def _download_and_extract(yt_url: str, temp_dir: str) -> ExtractedAudio:
    """
    Blocking extraction worker with proper stderr handling.
    
    Fixes:
    - Captures yt-dlp output to prevent 'NoneType' errors
    - Adds proper logging output
    - Handles missing JS runtime gracefully
    """
    
    outtmpl = os.path.join(temp_dir, "%(title)s.%(ext)s")
    
    # Create a StringIO buffer for stderr capture
    stderr_buffer = StringIO()
    
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': outtmpl,
        'socket_timeout': 30,
        
        # ✅ FIX: Suppress console output, use logger instead
        'quiet': True,
        'no_warnings': True,
        'remote_components': ['ejs:github'], 
        'allow_unsecure_tools': True,   

        # ✅ FIX: Redirect stderr to our buffer
        'logger': logger,
        
        # ✅ FIX: Don't print to console
        'no_color': True,

         'js_runtimes': {
        'node': {'path': '/usr/bin/node'}
    },

        "extractor_args": {
        "youtube": {
            "player_client": [
                "android",
                "web"
            ]
        }
    },

    "http_headers": {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/138.0.0.0 Safari/537.36"
        ),
        "Accept-Language": "en-US,en;q=0.9",
    },

    "geo_bypass": True,
    "retries": 10,
    "socket_timeout": 60,
    }
    
    try:
        logger.info(f"📥 Starting yt-dlp extraction: {yt_url}")
        logger.info(f"📁 Output dir: {temp_dir}")
        
        # ✅ FIX: Redirect stderr to prevent NoneType errors
        old_stderr = sys.stderr
        sys.stderr = stderr_buffer
        
        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                logger.info("⏳ Downloading audio...")
                info = ydl.extract_info(yt_url, download=True)
                logger.info(f"✅ Download complete")
        finally:
            # Restore stderr
            sys.stderr = old_stderr
            
            # Log any stderr output
            stderr_output = stderr_buffer.getvalue()
            if stderr_output:
                logger.debug(f"yt-dlp stderr: {stderr_output}")
        
        # Find downloaded audio file
        logger.info(f"🔍 Searching for audio files in {temp_dir}")
        files = os.listdir(temp_dir)
        logger.info(f"📂 Files found: {files}")
        
        # Filter out temporary/metadata files
        audio_files = [
            f for f in files 
            if not f.endswith(('.part', '.ytdl', '.temp', '.tmp', '.info.json'))
        ]
        
        if not audio_files:
            logger.error(f"❌ No audio files in {temp_dir}")
            logger.error(f"All files: {files}")
            shutil.rmtree(temp_dir, ignore_errors=True)
            raise AudioExtractionError("No audio file produced")
        
        audio_path = os.path.join(temp_dir, audio_files[0])
        file_size_mb = os.path.getsize(audio_path) / 1024 / 1024
        
        logger.info(f"✅ Audio extracted: {audio_path} ({file_size_mb:.1f}MB)")
        
        return ExtractedAudio(
            audio_path=audio_path,
            temp_dir=temp_dir,
            source_url=yt_url
        )
    
    except yt_dlp.utils.DownloadError as e:
        logger.error(f"❌ yt-dlp download error: {str(e)}", exc_info=True)
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise AudioExtractionError(f"YouTube download failed: {str(e)}")
    
    except Exception as e:
        logger.error(f"❌ Audio extraction failed: {str(e)}", exc_info=True)
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise AudioExtractionError(f"Audio extraction failed: {str(e)}")


async def extract_audio(yt_url: str, timeout: int = 600) -> ExtractedAudio:
    """
    Extract audio from YouTube URL with timeout
    
    Args:
        yt_url: YouTube URL
        timeout: Timeout in seconds (default 10 minutes)
    """
    
    if not yt_url:
        raise AudioExtractionError("Missing YouTube URL")
    
    logger.info(f"🎵 Initializing audio extraction: {yt_url}")
    temp_dir = tempfile.mkdtemp(prefix="owlclip_")
    
    try:
        result = await asyncio.wait_for(
            asyncio.to_thread(
                _download_and_extract,
                yt_url,
                temp_dir
            ),
            timeout=timeout
        )
        return result
    
    except asyncio.TimeoutError:
        logger.error(f"❌ Audio extraction timeout after {timeout}s")
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise AudioExtractionError(f"Download timeout after {timeout} seconds")
    
    except AudioExtractionError:
        # Already logged, just re-raise
        raise
    
    except Exception as e:
        logger.error(f"❌ Unexpected error: {e}", exc_info=True)
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise AudioExtractionError(f"Unexpected error: {str(e)}")