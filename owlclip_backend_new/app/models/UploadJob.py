"""
UploadJob Model - Track user uploads and subtitle generation status
Designed for multi-user, high-volume handling
"""
import uuid
from sqlalchemy import Column, String, Integer, Float, DateTime, Enum, Text, func, Index, JSON
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from enum import Enum as PyEnum
from app.core.database import Base


class JobStatus(str, PyEnum):
    """Job lifecycle states"""
    PENDING = "pending"              # File uploaded, waiting to process                # Subtitles ready, waiting for user to pick style
    PROCESSING = "processing"        # Burning selected style into video
    COMPLETED = "completed"          # Done, ready for download
    FAILED = "failed"                # Error occurred
    EXPIRED = "expired"              # Deleted (after 24 hours)


class UploadJob(Base):
    __tablename__ = "upload_jobs"
    __table_args__ = (
        Index('idx_job_id', 'job_id'),
        Index('idx_status', 'status'),
        Index('idx_created_at', 'created_at'),
        Index('idx_user_id', 'user_id'),
    )

    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(UUID(as_uuid=True), default=uuid.uuid4, unique=True, index=True, nullable=False)
    
    # User tracking
    user_id = Column(String(255), nullable=True, index=True)  # For future user auth
    
    yt_url = Column(String(500), nullable=True)  # YouTube URL for input
    
    # File info
    original_filename = Column(String(255), nullable=False)
    original_video_path = Column(String(500), nullable=False)  # Local file path
    video_size_mb = Column(Float, nullable=False)
    video_duration_seconds = Column(Float, nullable=True)
    
    # Processing status
    status = Column(Enum(JobStatus), default=JobStatus.PENDING, index=True, nullable=False)
    
    # Transcription data
    transcript = Column(JSON, nullable=True)  # [{start, end, text}, ...]
    transcript_json_path = Column(String(500), nullable=True)  # Path in Azure
    
    # Subtitle data - stores paths to all 4 styles
    subtitles = Column(JSON, nullable=True)  # {modern: path, classic: path, ...}
    selected_style = Column(String(50), nullable=True)  # User's choice
    
    # Output file
    final_video_path = Column(String(500), nullable=True)  # With burned subtitles
    final_video_azure_url = Column(String(500), nullable=True)  # Download URL
    
    # Error tracking
    error_message = Column(Text, nullable=True)
    error_traceback = Column(Text, nullable=True)
    
    # Cleanup flags
    local_files_cleaned = Column(Integer, default=0, nullable=False)  # 0=no, 1=yes
    azure_cleanup_after = Column(DateTime(timezone=True), nullable=True)  # Schedule deletion
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Metadata
    ip_address = Column(String(50), nullable=True)
    processing_time_seconds = Column(Float, nullable=True)
    
     # Additional columns
    final_clips = Column(JSON, nullable=True)  # [{clip_num, start, end, url, subtitles_url, hook}, ...]
    hooks = Column(JSON, nullable=True)  # {clip_1: "GAME CHANGER", clip_2: "MIND BLOWN", ...}
    heatmap_data = Column(JSON, nullable=True)  # Store detected hotspots


    def __repr__(self):
        return f"<UploadJob {self.job_id} - {self.status} - {self.original_filename}>"
