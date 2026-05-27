from pydantic import BaseModel
from typing import Optional, List, Any


class ErrorIssue(BaseModel):
    field: str
    message: str


class ErrorResponseDetail(BaseModel):
    code: str
    message: str
    issues: Optional[List[ErrorIssue]] = None

class GlobalErrorResponse(BaseModel):
    success: bool = False
    error: ErrorResponseDetail