from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
from app.schemas.auth import UserCreate, UserResponse, LoginData
from app.core.database import get_db
from app.services.auth import signup_service, login_service
from app.core.security import create_access_token, create_refresh_token
from app.core.config import Settings
from app.core.security import decode_token
import logging

logger = logging.getLogger(__name__)
settings = Settings()

router = APIRouter()

def get_secure_cookie_params():
    production = settings.ENV == "production"

    return {
        "httponly": True,
        "secure": production,   
        "samesite": "lax",
        "path": "/",
    }

@router.post("/register", response_model=dict)
async def signup(user: UserCreate, db=Depends(get_db)):
     new_user = await signup_service(db, user)

     return {
            "id":new_user.id,
            "username": new_user.username,
            "success": True,
            "message": "User created successfully."
          }
	
@router.post("/login")
async def login(data: LoginData, db=Depends(get_db)):
    result = await login_service(db, data)
    
    response_data = {
        "success": True,
        "message": "Login successful",
        "user": result["user"],
        "token_type": "bearer"
    }
    
    response = JSONResponse(content=response_data, status_code=200)
    cookie_params = get_secure_cookie_params()
    
    # ✅ Set access token (short-lived)
    response.set_cookie(
        key="access_token",
        value=result["access_token"],
        max_age=900,  # 15 minutes
        **cookie_params
    )
    
    # ✅ Set refresh token (medium-lived)
    response.set_cookie(
        key="refresh_token",
        value=result["refresh_token"],
        max_age=604800,  # 7 days
        **cookie_params
    )
    
    logger.info(f"User {result['user']['id']} logged in")
    return response

@router.post("/logout")
async def logout(request: Request):
    """✅ Securely clear tokens"""
    user_id = getattr(request.state, "user_id", "unknown")
    logger.info(f"User {user_id} logged out")
    
    response_data = {
        "success": True,
        "message": "Logged out successfully"
    }
    
    response = JSONResponse(content=response_data, status_code=200)
    cookie_params = get_secure_cookie_params()
    
    response.delete_cookie(key="access_token",  **cookie_params)
    response.delete_cookie(key="refresh_token", **cookie_params)
    
    return response




@router.post("/refresh")
async def refresh(request: Request):
    """✅ Single-use refresh window: Only issues short-lived access tokens"""

    refresh_token = request.cookies.get("refresh_token")

    # 1. If refresh token is missing, return clean 401 JSON so React can redirect
    if not refresh_token:
        return JSONResponse(
            status_code=401,
            content={"success": False, "detail": "Session expired. Please login again."}
        )

    payload = decode_token(refresh_token)

    # 2. If token is expired or altered, return clean 401 JSON
    if not payload or payload.get("type") != "refresh":
        return JSONResponse(
            status_code=401,
            content={"success": False, "detail": "Invalid session. Please login again."}
        )

    # 3. Valid refresh token found -> Issue ONLY a short-lived access token
    user_id = payload.get("user_id")
    new_access_token = create_access_token({"user_id": user_id})

    response_data = {
        "success": True,
        "message": "Token refreshed",
        "token_type": "bearer"
    }

    response = JSONResponse(content=response_data, status_code=200)
    cookie_params = get_secure_cookie_params()

    # 4. Set the new temporary access token
    response.set_cookie(
        key="access_token",
        value=new_access_token,
        max_age=900,  # 15 minutes
        **cookie_params
    )

    return response
