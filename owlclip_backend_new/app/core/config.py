from pydantic_settings import BaseSettings
from typing import Optional, List


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str

    # Environment
    ENV: str = "dev"
    DEBUG: bool = False

    # JWT/Security
    JWT_SECRET_KEY: str = "your-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_HOURS: int = 24
    JWT_REFRESH_EXPIRATION_DAYS: int = 7

    ALLOWED_ORIGINS: List[str] = ["https://owlclip.app", "http://localhost:3000"]

    REQUIRE_HTTPS: bool = True  # Enforced in production
    
    # Razorpay 

    RAZORPAY_KEY_ID: str = ""
    RAZORPAY_KEY_SECRET: str = ""
    RAZORPAY_WEBHOOK_SECRET: str = ""

    # Azure Storage (Blob + Queue)
    AZURE_STORAGE_ACCOUNT_NAME: str = ""
    AZURE_STORAGE_ACCOUNT_KEY: str = ""
    AZURE_STORAGE_CONTAINER_VIDEOS: str = "videos"
    AZURE_STORAGE_CONTAINER_CLIPS: str = "clips"
    AZURE_STORAGE_CONTAINER_SUBTITLES: str = "subtitles"
    
     # Azure Speech Services (for transcription)
    AZURE_SPEECH_KEY: str = ""  # Optional: if empty, Whisper will be used
    AZURE_SPEECH_REGION: str = ""  # Optional: e.g., eastus, westus, eastasia

    # Cloudflare Worker AI (Local deployment)
    # Just provide the WORKER_URL of your deployed worker
    CLOUDFLARE_WORKER_URL: str = ""  # e.g., https://your-worker.workers.dev
        # Hugging Face API (for hook generation)
    HF_API_KEY: str = ""  # Get from https://huggingface.co/settings/tokens
    
    GROQ_API_KEY: str = ""              # Free: 30k tokens/min
    GEMINI_API_KEY: str = ""            # Free: 60 requests/min  
    

    # Video Processing
    TEMP_VIDEO_DIR: str = "/tmp/owlclip_videos"
    MAX_VIDEO_SIZE_MB: int = 500
    MAX_VIDEO_DURATION_SECONDS: int = 3600
    ALLOWED_VIDEO_FORMATS: list = ["mp4", "avi", "mov", "mkv", "webm"]

    # Whisper/Transcript
    WHISPER_MODEL_SIZE: str = "base"  # tiny, base, small, medium, large
    WHISPER_DEVICE: str = "cpu"  # cuda or cpu

    # Video Clip Settings
    TARGET_CLIP_DURATION_MIN: int = 45
    TARGET_CLIP_DURATION_MAX: int = 60
    MAX_CLIPS_PER_VIDEO: int = 5

    # Face Detection
    USE_FACE_DETECTION: bool = True
    FACE_DETECTION_THRESHOLD: float = 0.5

    # Subtitle Settings
    SUBTITLE_FONT_SIZE: int = 32
    SUBTITLE_STYLES: list = ["white", "yellow", "gradient"]

    # Worker Configuration
    WORKER_POLL_INTERVAL: int = 5  # Check queue every N seconds
    WORKER_ENABLED: bool = True

    # Local file serving (use Azure SAS URLs directly)
    FILE_SERVING_METHOD: str = "azure_direct"  # Always use Azure direct URLs

    # Email (for notifications)
    SMTP_SERVER: str = ""
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()