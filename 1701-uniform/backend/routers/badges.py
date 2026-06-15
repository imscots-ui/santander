from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Optional
from pydantic import BaseModel, field_validator
from database import get_db
from models import User
from utils.auth_dependencies import get_current_user, get_current_admin, get_audit_user_id
from utils.audit import log_action

router = APIRouter(prefix="/badges", tags=["Badges"])


class BadgeItemCreate(BaseModel):
    name: str
    category: Optional[str] = "Misc"
    subcategory: Optional[str] = None
    description: Optional[str] = ""
    routine_stock: bool = True

    @field_validator('name')
    @classmethod
    def name_not_blank(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError('must not be blank')
        return v.strip()


class BadgeStockAdjust(BaseModel):
    quantity: int

    @field_validator('quantity')
    @classmethod
    def quantity_nonzero(cls, v: int) -> int:
        if v == 0:
            raise ValueError('quantity must be non-zero')
        return v


class BadgeIssueRequest(BaseModel):
    badge_item_id: int
    cadet_id: int
    notes: Optional[str] = None


@router.get("/items")
def list_badge_items(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    rows = db.execute(text("""
        SELECT bi.id, bi.name, bi.category, bi.subcategory, bi.description,
               bi.is_active, bi.routine_stock,
               COALESCE(bs.quantity, 0) as quantity
        FROM badge_items bi
        LEFT JOIN badge_stock bs ON bs.badge_item_id = bi.id
        WHERE bi.is_active = 1
        ORDER BY bi.category, bi.subcategory, bi.name
    """)).fetchall()
    return [dict(r._mapping) for r in rows]


@router.post("/items")
def create_badge_item(payload: BadgeItemCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_admin),
                      audit_user_id: int = Depends(get_audit_user_id)):
    result = db.execute(text("""
        INSERT INTO badge_items (name, category, subcategory, description, routine_stock)
        VALUES (:name, :category, :subcategory, :description, :routine)
    """), {
        "name": payload.name,
        "category": payload.category or "Misc",
        "subcategory": payload.subcategory,
        "description": payload.description or "",
        "routine": payload.routine_stock,
    })
    badge_id = result.lastrowid
    if payload.routine_stock:
        db.execute(text("INSERT INTO badge_stock (badge_item_id, quantity) VALUES (:id, 0)"), {"id": badge_id})
    log_action(db, user_id=audit_user_id, action="BADGE_CREATE", details=f"Created badge: {payload.name}")
    db.commit()
    return {"id": badge_id, "message": "Badge created"}


@router.patch("/stock/{badge_id}")
def adjust_badge_stock(badge_id: int, payload: BadgeStockAdjust, db: Session = Depends(get_db),
                       current_user: User = Depends(get_current_admin),
                       audit_user_id: int = Depends(get_audit_user_id)):
    badge = db.execute(text("SELECT name FROM badge_items WHERE id = :id"), {"id": badge_id}).fetchone()
    if not badge:
        raise HTTPException(status_code=404, detail="Badge not found")
    existing = db.execute(text("SELECT id, quantity FROM badge_stock WHERE badge_item_id = :id"), {"id": badge_id}).fetchone()
    if existing:
        new_qty = existing.quantity + payload.quantity
        if new_qty < 0:
            raise HTTPException(status_code=400, detail=f"Cannot reduce below zero (current: {existing.quantity})")
        db.execute(text("UPDATE badge_stock SET quantity = :qty WHERE badge_item_id = :id"), {"qty": new_qty, "id": badge_id})
    else:
        if payload.quantity < 0:
            raise HTTPException(status_code=400, detail="No stock record exists to remove from")
        db.execute(text("INSERT INTO badge_stock (badge_item_id, quantity) VALUES (:id, :qty)"), {"id": badge_id, "qty": payload.quantity})
    log_action(db, user_id=audit_user_id, action="BADGE_STOCK_ADJUST", details=f"Adjusted {badge.name} stock by {payload.quantity:+d}")
    db.commit()
    return {"message": "Stock updated"}


@router.post("/issue")
def issue_badge(payload: BadgeIssueRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user),
                audit_user_id: int = Depends(get_audit_user_id)):
    badge_id = payload.badge_item_id
    cadet_id = payload.cadet_id
    stock = db.execute(text("SELECT quantity FROM badge_stock WHERE badge_item_id = :id"), {"id": badge_id}).fetchone()
    if not stock or stock.quantity < 1:
        raise HTTPException(status_code=400, detail="No stock available for this badge")
    db.execute(text("UPDATE badge_stock SET quantity = quantity - 1 WHERE badge_item_id = :id"), {"id": badge_id})
    db.execute(text("""
        INSERT INTO badge_issued (badge_item_id, cadet_id, issued_by_id, notes)
        VALUES (:bid, :cid, :uid, :notes)
    """), {"bid": badge_id, "cid": cadet_id, "uid": audit_user_id, "notes": payload.notes})
    badge = db.execute(text("SELECT name FROM badge_items WHERE id = :id"), {"id": badge_id}).fetchone()
    cadet = db.execute(text("SELECT service_number, surname FROM cadets WHERE id = :id"), {"id": cadet_id}).fetchone()
    log_action(db, user_id=audit_user_id, action="BADGE_ISSUE",
               details=f"Issued {badge.name} to {cadet.service_number} {cadet.surname}", cadet_id=cadet_id)
    db.commit()
    return {"message": "Badge issued"}


@router.get("/issued/cadet/{cadet_id}")
def get_cadet_badges(cadet_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    rows = db.execute(text("""
        SELECT bi.id as issued_id, bitem.name, bitem.category, bitem.subcategory,
               bi.issued_at, bi.returned, bi.returned_at,
               CONCAT(u.forename, ' ', u.surname) as issued_by
        FROM badge_issued bi
        JOIN badge_items bitem ON bitem.id = bi.badge_item_id
        JOIN users u ON u.id = bi.issued_by_id
        WHERE bi.cadet_id = :cid
        ORDER BY bi.issued_at DESC
    """), {"cid": cadet_id}).fetchall()
    return [dict(r._mapping) for r in rows]


@router.patch("/return/{issued_id}")
def return_badge(issued_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user),
                 audit_user_id: int = Depends(get_audit_user_id)):
    issued = db.execute(text("SELECT badge_item_id, returned FROM badge_issued WHERE id = :id"), {"id": issued_id}).fetchone()
    if not issued:
        raise HTTPException(status_code=404, detail="Badge issue record not found")
    if issued.returned:
        raise HTTPException(status_code=400, detail="Badge already returned")
    db.execute(text("UPDATE badge_issued SET returned = 1, returned_at = NOW() WHERE id = :id"), {"id": issued_id})
    # Only return to stock if it has a stock row
    existing = db.execute(text("SELECT id FROM badge_stock WHERE badge_item_id = :id"), {"id": issued.badge_item_id}).fetchone()
    if existing:
        db.execute(text("UPDATE badge_stock SET quantity = quantity + 1 WHERE badge_item_id = :id"), {"id": issued.badge_item_id})
    badge = db.execute(text("SELECT name FROM badge_items WHERE id = :id"), {"id": issued.badge_item_id}).fetchone()
    log_action(db, user_id=audit_user_id, action="BADGE_RETURN", details=f"Returned badge: {badge.name}")
    db.commit()
    return {"message": "Badge returned"}
