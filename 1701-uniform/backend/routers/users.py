from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from database import get_db
from models import User
from schemas import UserCreate, UserOut
from utils.hashing import hash_password, verify_password
from utils.auth_dependencies import get_current_admin, get_current_user, get_audit_user_id
from utils.audit import log_action

router = APIRouter(prefix="/users", tags=["Users"])

STAFF_RANKS = ["CI", "Sgt", "FS", "WO", "A/Plt Off", "Plt Off", "Fg Off", "Flt Lt", "Sqn Ldr"]
STAFF_ROLES = ["OC", "Adj", "Trg Off", "SNCO", "CI"]


class UserCreateFull(BaseModel):
    forename: str
    surname: str
    rank: Optional[str] = None
    role: Optional[str] = None
    is_admin: bool = False


class PinVerify(BaseModel):
    user_id: int
    pin: str


# ── Public endpoint - no auth required ────────────────
@router.get("/public", tags=["Public"])
def list_staff_public(db: Session = Depends(get_db)):
    """Returns staff list for the selector screen — no auth required."""
    users = db.query(User).filter(User.active == True).order_by(User.surname).all()
    return [
        {
            "id": u.id,
            "display_name": f"{u.staff_rank+' ' if u.staff_rank else ''}{u.forename} {u.surname}",
            "rank": u.staff_rank,
            "role": u.role,
            "forename": u.forename,
            "surname": u.surname,
            "is_admin": u.is_admin,
        }
        for u in users
    ]


# ── Verify PIN (no full auth needed) ──────────────────
@router.post("/verify-pin")
def verify_pin(data: PinVerify, db: Session = Depends(get_db)):
    """Verify a user's PIN for admin access."""
    user = db.query(User).filter(User.id == data.user_id, User.active == True).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not verify_password(data.pin, user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect PIN")
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return {"verified": True, "user_id": user.id, "is_admin": user.is_admin}


# ── Admin endpoints ────────────────────────────────────
@router.post("/", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def create_user(
    user_in: UserCreateFull,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
    audit_user_id: int = Depends(get_audit_user_id),
):
    username = f"{user_in.surname.lower()}.{user_in.forename.lower()}"
    if db.query(User).filter(User.username == username).first():
        raise HTTPException(status_code=400, detail=f"Username '{username}' already exists")

    user = User(
        username=username,
        forename=user_in.forename,
        surname=user_in.surname,
        staff_rank=user_in.rank,
        role=user_in.role,
        password_hash=hash_password("1701"),  # Default PIN
        is_admin=user_in.is_admin,
    )
    db.add(user)
    log_action(db, user_id=audit_user_id, action="USER_CREATE",
               details=f"Created user {username} rank={user_in.rank} role={user_in.role}")
    db.commit()
    db.refresh(user)
    return user


@router.get("/")
def list_users(db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    users = db.query(User).order_by(User.surname).all()
    return [UserOut.from_orm_user(u) for u in users]


@router.patch("/{user_id}/deactivate")
def deactivate_user(user_id: int, db: Session = Depends(get_db), admin: User = Depends(get_current_admin),
                    audit_user_id: int = Depends(get_audit_user_id)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.id == admin.id:
        raise HTTPException(status_code=400, detail="Cannot deactivate yourself")
    user.active = False
    log_action(db, user_id=audit_user_id, action="USER_DEACTIVATE", details=f"Deactivated user {user.username}")
    db.commit()
    return {"message": f"User {user.username} deactivated"}


@router.patch("/{user_id}/reset-password")
def reset_password(user_id: int, db: Session = Depends(get_db), admin: User = Depends(get_current_admin),
                   audit_user_id: int = Depends(get_audit_user_id)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.password_hash = hash_password("1701")
    log_action(db, user_id=audit_user_id, action="USER_PASSWORD_RESET", details=f"Reset PIN for {user.username}")
    db.commit()
    return {"message": f"PIN reset for {user.username}. Default PIN: 1701"}


class ChangePinRequest(BaseModel):
    new_pin: str

@router.patch("/{user_id}/change-pin")
def change_pin(
    user_id: int,
    data: ChangePinRequest,
    db: Session = Depends(get_db),
):
    """Allow any user to change their own PIN - no admin required."""
    user = db.query(User).filter(User.id == user_id, User.active == True).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if len(data.new_pin) < 4:
        raise HTTPException(status_code=400, detail="PIN must be at least 4 characters")
    user.password_hash = hash_password(data.new_pin)
    db.commit()
    return {"message": "PIN updated successfully"}


@router.patch("/{user_id}/reactivate")
def reactivate_user(user_id: int, db: Session = Depends(get_db), admin: User = Depends(get_current_admin),
                    audit_user_id: int = Depends(get_audit_user_id)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.active = True
    log_action(db, user_id=audit_user_id, action="USER_REACTIVATE", details=f"Reactivated user {user.username}")
    db.commit()
    return {"message": f"{user.username} reactivated"}


@router.patch("/{user_id}/edit")
def edit_user(user_id: int, payload: dict, db: Session = Depends(get_db), admin: User = Depends(get_current_admin),
              audit_user_id: int = Depends(get_audit_user_id)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.forename = payload.get("forename", user.forename)
    user.surname = payload.get("surname", user.surname)
    user.staff_rank = payload.get("rank", user.staff_rank)
    user.role = payload.get("role", user.role)
    user.is_admin = payload.get("is_admin", user.is_admin)
    log_action(db, user_id=audit_user_id, action="USER_EDIT", details=f"Edited user {user.username}")
    db.commit()
    return {"message": "User updated"}
