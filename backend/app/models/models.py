from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Float, JSON, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    phone = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    
    # Profile Info for AI Matching
    age = Column(Integer, nullable=True)
    gender = Column(String, nullable=True)
    state = Column(String, nullable=True)
    district = Column(String, nullable=True)
    income = Column(Float, nullable=True)
    occupation = Column(String, nullable=True)
    category = Column(String, nullable=True)  # SC/ST/OBC/General
    education = Column(String, nullable=True)
    land_ownership = Column(Float, nullable=True)  # in acres
    disability = Column(Boolean, default=False)
    
    is_agent = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Explicit foreign_keys to disambiguate the two FK paths from Application
    applications = relationship(
        "Application",
        foreign_keys="[Application.user_id]",
        back_populates="user"
    )


class Scheme(Base):
    __tablename__ = "schemes"
    id = Column(Integer, primary_key=True, index=True)
    scheme_name = Column(String, index=True)
    description = Column(Text)
    ministry = Column(String, index=True)
    scheme_type = Column(String)  # central/state
    applicable_state = Column(String, nullable=True)  # "all" or specific state
    category_id = Column(Integer, ForeignKey("categories.id"))
    
    benefits = Column(Text)
    documents_required = Column(JSON)  # List of required documents
    apply_link = Column(String, nullable=True)
    official_website = Column(String, nullable=True)
    
    # Eligibility Criteria
    min_age = Column(Integer, nullable=True)
    max_age = Column(Integer, nullable=True)
    income_limit = Column(Float, nullable=True)
    target_occupation = Column(String, nullable=True)
    target_category = Column(String, nullable=True)
    target_gender = Column(String, nullable=True)
    
    # Analytics
    views = Column(Integer, default=0)
    applications_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    category = relationship("Category", back_populates="schemes")
    applications = relationship("Application", back_populates="scheme")


class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    slug = Column(String, unique=True, index=True)
    description = Column(String, nullable=True)
    
    schemes = relationship("Scheme", back_populates="category")


class Application(Base):
    __tablename__ = "applications"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    scheme_id = Column(Integer, ForeignKey("schemes.id"))
    agent_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    status = Column(String, default="Draft")
    submission_data = Column(JSON, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", foreign_keys=[user_id], back_populates="applications")
    scheme = relationship("Scheme", back_populates="applications")
    agent = relationship("User", foreign_keys=[agent_id])

class ScraperState(Base):
    __tablename__ = "scraper_state"
    id = Column(Integer, primary_key=True, index=True)
    last_processed_index = Column(Integer, default=0)
    last_run = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

