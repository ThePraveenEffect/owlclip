# app/services/media/clipping.py

"""
Enhanced clipping with:
- Proper async handling
- Resource cleanup
- Progress tracking
"""

import asyncio
import logging
import shutil
import subprocess
import tempfile
from pathlib import Path
from typing import List

import yt_dlp

logger = logging.getLogger(__name__)


class ClippingError(Exception):
    pass


async def cut_and_render(
    yt_url: str,
    candidates: List[dict],
    output_format: str = "vertical"
) -> List[dict]:
    """
    Download video and cut clips
    
    Args:
        yt_url: YouTube URL
        candidates: List of {start, end, duration, transcript, score}
        output_format: "vertical" (9:16) or "horizontal" (16:9)
    
    Returns:
        List of rendered clips with paths
    """
    
    logger.info(f"🎬 Clipping: {yt_url} ({len(candidates)} clips)")
    
    temp_dir = tempfile.mkdtemp(prefix="owlclip_clips_")
    
    try:
        # Download video
        video_path = await _download_video(yt_url, temp_dir)
        logger.info(f"✅ Video downloaded: {video_path}")
        
        # Cut all clips
        clips = []
        for i, candidate in enumerate(candidates, 1):
            logger.info(
                f"✂️  Cutting clip {i}/{len(candidates)}: "
                f"{candidate['start']:.1f}s-{candidate['end']:.1f}s"
            )
            
            clip_path = await _cut_segment(
                video_path=video_path,
                start=candidate["start"],
                end=candidate["end"],
                output_dir=temp_dir,
                clip_num=i,
                format=output_format
            )
            
            clips.append({
                "clip_num": i,
                "start": candidate["start"],
                "end": candidate["end"],
                "duration": candidate["duration"],
                "transcript": candidate["transcript"],
                "score": candidate["score"],
                "video_path": str(clip_path),
                "azure_url": None,  # Upload separately
            })
        
        logger.info(f"✅ {len(clips)} clips rendered")
        return clips
    
    except Exception as e:
        logger.error(f"❌ Clipping failed: {e}", exc_info=True)
        raise ClippingError(f"Clipping failed: {e}")
    
    finally:
        # Cleanup handled by pipeline context
        pass


async def _download_video(yt_url: str, output_dir: str) -> str:
    """Download video from YouTube"""
    
    output_template = str(Path(output_dir) / "video.%(ext)s")
    
    ydl_opts = {
        "format": "best[ext=mp4]/best",
        "outtmpl": output_template,
        "quiet": True,
        "no_warnings": True,
    }
    
    def _download():
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([yt_url])
    
    await asyncio.to_thread(_download)
    
    # Find downloaded file
    mp4_files = list(Path(output_dir).glob("video.mp4"))
    if not mp4_files:
        mp4_files = list(Path(output_dir).glob("*.mp4"))
    
    if not mp4_files:
        raise ClippingError("No video file downloaded")
    
    return str(mp4_files[0])


async def _cut_segment(
    video_path: str,
    start: float,
    end: float,
    output_dir: str,
    clip_num: int,
    format: str = "vertical"
) -> Path:
    """Cut and render single clip"""
    
    output_path = Path(output_dir) / f"clip_{clip_num}.mp4"
    
    # Vertical (9:16) or horizontal (16:9)
    if format == "vertical":
        filter_str = (
            "scale=1080:1920:force_original_aspect_ratio=decrease,"
            "pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=black"
        )
    else:
        filter_str = (
            "scale=1920:1080:force_original_aspect_ratio=decrease,"
            "pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=black"
        )
    
    cmd = [
        "ffmpeg",
        "-y",
        "-ss", str(start),
        "-to", str(end),
        "-i", video_path,
        "-vf", filter_str,
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "23",
        "-c:a", "aac",
        "-b:a", "128k",
        str(output_path)
    ]
    
    def _run():
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True
        )
        if result.returncode != 0:
            raise ClippingError(f"FFmpeg failed: {result.stderr}")
    
    await asyncio.to_thread(_run)
    
    if not output_path.exists():
        raise ClippingError(f"Clip not created: {output_path}")
    
    return output_path