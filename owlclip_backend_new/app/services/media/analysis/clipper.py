# app/services/media/analysis/clipper.py

"""
Final Video Clipper Layer

Purpose:
- Download source video (high quality).
- Perform surgical cuts based on LLM-detected hooks.
- Apply vertical formatting (9:16) for social media.
- Prepare clips for final subtitle rendering.

Architecture:
- FFmpeg-based cutting.
- YT-DLP for source fetching.
- Parallel rendering support.
"""

import sys
from io import StringIO
import asyncio
import logging
import subprocess
import tempfile
from pathlib import Path
from typing import List, Dict, Any

import yt_dlp
from app.core.config import settings

logger = logging.getLogger(__name__)

class ClipperError(Exception):
    pass

async def _get_stream_info(yt_url: str) -> Dict[str, str]:
    """Fetch direct stream URLs from YouTube without downloading the file"""
    logger.info(f"🔗 Fetching remote stream URLs for: {yt_url}")
    
    ydl_opts = {
        "format": "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best",
        
        # ✅ FIX: Suppress console output
        "quiet": True,
        "no_warnings": True,
        "no_color": True,
        "noplaylist": True,
        
        # ✅ FIX: Node.js runtime for YouTube n-challenge solving
        "js_runtimes": {
            "node": {"path": "/usr/bin/node"}
        },
        
        # ✅ FIX: Support for JavaScript components
        "remote_components": ["ejs:github"],
        "allow_unsecure_tools": True,
        
        # ✅ FIX: Other reliability improvements
        "geo_bypass": True,
        "retries": 3,
        "socket_timeout": 30,
        "http_headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
    }
    
    def _extract():
        stderr_buffer = StringIO()
        old_stderr = sys.stderr
        sys.stderr = stderr_buffer
        try: 
          with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            return ydl.extract_info(yt_url, download=False)
        finally:
            sys.stderr = old_stderr
            stderr_output = stderr_buffer.getvalue()
            if stderr_output:
                logger.debug(f"yt-dlp stderr: {stderr_output}")

            
    try:
        info = await asyncio.to_thread(_extract)
        
        # Extract direct URLs
        video_url = None
        audio_url = None
        
        # DASH formats (separate video/audio) are in 'requested_formats'
        formats = info.get('requested_formats', [])
        if formats:
            for f in formats:
                if f.get('vcodec') != 'none' and f.get('acodec') == 'none':
                    video_url = f['url']
                elif f.get('acodec') != 'none' and f.get('vcodec') == 'none':
                    audio_url = f['url']
        else:
            # Single file format (fallback)
            video_url = info.get('url')
            
        if not video_url:
            raise ClipperError("Could not find suitable video stream")
            
        return {"video_url": video_url, "audio_url": audio_url}
    except Exception as e:
        logger.error(f"Failed to fetch stream info: {e}")
        raise ClipperError(f"Stream info fetch failed: {e}")



async def _cut_viral_clip(
    stream_info: Dict[str, str],
    hook: Dict[str, Any],
    output_dir: Path,
    clip_index: int
) -> Dict[str, Any]:
    """
    Surgically cut a clip from remote streams (clean, no subtitles).
    Subtitles will be added by frontend or during export.
    """
    
    segment_start = float(hook.get("start", 0))
    abs_start = segment_start + float(hook["start_time"])
    abs_end = segment_start + float(hook["end_time"])
    duration = abs_end - abs_start
    
    output_filename = f"hook_{clip_index}_{hook['title'].replace(' ', '_').lower()}.mp4"
    output_path = output_dir / output_filename
    
    logger.info(f"✂️  Producing Clip {clip_index} from Stream: {abs_start:.2f}s -> {abs_end:.2f}s ({duration:.1f}s)")
    
    # ✅ Video filters (NO subtitles)
    vf_filters = (
        "scale=1080:1920:force_original_aspect_ratio=decrease,"
        "pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=black"
    )
    
    # Build FFmpeg command
    cmd = ["ffmpeg", "-y"]
    
    cmd.extend(["-ss", f"{abs_start:.3f}", "-to", f"{abs_end:.3f}", "-i", stream_info["video_url"]])
    
    if stream_info["audio_url"]:
        cmd.extend(["-ss", f"{abs_start:.3f}", "-to", f"{abs_end:.3f}", "-i", stream_info["audio_url"]])
        cmd.extend(["-map", "0:v:0", "-map", "1:a:0"])
    
    cmd.extend([
        "-vf", vf_filters,
        "-c:v", "libx264",
        "-preset", "ultrafast",
        "-crf", "28",
        "-c:a", "aac",
        "-b:a", "128k",
        str(output_path)
    ])
    
    def _run_ffmpeg():
        process = subprocess.run(cmd, capture_output=True, text=True)
        if process.returncode != 0:
            logger.error(f"FFmpeg Error: {process.stderr}")
            raise ClipperError(f"FFmpeg failed for clip {clip_index}")
    
    await asyncio.to_thread(_run_ffmpeg)
    
    hook["final_video_path"] = str(output_path)
    hook["abs_start"] = abs_start
    hook["abs_end"] = abs_end
    
    return hook


async def produce_final_clips(
    yt_url: str,
    viral_hooks: List[Dict[str, Any]]
) -> List[Dict[str, Any]]:
    """
    Main entry point for creating final video clips.
    Uses Stream-Clipping to save bandwidth.
    ✅ Guaranteed cleanup even on failure
    """
    
    if not viral_hooks:
        logger.warning("No viral hooks provided for clipping")
        return []
        
    job_temp_dir = None
    
    try:
        job_temp_dir = Path(tempfile.mkdtemp(prefix="owlclip_final_"))
        logger.info(f"📁 Created temp directory: {job_temp_dir}")
        
        # 1. Fetch remote stream URLs
        stream_info = await _get_stream_info(yt_url)
        
        # 2. Process all hooks sequentially
        logger.info(f"🚀 Producing {len(viral_hooks)} final viral clips via Stream-Clipping...")
        
        final_clips = []
        for i, hook in enumerate(viral_hooks, start=1):
            try:
                clip = await _cut_viral_clip(stream_info, hook, job_temp_dir, i)
                final_clips.append(clip)
            except Exception as e:
                logger.error(f"Failed to produce clip {i}: {e}")
                raise ClipperError(f"Clip {i} production failed: {e}")
            
        logger.info(f"✨ All {len(final_clips)} clips produced successfully")
        return final_clips
        
    except Exception as e:
        logger.error(f"❌ Video production failed: {e}", exc_info=True)
        raise ClipperError(f"Final production failed: {e}")
    
    finally:
        # ✅ FIX: Do NOT delete the temp directory here!
        # The files are needed by the ingestion pipeline for uploading to Azure.
        # Deleting them now causes the upload to fail.
        logger.debug(f"Leaving temp directory for upload: {job_temp_dir}")