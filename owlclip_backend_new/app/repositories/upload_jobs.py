from app.models.UploadJob import UploadJob
from sqlalchemy import select, update, func
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional, List
import json 


async def get_videojob(db, job_id: int) -> Optional[UploadJob]:
    result = await db.execute(select(UploadJob).where(UploadJob.job_id == job_id))
    return result.scalar_one_or_none()


async def update_status(db: str, job_id: str, status: str):
    await db.execute(
        update(UploadJob)
        .where((UploadJob.job_id == job_id))
        .values(status=status)
    )
    await db.commit()

async def save_transcript(db, job_id: str, segments: list):
    transcript_json = json.dumps(segments, ensure_ascii=False)
    stmt = (
        update(UploadJob)
        .where(UploadJob.job_id == job_id)
        .values(transcript=transcript_json, updated_at=func.now())
    )
    result = await db.execute(stmt)
    if result.rowcount == 0:
        raise ValueError(f"Job {job_id} not found")


async def save_final_clips(
    db,
    job_id: str,
    clips: list,  # List of clip dicts with timestamps and URLs
):
    """Save final selected clips to the job record."""
    import json
    from sqlalchemy import update
    
    clips_json = json.dumps(clips, ensure_ascii=False)
    stmt = (
        update(UploadJob)
        .where(UploadJob.job_id == job_id)
        .values(
            final_clips=clips_json,
            status="COMPLETED"
        )
    )
    await db.execute(stmt)
    await db.commit()