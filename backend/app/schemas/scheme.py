from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime

class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int

    class Config:
        from_attributes = True

class SchemeBase(BaseModel):
    scheme_name: str
    description: str
    ministry: str
    scheme_type: str
    applicable_state: Optional[str] = None
    category_id: Optional[int] = None
    
    benefits: str
    documents_required: List[str]
    apply_link: Optional[str] = None
    official_website: Optional[str] = None
    
    min_age: Optional[int] = None
    max_age: Optional[int] = None
    income_limit: Optional[float] = None
    target_occupation: Optional[str] = None
    target_category: Optional[str] = None
    target_gender: Optional[str] = None

class SchemeCreate(SchemeBase):
    pass

class Scheme(SchemeBase):
    id: int
    views: int
    applications_count: int
    created_at: datetime
    last_updated: datetime
    category: Optional[Category] = None

    class Config:
        from_attributes = True
