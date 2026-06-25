from fastapi import Request
from fastapi.responses import JSONResponse  # ✅ Added for safe error returns
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.security import decode_token
from app.core.config import Settings
import logging

logger = logging.getLogger(__name__)
settings = Settings()

class AuthMiddleware(BaseHTTPMiddleware):
    # ✅ Public endpoints list remains the same
    PUBLIC_ENDPOINTS = {
        "/v1/auth/register": ["POST", "OPTIONS"],
        "/v1/auth/login": ["POST", "OPTIONS"],
        "/v1/auth/refresh": ["POST", "OPTIONS"],
        "/v1/payment/webhook": ["POST", "OPTIONS"],
        "/v1/health": ["GET"],
        "/docs": ["GET"],
        "/openapi.json": ["GET"],
    }
    
    async def dispatch(self, request: Request, call_next):
        # 1. Allow CORS preflight for ALL endpoints
        if request.method == "OPTIONS":
            return await call_next(request)
        
        # 2. Check if path is public
        path = request.url.path
        is_public = False
        
        for public_path, methods in self.PUBLIC_ENDPOINTS.items():
            if path == public_path and request.method in methods:
                is_public = True
                break
        
        if is_public:
            return await call_next(request)
        
        # 3. Require valid token for protected endpoints
        token = request.cookies.get("access_token")
        logger.warning(f"Cookie : {request.cookies} , {token}")
        print(token)

        if not token:
            logger.warning(f"No token for protected endpoint: {path}")
            # ✅ FIX: Return JSONResponse instead of raising HTTPException
            return JSONResponse(
                status_code=401,
                content={"success": False, "detail": "Authentication required"}
            )
        
        payload = decode_token(token)
        print("payload here!fds")
        if not payload:
            logger.warning(f"Invalid/expired token for: {path}")
            # ✅ FIX: Return JSONResponse instead of raising HTTPException
            return JSONResponse(
                status_code=401,
                content={"success": False, "detail": "Invalid or expired token"}
            )
        
        # 4. Verify token type
        if payload.get("type") != "access":
            # ✅ FIX: Return JSONResponse instead of raising HTTPException
            return JSONResponse(
                status_code=401,
                content={"success": False, "detail": "Invalid token type"}
            )
        
        # 5. Attach user info to request
        request.state.user_id = payload.get("user_id")
        request.state.token_iat = payload.get("iat")
        
        return await call_next(request)
