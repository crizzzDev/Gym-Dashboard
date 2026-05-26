from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Member, Program
from ..schemas import StatsOut

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("", response_model=StatsOut)
def get_stats(db: Session = Depends(get_db)):
    total_members = db.query(func.count(Member.id)).scalar() or 0
    active_members = db.query(func.count(Member.id)).filter(Member.active.is_(True)).scalar() or 0
    inactive_members = total_members - active_members
    total_programs = db.query(func.count(Program.id)).scalar() or 0
    avg_completion = db.query(func.avg(Program.completion)).scalar() or 0.0

    return StatsOut(
        total_members=total_members,
        active_members=active_members,
        inactive_members=inactive_members,
        total_programs=total_programs,
        avg_completion=round(float(avg_completion), 1),
    )
