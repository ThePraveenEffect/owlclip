from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.security import decode_token
from app.core.config import Settings
import logging

logger = logging.getLogger(__name__)
settings = Settings()

class AuthMiddleware(BaseHTTPMiddleware):
    # ✅ Define public paths with methods
    PUBLIC_ENDPOINTS = {
        "/api/v1/auth/register": ["POST", "OPTIONS"],
        "/api/v1/auth/login": ["POST", "OPTIONS"],
        "/api/v1/auth/refresh": ["POST", "OPTIONS"],
        "/api/v1/health": ["GET"],  # Health check
        "/docs": ["GET"],  # API docs
        "/openapi.json": ["GET"],
    }
    
    async def dispatch(self, request: Request, call_next):
        # ✅ Step 1: Allow CORS preflight for ALL endpoints
        if request.method == "OPTIONS":
            return await call_next(request)
        
        # ✅ Step 2: Check if path is public
        path = request.url.path
        is_public = False
        
        for public_path, methods in self.PUBLIC_ENDPOINTS.items():
            if path == public_path and request.method in methods:
                is_public = True
                break
        
        if is_public:
            return await call_next(request)
        
        # ✅ Step 3: Require valid token for protected endpoints
        token = request.cookies.get("access_token")
        
        if not token:
            logger.warning(f"No token for protected endpoint: {path}")
            raise HTTPException(
                status_code=401, 
                detail="Authentication required"
            )
        
        payload = decode_token(token)
        
        if not payload:
            logger.warning(f"Invalid/expired token for: {path}")
            raise HTTPException(
                status_code=401,
                detail="Invalid or expired token"
            )
        
        # ✅ Step 4: Verify token type
        if payload.get("type") != "access":
            raise HTTPException(
                status_code=401,
                detail="Invalid token type"
            )
        
        # ✅ Step 5: Attach user info to request
        request.state.user_id = payload.get("user_id")
        request.state.token_iat = payload.get("iat")
        
        return await call_next(request)