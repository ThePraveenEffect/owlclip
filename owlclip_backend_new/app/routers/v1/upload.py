from fastapi import APIRouter, Depends
from pydantic import BaseModel
# from app.services.job_service import create_job
from app.db.deps import get_current_user_id, get_job_service
from app.services.job_service import JobService


router = APIRouter();

class UploadRequest(BaseModel):
    yt_url:str

@router.post("/upload")
async def upload(
    data:UploadRequest, 
    user_id: str=Depends(get_current_user_id),
    job_service:JobService = Depends(get_job_service)
    ):
    job_id = await job_service.create_job(data.yt_url, user_id)  # Returns string
    response_data = {
    "job_id": job_id,  # ✅ Correct
    "status": "PENDING",
    "message": "Job queued for processing"
     }

    return response_data