from datetime import date as _date
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Member
from ..schemas import MemberCreate, MemberOut, MemberUpdate

router = APIRouter(prefix="/members", tags=["members"])

PALETTE = ["#e94560", "#0891b2", "#059669", "#d97706", "#7c3aed", "#be123c"]


def _initials_from(name: str) -> str:
    parts = [p for p in name.strip().split() if p]
    if not parts:
        return "??"
    if len(parts) == 1:
        return parts[0][:2].upper()
    return (parts[0][0] + parts[1][0]).upper()


def _pick_color(existing_count: int) -> str:
    return PALETTE[existing_count % len(PALETTE)]


def _today_short() -> str:
    today = _date.today()
    return today.strftime("%d/%m/%y")


def _to_out(m: Member) -> dict:
    return {
        "id": m.id,
        "initials": m.initials,
        "color": m.color,
        "name": m.name,
        "email": m.email,
        "plan": [m.plan_tier, m.plan_activity],
        "active": m.active,
        "date": m.date,
    }


@router.get("", response_model=List[MemberOut])
def list_members(
    q: Optional[str] = Query(None, description="Filter by name or email (case-insensitive)"),
    db: Session = Depends(get_db),
):
    query = db.query(Member)
    if q:
        like = f"%{q.lower()}%"
        query = query.filter(
            (Member.name.ilike(like)) | (Member.email.ilike(like))
        )
    return [_to_out(m) for m in query.order_by(Member.id.asc()).all()]


@router.post("", response_model=MemberOut, status_code=status.HTTP_201_CREATED)
def create_member(payload: MemberCreate, db: Session = Depends(get_db)):
    existing = db.query(Member).filter(Member.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=409, detail="Ya existe un miembro con ese email")

    plan = payload.plan or ["Básico", "General"]
    plan_tier = plan[0] if len(plan) > 0 else "Básico"
    plan_activity = plan[1] if len(plan) > 1 else "General"

    count = db.query(Member).count()
    member = Member(
        initials=payload.initials or _initials_from(payload.name),
        color=payload.color or _pick_color(count),
        name=payload.name,
        email=payload.email,
        plan_tier=plan_tier,
        plan_activity=plan_activity,
        active=payload.active,
        date=payload.date or _today_short(),
    )
    db.add(member)
    db.commit()
    db.refresh(member)
    return _to_out(member)


@router.put("/{member_id}", response_model=MemberOut)
def update_member(member_id: int, payload: MemberUpdate, db: Session = Depends(get_db)):
    member = db.query(Member).filter(Member.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Miembro no encontrado")

    if payload.name is not None:
        member.name = payload.name
        member.initials = _initials_from(payload.name)
    if payload.email is not None:
        member.email = payload.email
    if payload.plan is not None and len(payload.plan) > 0:
        member.plan_tier = payload.plan[0]
        if len(payload.plan) > 1:
            member.plan_activity = payload.plan[1]
    if payload.active is not None:
        member.active = payload.active

    db.commit()
    db.refresh(member)
    return _to_out(member)


@router.delete("/{member_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_member(member_id: int, db: Session = Depends(get_db)):
    member = db.query(Member).filter(Member.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Miembro no encontrado")
    db.delete(member)
    db.commit()
    return None
