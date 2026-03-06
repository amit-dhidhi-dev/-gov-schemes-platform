from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from app.db.database import get_db
from app.models.models import Scheme, User

router = APIRouter(prefix="/api/eligibility", tags=["Eligibility"])

class EligibilityProfile(BaseModel):
    age: Optional[int] = None
    gender: Optional[str] = None
    state: Optional[str] = None
    income: Optional[float] = None
    occupation: Optional[str] = None
    category: Optional[str] = None
    education: Optional[str] = None
    land_ownership: Optional[float] = None
    disability: Optional[bool] = False

class SchemeEligibilityResult(BaseModel):
    scheme_id: int
    scheme_name: str
    status: str  # eligible, partially_eligible, not_eligible
    reasons: List[str]
    score: float

def check_eligibility(scheme: Scheme, profile: EligibilityProfile) -> SchemeEligibilityResult:
    reasons = []
    failed = []
    passed = 0
    total_criteria = 0

    if scheme.min_age is not None and profile.age is not None:
        total_criteria += 1
        if profile.age >= scheme.min_age:
            passed += 1
        else:
            failed.append(f"Minimum age required: {scheme.min_age} (your age: {profile.age})")

    if scheme.max_age is not None and profile.age is not None:
        total_criteria += 1
        if profile.age <= scheme.max_age:
            passed += 1
        else:
            failed.append(f"Maximum age allowed: {scheme.max_age} (your age: {profile.age})")

    if scheme.income_limit is not None and profile.income is not None:
        total_criteria += 1
        if profile.income <= scheme.income_limit:
            passed += 1
            reasons.append(f"✓ Income (₹{profile.income:,.0f}) within limit (₹{scheme.income_limit:,.0f})")
        else:
            failed.append(f"Income limit: ₹{scheme.income_limit:,.0f} (your income: ₹{profile.income:,.0f})")

    if scheme.target_occupation and profile.occupation:
        total_criteria += 1
        if scheme.target_occupation.lower() in profile.occupation.lower():
            passed += 1
            reasons.append(f"✓ Occupation matches: {scheme.target_occupation}")
        else:
            failed.append(f"Required occupation: {scheme.target_occupation} (yours: {profile.occupation})")

    if scheme.target_category and profile.category:
        total_criteria += 1
        if scheme.target_category.lower() in profile.category.lower() or scheme.target_category.lower() == "all":
            passed += 1
            reasons.append(f"✓ Category matches: {scheme.target_category}")
        else:
            failed.append(f"Required category: {scheme.target_category} (yours: {profile.category})")

    if scheme.target_gender and profile.gender:
        total_criteria += 1
        if scheme.target_gender.lower() in [profile.gender.lower(), "all"]:
            passed += 1
        else:
            failed.append(f"Required gender: {scheme.target_gender}")

    if scheme.applicable_state and profile.state:
        total_criteria += 1
        if scheme.applicable_state.lower() in [profile.state.lower(), "all"]:
            passed += 1
        else:
            failed.append(f"This scheme is only for: {scheme.applicable_state}")

    all_reasons = reasons + [f"✗ {f}" for f in failed]

    if total_criteria == 0:
        status = "eligible"
        score = 1.0
        all_reasons = ["✓ No specific restrictions - open to all citizens"]
    elif failed:
        score = passed / total_criteria if total_criteria > 0 else 0
        status = "partially_eligible" if score >= 0.5 else "not_eligible"
    else:
        status = "eligible"
        score = 1.0

    return SchemeEligibilityResult(
        scheme_id=scheme.id,
        scheme_name=scheme.scheme_name,
        status=status,
        reasons=all_reasons,
        score=score
    )

@router.post("/check", response_model=List[SchemeEligibilityResult])
def check_all_eligibility(profile: EligibilityProfile, db: Session = Depends(get_db)):
    schemes = db.query(Scheme).all()
    results = [check_eligibility(s, profile) for s in schemes]
    # Sort: eligible first, then partially, then not
    order = {"eligible": 0, "partially_eligible": 1, "not_eligible": 2}
    results.sort(key=lambda r: (order.get(r.status, 3), -r.score))
    return results

@router.post("/recommend", response_model=List[SchemeEligibilityResult])
def recommend_schemes(profile: EligibilityProfile, db: Session = Depends(get_db)):
    """Returns only eligible and partially eligible schemes as recommendations."""
    schemes = db.query(Scheme).all()
    results = [check_eligibility(s, profile) for s in schemes]
    eligible = [r for r in results if r.status in ["eligible", "partially_eligible"]]
    eligible.sort(key=lambda r: -r.score)
    return eligible[:20]
