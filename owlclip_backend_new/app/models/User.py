from sqlalchemy import Column, Integer, String, Boolean, DateTime, func
from datetime import datetime
from app.core.database import Base
import uuid
from sqlalchemy.dialects.postgresql import UUID


class User(Base):
    __tablename__ = "users"

    # Primary key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4,index=True)

    # Authentication fields
    username = Column(String(100), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)

    # Profile fields
    full_name = Column(String(80), nullable=True)
    avatar_url = Column(String(255), nullable=True , default="https://api.dicebear.com/10.x/bottts/svg?seed=Felix")  
    
    credits_remaining = Column(Integer, nullable=False, default=0) #nullable false means The column cannot be empty.
    credits_expires_at = Column(
       DateTime(timezone=True),
       nullable=True
     )

    subscription_status = Column(
        String(50),
        nullable=False,
        default="inactive"
    )

    subscription_expires_at = Column(
        DateTime(timezone=True),
        nullable=True
    )

    # Status fields
    is_active = Column(Boolean, default=True, index=True)
    is_verified = Column(Boolean, default=False)  # Email verification status

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    last_login = Column(DateTime(timezone=True), nullable=True)
    
    # Security tokens
    email_verification_token = Column(String(255), nullable=True)
    password_reset_token = Column(String(255), nullable=True)
    password_reset_expires = Column(DateTime(timezone=True), nullable=True)

    # Notification preferences
    notify_on_purchase = Column(Boolean, default=True)  # Notify user when they make a purchase
    
    def __repr__(self):
        return f"<User(id={self.id}, username={self.username}, email={self.email})>"

