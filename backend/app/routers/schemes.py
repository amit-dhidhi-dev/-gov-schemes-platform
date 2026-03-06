from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import get_db
from app.models.models import Scheme, Category, User
from app.schemas.scheme import SchemeCreate, Scheme as SchemeSchema, CategoryCreate, Category as CategorySchema
from app.core.security import get_current_active_user

router = APIRouter(prefix="/api/schemes", tags=["Schemes"])

# --- Category Endpoints ---
@router.get("/categories", response_model=List[CategorySchema])
def list_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()

@router.post("/categories", response_model=CategorySchema)
def create_category(cat: CategoryCreate, db: Session = Depends(get_db)):
    db_cat = Category(**cat.model_dump())
    db.add(db_cat)
    db.commit()
    db.refresh(db_cat)
    return db_cat

# --- Scheme Endpoints ---
@router.get("/", response_model=List[SchemeSchema])
def list_schemes(
    skip: int = 0,
    limit: int = 20,
    category_id: Optional[int] = None,
    state: Optional[str] = None,
    search: Optional[str] = None,
    scheme_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Scheme)
    if category_id:
        query = query.filter(Scheme.category_id == category_id)
    if state:
        query = query.filter((Scheme.applicable_state == state) | (Scheme.applicable_state == "all"))
    if scheme_type:
        query = query.filter(Scheme.scheme_type == scheme_type)
    if search:
        query = query.filter(
            Scheme.scheme_name.ilike(f"%{search}%") |
            Scheme.description.ilike(f"%{search}%") |
            Scheme.ministry.ilike(f"%{search}%")
        )
    return query.offset(skip).limit(limit).all()

@router.get("/trending", response_model=List[SchemeSchema])
def trending_schemes(db: Session = Depends(get_db)):
    return db.query(Scheme).order_by(Scheme.views.desc()).limit(10).all()

@router.get("/{scheme_id}", response_model=SchemeSchema)
def get_scheme(scheme_id: int, db: Session = Depends(get_db)):
    scheme = db.query(Scheme).filter(Scheme.id == scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    scheme.views += 1
    db.commit()
    db.refresh(scheme)
    return scheme

@router.post("/", response_model=SchemeSchema)
def create_scheme(scheme: SchemeCreate, db: Session = Depends(get_db)):
    db_scheme = Scheme(**scheme.model_dump())
    db.add(db_scheme)
    db.commit()
    db.refresh(db_scheme)
    return db_scheme

@router.put("/{scheme_id}", response_model=SchemeSchema)
def update_scheme(scheme_id: int, scheme: SchemeCreate, db: Session = Depends(get_db)):
    db_scheme = db.query(Scheme).filter(Scheme.id == scheme_id).first()
    if not db_scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    for field, value in scheme.model_dump().items():
        setattr(db_scheme, field, value)
    db.commit()
    db.refresh(db_scheme)
    return db_scheme

@router.delete("/{scheme_id}")
def delete_scheme(scheme_id: int, db: Session = Depends(get_db)):
    db_scheme = db.query(Scheme).filter(Scheme.id == scheme_id).first()
    if not db_scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    db.delete(db_scheme)
    db.commit()
    return {"detail": "Scheme deleted"}
