from fastapi import APIRouter, Depends, HTTPException,status, Request
from app.core.database import get_db
from app.db.deps import get_current_user_id
from app.repositories.users import get_user_by_id

from datetime import (
    datetime,
    timezone
)

router = APIRouter()

@router.get("/me")
async def get_profile(
    request:Request, 
    user_id=Depends(
        get_current_user_id
    ),

    db=Depends(
        get_db
    )
):

    print("ALL COOKIES:", request.cookies)

    print(
        "ACCESS:",
        request.cookies.get("access_token")
    )

    print(
        "REFRESH:",
        request.cookies.get("refresh_token")
    )

    existed_user = (
        await get_user_by_id(
            db,
            user_id
        )
    )

    if not existed_user:

        raise HTTPException(
            status_code=
            status.HTTP_401_UNAUTHORIZED,

            detail=
            "Login again"
        )

    now = datetime.now(
        timezone.utc
    )

    subscription_active = (

        existed_user.subscription_status
        ==
        "active"

        and

        existed_user.subscription_expires_at

        and

        existed_user.subscription_expires_at
        >
        now

    )

    credits_valid = (

        existed_user.credits_expires_at

        and

        existed_user.credits_expires_at
        >
        now

    )

    is_premium = (
        subscription_active
        and
        credits_valid
    )

    return {

        "success": True,

        "user": {

            "id":
            existed_user.id,

            "username":
            existed_user.username,

            "created_at":
            existed_user.created_at,

            "is_premium":
            is_premium,

            "subscription": {

                "status":
                existed_user.subscription_status,

                "expires_at":
                existed_user.subscription_expires_at,

                "active":
                subscription_active
            },

            "credits": {

                "remaining":
                existed_user.credits_remaining,

                "expires_at":
                existed_user.credits_expires_at,

                "valid":
                credits_valid
            }
        }
    }
