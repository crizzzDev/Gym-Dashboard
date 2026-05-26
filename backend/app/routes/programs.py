from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Program
from ..schemas import ProgramCreate, ProgramOut, ProgramUpdate

router = APIRouter(prefix="/programs", tags=["programs"])


def _to_out(p: Program) -> dict:
    return {
        "id": p.id,
        "logo": p.logo,
        "color": p.color,
        "name": p.name,
        "members": [m for m in p.members_csv.split(",") if m],
        "budget": p.budget,
        "completion": p.completion,
    }


@router.get("", response_model=List[ProgramOut])
def list_programs(db: Session = Depends(get_db)):
    return [_to_out(p) for p in db.query(Program).order_by(Program.id.asc()).all()]


@router.post("", response_model=ProgramOut, status_code=status.HTTP_201_CREATED)
def create_program(payload: ProgramCreate, db: Session = Depends(get_db)):
    program = Program(
        logo=(payload.logo or payload.name[:2]).upper(),
        color=payload.color or "#0891b2",
        name=payload.name,
        members_csv=",".join(payload.members),
        budget=payload.budget,
        completion=payload.completion,
    )
    db.add(program)
    db.commit()
    db.refresh(program)
    return _to_out(program)


@router.put("/{program_id}", response_model=ProgramOut)
def update_program(program_id: int, payload: ProgramUpdate, db: Session = Depends(get_db)):
    program = db.query(Program).filter(Program.id == program_id).first()
    if not program:
        raise HTTPException(status_code=404, detail="Programa no encontrado")

    if payload.name is not None:
        program.name = payload.name
    if payload.logo is not None:
        program.logo = payload.logo
    if payload.color is not None:
        program.color = payload.color
    if payload.members is not None:
        program.members_csv = ",".join(payload.members)
    if payload.budget is not None:
        program.budget = payload.budget
    if payload.completion is not None:
        program.completion = payload.completion

    db.commit()
    db.refresh(program)
    return _to_out(program)


@router.delete("/{program_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_program(program_id: int, db: Session = Depends(get_db)):
    program = db.query(Program).filter(Program.id == program_id).first()
    if not program:
        raise HTTPException(status_code=404, detail="Programa no encontrado")
    db.delete(program)
    db.commit()
    return None
