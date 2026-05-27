from sqlalchemy import (
    Column,
    String,
    BigInteger,
    DateTime,
    ForeignKey
)

from enum import Enum 

from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from app.core.database import Base

import uuid


class TransactionType(str,Enum):
    CREDIT = "CREDIT"
    USAGE = "USAGE"
    REFUND = "REFUND"



class CreditTransaction(Base):
    __tablename__ = "credit_transactions"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    payment_id = Column(
        UUID(as_uuid=True),
        ForeignKey("payments.id"),
        nullable=True
    )

    # CREDIT | USAGE | REFUND
    type = Column(
        Enum(TransactionType),
        nullable=False
    )

    upload_job_id = Column(UUID(as_uuid=True), ForeignKey("upload_jobs.id"), nullable=True)
    
    
    # Positive or negative credits
    credits = Column(
        BigInteger,
        nullable=False
    )

    # Prevent duplicate webhook credits
    idempotency_key = Column(
        String(255),
        unique=True,
        nullable=False,
        index=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )