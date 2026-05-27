from fastapi import APIRouter, Depends
from app.core.database import get_db
from app.db.deps import get_current_user_id
from app.repositories.users import get_user_by_id



router = APIRouter()

@router.get("/me")
async def get_profile(
    user_id = Depends(get_current_user_id),
    db = Depends(get_db)    
):
    existed_user = await get_user_by_id(db, user_id)

    if not existed_user:
           raise HTTPException(
             status_code=status.HTTP_401_UNAUTHORIZED,
             detail="Something went wrong! Login Again! "
       )

    return {
        "success": True,
        "user": {
            "id": existed_user.id,
            "email": existed_user.email,
            "username": existed_user.username,
            "created_at": existed_user.created_at
        }
    }
