from sqlalchemy import select,update , func 
from sqlalchemy.exc import IntegrityError
from app.models.UploadJob import UploadJob 
from datetime import datetime, timezone



async def my_clips(db, user_id):
    clips_result = await db.execute(
        select(
            UploadJob.job_id,
            UploadJob.yt_url,
            UploadJob.status,
        ).where(
            UploadJob.user_id == user_id
        )
    )

    clips = clips_result.mappings().all()

    total_result = await db.execute(
        select(func.count(UploadJob.job_id)).where(
            UploadJob.user_id == user_id
        )
    )

    total_clips = total_result.scalar()

    return {
        "total_clips": total_clips,
        "clips": clips,
    }



# async def billing_history(db, user_id):
#     result = 
