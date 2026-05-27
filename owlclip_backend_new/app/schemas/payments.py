from pydantic import BaseModel, Field
from typing import Optional, Dict, Any,Literal

class PaymentCreate(BaseModel):
    tier: Literal["starter", "creator"] 
    notes: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Additional notes for the payment")