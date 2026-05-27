"""
Schemas for Upload & Subtitle endpoints
Request/Response validation
"""
from pydantic import BaseModel, Field
from typing import Optional, Dict, List
from datetime import datetime


class UploadResponse(BaseModel):
    """Response after file upload"""
    job_id: str = Field(..., description="Unique job identifier")
    status: str = Field(..., description="Current processing status")
    message: str = Field(..., description="Status message")
    
    class Config:
        from_attributes = True


class SubtitleStyle(BaseModel):
    """Preview of one subtitle style"""
    style_name: str = Field(..., description="Style name: modern, classic, minimal, bold")
    sample_text: str = Field(..., description="Sample text in this style")
    font_size: int = Field(..., description="Font size in pixels")
    description: str = Field(..., description="Style description")


class SubtitlesReadyResponse(BaseModel):
    """Response when subtitles are ready for style selection"""
    job_id: str
    status: str = "ready"
    message: str = "Subtitles generated. Please select a style."
    styles: List[SubtitleStyle] = Field(..., description="Available styles with samples")
    transcript_preview: List[Dict] = Field(..., description="First 3 transcript segments")
    
    class Config:
        from_attributes = True


class ProcessRequest(BaseModel):
    """Request to burn selected style into video"""
    style: str = Field(..., description="Subtitle style: modern, classic, minimal, or bold")
    
    class Config:
        json_schema_extra = {
            "example": {"style": "modern"}
        }


class ProcessResponse(BaseModel):
    """Response while processing"""
    job_id: str
    status: str = "processing"
    message: str = "Burning subtitles into video..."
    estimated_time_seconds: int = 30
    
    class Config:
        from_attributes = True


class DownloadReadyResponse(BaseModel):
    """Response when file is ready"""
    job_id: str
    status: str = "completed"
    download_url: str = Field(..., description="Direct download link to MP4 with subtitles")
    filename: str = Field(..., description="Suggested filename for download")
    file_size_mb: float = Field(..., description="Size of final video")
    expires_in_hours: int = Field(..., description="Hours until file is automatically deleted")
    
    class Config:
        from_attributes = True


class JobStatusResponse(BaseModel):
    """Check status of job at any time"""
    job_id: str
    status: str
    progress: Optional[int] = Field(None, description="0-100 progress percentage")
    message: str
    estimated_time_seconds: Optional[int] = None
    error: Optional[str] = None
    download_url: Optional[str] = None
    
    class Config:
        from_attributes = True


class AvailableStylesResponse(BaseModel):
    """Available subtitle styles"""
    styles: List[Dict] = Field(...)
    
    class Config:
        json_schema_extra = {
            "example": {
                "styles": [
                    {"name": "modern", "description": "Clean, sans-serif, white", "fontsize": 56},
                    {"name": "classic", "description": "Serif, yellow, italic", "fontsize": 48},
                    {"name": "minimal", "description": "Plain white, minimal", "fontsize": 40},
                    {"name": "bold", "description": "Bold uppercase, white", "fontsize": 60}
                ]
            }
        }


class ErrorResponse(BaseModel):
    """Error response"""
    error: str
    job_id: Optional[str] = None
    details: Optional[str] = None
    
    class Config:
        from_attributes = True
