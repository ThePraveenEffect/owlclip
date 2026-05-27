from app.core.database import AsyncSessionLocal
from fastapi import HTTPException, Request, Depends
from sqlalchemy.future import select
from app.models.User import User
from app.core.database import get_db
from app.services.queue_service import QueueService
from app.services.job_service import JobService
from app.core.config import Settings



async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
        
async def get_current_user_id(request:Request)-> str:
    user_id = getattr(request.state, "user_id", None)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid Credentials. Please Login.")
    return user_id

async def get_current_user(request:Request, db= Depends(get_db)):
    user_id = await get_current_user_id(request)

    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid Credentials. Please Login.")
    user = await db.execute(select(User).where(User.id == user_id))
    user = user.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid Credentials. Please Login.")
    
    return user


async def get_job_service(db= Depends(get_db)):
    settings = Settings()
    conn_str = f"DefaultEndpointsProtocol=https;AccountName={settings.AZURE_STORAGE_ACCOUNT_NAME};AccountKey={settings.AZURE_STORAGE_ACCOUNT_KEY};EndpointSuffix=core.windows.net"
    
    # Initialize QueueService with connection string
    queue_service = QueueService(conn_str=conn_str, queue_name="upload-jobs")
    
    return JobService(db, queue_service)