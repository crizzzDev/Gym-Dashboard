from sqlalchemy import Column, Integer, String, Boolean
from .database import Base


class Member(Base):
    __tablename__ = "members"

    id = Column(Integer, primary_key=True, index=True)
    initials = Column(String(4), nullable=False)
    color = Column(String(16), nullable=False)
    name = Column(String(120), nullable=False, index=True)
    email = Column(String(160), nullable=False, unique=True, index=True)
    plan_tier = Column(String(40), nullable=False, default="Básico")
    plan_activity = Column(String(40), nullable=False, default="General")
    active = Column(Boolean, nullable=False, default=True)
    date = Column(String(10), nullable=False)


class Program(Base):
    __tablename__ = "programs"

    id = Column(Integer, primary_key=True, index=True)
    logo = Column(String(4), nullable=False)
    color = Column(String(16), nullable=False)
    name = Column(String(120), nullable=False)
    members_csv = Column(String(120), nullable=False, default="")
    budget = Column(String(40), nullable=False)
    completion = Column(Integer, nullable=False, default=0)
