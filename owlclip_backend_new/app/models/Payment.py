from sqlalchemy import Column, Integer, String, Float, DateTime,JSON,func
from datetime import datetime
from app.core.database import Base
import uuid
from sqlalchemy.dialects.postgresql import UUID


class Payment(Base):
    __tablename__ = "payments"

    #primary key 
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    
    # user id 
    user_id = Column(
        String(255), 
        nullable=False, 
        index=True,
        # required=True  sqlalchemy doesn't have required=True, it's a pydantic thing. In SQLAlchemy, you just set nullable=False to make it required.
    )

    #Razor pay order id
    razorpay_order_id = Column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )

    razorpay_payment_id = Column(
        String(255),
        unique=True,
        nullable=True,
        index=True
    )

    currency = Column(
        String(10),
        nullable=False,
        default="INR",
    ) 
    
    amount = Column(
        Float,
        nullable=False,
    )
 
    status = Column(
        String(50),
        nullable=False,
        default="created",
    )  

    tier = Column(
        String(50),
        nullable=True,
    )


    notes = Column(
        JSON,
        nullable=True,
        default={}
    )

    created_at = Column(
        DateTime,
        default=func.now(),
    )