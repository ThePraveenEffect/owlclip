from fastapi import APIRouter

from app.routers.v1 import (
    auth, 
    payments, 
    upload,
    profile
)

v1_router = APIRouter(prefix="/api/v1")

v1_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
v1_router.include_router(upload.router, tags=["Upload"])
v1_router.include_router(payments.router, prefix="/payments", tags=["Payments"])
v1_router.include_router(profile.router, prefix="/profile", tags=["Profile"])



