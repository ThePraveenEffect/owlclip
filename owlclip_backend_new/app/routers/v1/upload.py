from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, field_validator
from app.db.deps import get_current_user_id, get_job_service, get_db
from app.services.job_service import JobService
from app.repositories.upload_jobs import get_videojob
from app.utils.AppError import AppException
from starlette import status
from app.repositories.users import deduct_credits
import re


router = APIRouter()


class UploadRequest(BaseModel):
    yt_url: str

    @field_validator('yt_url')
    @classmethod
    def validate_youtube_url(cls, url: str) -> str:
        """✅ Validate YouTube URL format before processing"""
        url = url.strip()
        
        yt_url_pattern = re.compile(
            r'^(https?://)?(www\.)?(youtube\.com/watch\?v=|youtu\.be/)'
            r'([a-zA-Z0-9_-]{11})(?:[&?].*)?$'
        )
        
        match = yt_url_pattern.match(url)
        
        if not match:
            raise ValueError(
                "Invalid YouTube URL. Must be: "
                "https://youtube.com/watch?v=VIDEO_ID or "
                "https://youtu.be/VIDEO_ID"
            )
        
        video_id = match.group(4)
        
        if len(video_id) != 11:
            raise ValueError(
                f"Invalid YouTube video ID '{video_id}'. "
                "Video IDs must be exactly 11 characters."
            )
        
        return url


class ClipResponse(BaseModel):
    """Individual clip with metadata"""
    clip_num: int
    start_time: float
    end_time: float
    url: str
    subtitles_url: str
    hook: str


class FinalClipsResponse(BaseModel):
    """Response with all completed clips"""
    success: bool
    job_id: str
    status: str
    message: str
    clips: list[ClipResponse]
    total_clips: int
    
    class Config:
        from_attributes = True


@router.post("/upload")
async def upload(
    data: UploadRequest, 
    user_id: str = Depends(get_current_user_id),
    job_service: JobService = Depends(get_job_service),
    db = Depends(get_db)
):
    success = await deduct_credits(
    db=db,
    user_id=user_id,
    amount=10
)

    if not success:
        raise AppException(
            status_code=402,
            code="INSUFFICIENT_CREDITS",
            message="Not enough credits.",
            issues=[
                {
                    "field": "credits",
                    "message": "You need at least 10 credits."
                }
            ]
        )

    await db.commit()

    job_id = await job_service.create_job(data.yt_url, user_id)
    response_data = {
        "job_id": job_id,
        "status": "PENDING",
        "message": "Job queued for processing"
    }
    return response_data


@router.get("/clips/{job_id}")
async def get_clips(
    job_id: str,
    user_id: str = Depends(get_current_user_id),
    db = Depends(get_db)
):
    """✅ Retrieve completed clips for a job"""
    
    # Get job from database
    job = await get_videojob(db, job_id)
    
    if not job:
        raise AppException(
            status_code=status.HTTP_404_NOT_FOUND,
            code="JOB_NOT_FOUND",
            message="Job not found.",
            issues=[{"field": "job_id", "message": f"No job with ID {job_id}"}]
        )
    
    # Verify ownership (user can only access their own jobs)
    if str(job.user_id) != str(user_id):
        raise AppException(
            status_code=status.HTTP_403_FORBIDDEN,
            code="UNAUTHORIZED_ACCESS",
            message="Access denied.",
            issues=[{"field": "job_id", "message": "This job doesn't belong to you"}]
        )
    
    # Check if job is completed
    if job.status != "completed":
        raise AppException(
            status_code=status.HTTP_400_BAD_REQUEST,
            code="JOB_NOT_COMPLETED",
            message="Job is still processing.",
            issues=[{
                "field": "status",
                "message": f"Current status: {job.status}. Please wait for processing to complete."
            }]
        )
    
    # Check if clips exist
    if not job.final_clips:
        raise AppException(
            status_code=status.HTTP_400_BAD_REQUEST,
            code="NO_CLIPS_GENERATED",
            message="No clips were generated for this job.",
            issues=[{"field": "final_clips", "message": "Processing completed but no clips found"}]
        )
    
    # Parse clips (if stored as JSON string)
    import json
    clips_data = job.final_clips
    if isinstance(clips_data, str):
        clips_data = json.loads(clips_data)
    
    return {
        "success": True,
        "job_id": str(job.job_id),
        "status": job.status,
        "message": "Clips ready for download",
        "clips": clips_data,
        "total_clips": len(clips_data)
    }



