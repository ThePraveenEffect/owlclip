from pydantic import BaseModel, HttpUrl
from typing import List, Optional

class SubtitleItem(BaseModel):
    text: str
    start: float
    end: float

class ExportClipPayload(BaseModel):
    clip_num: int
    title: str
    url: HttpUrl
    viral_score: int
    reasoning: str
    start_time: float
    end_time: float
    subtitles: List[SubtitleItem]
    # Added this field to capture what the frontend is sending inside the object
    subtitlePreset: Optional[str] = "neon" 
