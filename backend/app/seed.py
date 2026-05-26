from sqlalchemy.orm import Session

from .models import Member, Program


SEED_MEMBERS = [
    {"initials": "LC", "color": "#e94560", "name": "Laura Castro",     "email": "laura@gmail.com",  "plan_tier": "Premium", "plan_activity": "CrossFit", "active": True,  "date": "12/01/25"},
    {"initials": "JR", "color": "#0891b2", "name": "Juan Rodríguez",   "email": "juan@gmail.com",   "plan_tier": "Básico",  "plan_activity": "Pesas",    "active": True,  "date": "03/03/25"},
    {"initials": "AM", "color": "#059669", "name": "Andrés Mejía",     "email": "andres@gmail.com", "plan_tier": "Premium", "plan_activity": "Spinning", "active": False, "date": "18/11/24"},
    {"initials": "VG", "color": "#d97706", "name": "Valentina Gómez",  "email": "vale@gmail.com",   "plan_tier": "Premium", "plan_activity": "Yoga",     "active": True,  "date": "05/02/25"},
    {"initials": "DR", "color": "#7c3aed", "name": "Diego Ruiz",       "email": "diego@gmail.com",  "plan_tier": "Básico",  "plan_activity": "Cardio",   "active": False, "date": "22/09/24"},
    {"initials": "SM", "color": "#be123c", "name": "Sofía Martínez",   "email": "sofia@gmail.com",  "plan_tier": "Premium", "plan_activity": "Pilates",  "active": True,  "date": "30/04/25"},
]


SEED_PROGRAMS = [
    {"logo": "CF", "color": "#e94560", "name": "CrossFit Élite",       "members_csv": "A,B,C", "budget": "$2,800,000", "completion": 80},
    {"logo": "YO", "color": "#059669", "name": "Yoga & Meditación",    "members_csv": "D,E",   "budget": "$950,000",   "completion": 60},
    {"logo": "SP", "color": "#0891b2", "name": "Spinning Pro",         "members_csv": "F,G,H", "budget": "$1,200,000", "completion": 100},
    {"logo": "PL", "color": "#7c3aed", "name": "Pilates Reforma",      "members_csv": "I,J",   "budget": "$800,000",   "completion": 45},
    {"logo": "BO", "color": "#d97706", "name": "Boxeo Funcional",      "members_csv": "K",     "budget": "$1,500,000", "completion": 30},
    {"logo": "NA", "color": "#0891b2", "name": "Natación Adultos",     "members_csv": "L,M",   "budget": "No asignado","completion": 10},
]


def seed_if_empty(db: Session) -> None:
    if db.query(Member).count() == 0:
        db.add_all([Member(**m) for m in SEED_MEMBERS])
    if db.query(Program).count() == 0:
        db.add_all([Program(**p) for p in SEED_PROGRAMS])
    db.commit()
