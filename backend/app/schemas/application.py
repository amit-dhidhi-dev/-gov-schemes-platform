from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime

class ApplicationBase(BaseModel):
    scheme_id: int
    submission_data: Optional[Any] = None

class ApplicationCreate(ApplicationBase):
    pass

class ApplicationUpdate(BaseModel):
    status: Optional[str] = None
    submission_data: Optional[Any] = None

class Application(ApplicationBase):
    id: int
    user_id: int
    agent_id: Optional[int] = None
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
