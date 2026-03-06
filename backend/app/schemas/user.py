from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    
    # Profile Info
    age: Optional[int] = None
    gender: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    income: Optional[float] = None
    occupation: Optional[str] = None
    category: Optional[str] = None
    education: Optional[str] = None
    land_ownership: Optional[float] = None
    disability: Optional[bool] = False
    is_agent: Optional[bool] = False

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    income: Optional[float] = None
    occupation: Optional[str] = None
    category: Optional[str] = None
    education: Optional[str] = None
    land_ownership: Optional[float] = None
    disability: Optional[bool] = None

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
