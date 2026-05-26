from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field, ConfigDict


class MemberBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: str = Field(..., max_length=160)
    plan: List[str] = Field(default_factory=lambda: ["Básico", "General"])
    active: bool = True


class MemberCreate(MemberBase):
    initials: Optional[str] = None
    color: Optional[str] = None
    date: Optional[str] = None


class MemberUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    plan: Optional[List[str]] = None
    active: Optional[bool] = None


class MemberOut(BaseModel):
    id: int
    initials: str
    color: str
    name: str
    email: str
    plan: List[str]
    active: bool
    date: str

    model_config = ConfigDict(from_attributes=True)


class ProgramBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    logo: Optional[str] = None
    color: Optional[str] = None
    members: List[str] = Field(default_factory=list)
    budget: str = "No asignado"
    completion: int = Field(0, ge=0, le=100)


class ProgramCreate(ProgramBase):
    pass


class ProgramUpdate(BaseModel):
    name: Optional[str] = None
    logo: Optional[str] = None
    color: Optional[str] = None
    members: Optional[List[str]] = None
    budget: Optional[str] = None
    completion: Optional[int] = None


class ProgramOut(BaseModel):
    id: int
    logo: str
    color: str
    name: str
    members: List[str]
    budget: str
    completion: int

    model_config = ConfigDict(from_attributes=True)


class StatsOut(BaseModel):
    total_members: int
    active_members: int
    inactive_members: int
    total_programs: int
    avg_completion: float
