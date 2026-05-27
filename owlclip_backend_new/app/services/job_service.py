import uuid
from datetime import datetime, UTC
from app.services.queue_service import QueueService
from app.models.UploadJob import UploadJob


class JobService:
    def __init__(self, db, queue_service:QueueService):
        self.db = db
        self.queue = queue_service
    
    async def create_job(self, yt_url: str, user_id: str):
      job_id = str(uuid.uuid4()) 
    
    # Save to database
      job = UploadJob(
        job_id=job_id,
        user_id=user_id,
        yt_url=yt_url,  # Change from source_url to yt_url
        status="PENDING",
        original_filename="youtube_video",
        original_video_path="temp",  # Or wherever you store it
        video_size_mb=0.0,
        created_at=datetime.now(UTC)
    )
    
      self.db.add(job)
      await self.db.commit()
    
      self.queue.enqueue({
        "job_id": job_id,
        "user_id": user_id
    })
    
      return job_id
