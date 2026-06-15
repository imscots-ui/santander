from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import get_db
from models import User
from utils.auth_dependencies import get_current_user, get_current_admin
from utils.audit import log_action

router = APIRouter(prefix="/badges", tags=["Badges"])


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
def create_badge_item(payload: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_admin)):
    result = db.execute(text("""
        INSERT INTO badge_items (name, category, subcategory, description, routine_stock)
        VALUES (:name, :category, :subcategory, :description, :routine)
    """), {
        "name": payload["name"],
        "category": payload.get("category", "Misc"),
        "subcategory": payload.get("subcategory"),
        "description": payload.get("description", ""),
        "routine": payload.get("routine_stock", True)
    })
    badge_id = result.lastrowid
    if payload.get("routine_stock", True):
        db.execute(text("INSERT INTO badge_stock (badge_item_id, quantity) VALUES (:id, 0)"), {"id": badge_id})
    log_action(db, user_id=current_user.id, action="BADGE_CREATE", details=f"Created badge: {payload['name']}")
    db.commit()
    return {"id": badge_id, "message": "Badge created"}


@router.patch("/stock/{badge_id}")
def adjust_badge_stock(badge_id: int, payload: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_admin)):
    qty = payload.get("quantity", 0)
    existing = db.execute(text("SELECT id FROM badge_stock WHERE badge_item_id = :id"), {"id": badge_id}).fetchone()
    if existing:
        db.execute(text("UPDATE badge_stock SET quantity = quantity + :qty WHERE badge_item_id = :id"), {"qty": qty, "id": badge_id})
    else:
        db.execute(text("INSERT INTO badge_stock (badge_item_id, quantity) VALUES (:id, :qty)"), {"id": badge_id, "qty": qty})
    badge = db.execute(text("SELECT name FROM badge_items WHERE id = :id"), {"id": badge_id}).fetchone()
    log_action(db, user_id=current_user.id, action="BADGE_STOCK_ADJUST", details=f"Adjusted {badge.name} stock by {qty:+d}")
    db.commit()
    return {"message": "Stock updated"}


@router.post("/issue")
def issue_badge(payload: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    badge_id = payload["badge_item_id"]
    cadet_id = payload["cadet_id"]
    stock = db.execute(text("SELECT quantity FROM badge_stock WHERE badge_item_id = :id"), {"id": badge_id}).fetchone()
    if not stock or stock.quantity < 1:
        raise HTTPException(status_code=400, detail="No stock available for this badge")
    db.execute(text("UPDATE badge_stock SET quantity = quantity - 1 WHERE badge_item_id = :id"), {"id": badge_id})
    db.execute(text("""
        INSERT INTO badge_issued (badge_item_id, cadet_id, issued_by_id, notes)
        VALUES (:bid, :cid, :uid, :notes)
    """), {"bid": badge_id, "cid": cadet_id, "uid": current_user.id, "notes": payload.get("notes")})
    badge = db.execute(text("SELECT name FROM badge_items WHERE id = :id"), {"id": badge_id}).fetchone()
    cadet = db.execute(text("SELECT service_number, surname FROM cadets WHERE id = :id"), {"id": cadet_id}).fetchone()
    log_action(db, user_id=current_user.id, action="BADGE_ISSUE",
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
def return_badge(issued_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
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
    log_action(db, user_id=current_user.id, action="BADGE_RETURN", details=f"Returned badge: {badge.name}")
    db.commit()
    return {"message": "Badge returned"}
