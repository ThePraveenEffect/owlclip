from fastapi import APIRouter, Depends, HTTPException
import logging
from app.repositories.dashboard import my_clips
from app.core.database import get_db
from app.db.deps import get_current_user_id



logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/my-clips")
async def get_my_clips(db=Depends(get_db), user_id=Depends(get_current_user_id)):
    return  await my_clips(db, user_id)


@router.get("/billing-history")
async def get_billing_history(db=Depends(get_db), user_id=Depends(get_current_user_id)):
    # Implement the logic to fetch billing history for the user
    # For now, return a placeholder response
    return {"message": "Billing history will be implemented soon."}