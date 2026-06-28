from fastapi import APIRouter

from app.routers.v1 import (
    auth, 
    payments, 
    upload,
    profile,
    subtitle
)
from app.routers.v1 import dashboard    

v1_router = APIRouter(prefix="/v1")

v1_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
v1_router.include_router(upload.router, tags=["Upload"])
v1_router.include_router(payments.router, prefix="/payment", tags=["Payments"])
v1_router.include_router(profile.router, prefix="/profile", tags=["Profile"])
v1_router.include_router(subtitle.router, prefix="/clips", tags=["Clips"])
v1_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])

