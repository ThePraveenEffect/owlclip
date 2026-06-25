# app/services/worker.py

from sqlalchemy.ext.asyncio import AsyncSession
import asyncio
import logging
from app.services.queue_service import QueueService
from app.repositories.upload_jobs import update_status
from app.repositories.users import refund_credits
from app.services.ingestion import ingestion_pipeline
from app.core.database import AsyncSessionLocal
from app.db.deps import get_current_user_id

logger = logging.getLogger(__name__)

async def worker_loop(queue: QueueService):
    """Poll queue and process jobs with proper session management"""
    
    logger.info("Worker loop started - polling for jobs...")
    
    while True: 
        try:
            msg = queue.dequeue()
            
            if not msg: 
                await asyncio.sleep(3)
                continue
            
            job_id = msg["data"]["job_id"]
            logger.info(f"Processing job: {job_id}")
            
            try:
                # Create FRESH session for status update
                async with AsyncSessionLocal() as db:
                    await update_status(db, job_id, "PROCESSING")
                    await db.commit()  # Commit immediately
                
                # Run pipeline (may take 30+ seconds)
                # Create a NEW session if pipeline needs DB access
                
                await ingestion_pipeline(job_id)
                
                # Update final status with a new session
                async with AsyncSessionLocal() as db:
                    await update_status(db, job_id, "COMPLETED")
                    await db.commit()
                
                queue.delete(msg)
                logger.info(f"Job completed: {job_id}")
                    
            except Exception as e:
                logger.error(f"Job failed: {str(e)}", exc_info=True)
                
                async with AsyncSessionLocal() as db:
                        await update_status(db, job_id, "FAILED")
                        await refund_credits(
                                    db,
                                    get_current_user_id,
                                    10
                                )

                        await db.commit()
                
                


          
        except Exception as e:
            logger.error(f"Worker error: {str(e)}", exc_info=True)
            await asyncio.sleep(5)