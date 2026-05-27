from pydantic import BaseModel, EmailStr, Field
from uuid import UUID

class UserCreate(BaseModel):
    username: str = Field(min_length=3,max_length=30)
    email : EmailStr
    password : str = Field(min_length=8 , max_length=100)
    
class UserResponse(BaseModel):
    id: UUID
    username:str
    
    class Config: 
        from_attributes = True

class LoginData(BaseModel):
    email: EmailStr
    password: str