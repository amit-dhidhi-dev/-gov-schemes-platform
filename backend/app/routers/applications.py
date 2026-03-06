from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.models import Application, Scheme, User
from app.schemas.application import ApplicationCreate, Application as ApplicationSchema, ApplicationUpdate
from app.core.security import get_current_active_user

router = APIRouter(prefix="/api/applications", tags=["Applications"])

@router.get("/", response_model=List[ApplicationSchema])
def get_my_applications(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    return db.query(Application).filter(Application.user_id == current_user.id).all()

@router.post("/", response_model=ApplicationSchema)
def create_application(
    app_data: ApplicationCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    scheme = db.query(Scheme).filter(Scheme.id == app_data.scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    # Check for duplicate
    existing = db.query(Application).filter(
        Application.user_id == current_user.id,
        Application.scheme_id == app_data.scheme_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already applied to this scheme")
    db_app = Application(user_id=current_user.id, **app_data.model_dump())
    db.add(db_app)
    scheme.applications_count += 1
    db.commit()
    db.refresh(db_app)
    return db_app

@router.get("/{application_id}", response_model=ApplicationSchema)
def get_application(
    application_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    app = db.query(Application).filter(
        Application.id == application_id,
        Application.user_id == current_user.id
    ).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return app

@router.put("/{application_id}", response_model=ApplicationSchema)
def update_application(
    application_id: int,
    update_data: ApplicationUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    app = db.query(Application).filter(
        Application.id == application_id,
        Application.user_id == current_user.id
    ).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    for field, value in update_data.model_dump(exclude_unset=True).items():
        setattr(app, field, value)
    db.commit()
    db.refresh(app)
    return app
