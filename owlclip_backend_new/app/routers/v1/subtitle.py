import os
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from app.schemas.subtitle import ExportClipPayload
# from app.core.styles import get_style_preset
# from app.utils.clip_download import download_video_from_url

from app.services.subtitles.process_clip import process_clip
from app.core.storage import storage_service


router = APIRouter()

@router.post("/{job_id}/export")
async def export_clip(job_id: str,  clips:  List[ExportClipPayload]):
    
  """
     
  """
  try:
    for clip in clips: 
        result =  process_clip(clip)
        clip_url = await storage_service.upload_clip(
            result,
            job_id,
        )

    
    if not result:
        raise Exception("Please try again later!")

    return {"message": "success", "url":clip_url}

  except Exception as e:
    
    raise HTTPException(status_code=500, detail=f"error: {e}")
