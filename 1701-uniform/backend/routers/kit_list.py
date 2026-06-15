from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models import KitListItem, Item, Gender, User
from utils.auth_dependencies import get_current_user, get_current_admin, get_audit_user_id
from utils.audit import log_action
from pydantic import BaseModel

router = APIRouter(prefix="/kit-list", tags=["Kit List"])


class KitListItemCreate(BaseModel):
    item_id: int
    gender_restriction: Optional[Gender] = None
    display_label: Optional[str] = None
    group_key: Optional[str] = None


@router.get("/")
def list_kit_items(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Returns the full required kit list."""
    rows = db.query(KitListItem).order_by(KitListItem.group_key, KitListItem.id).all()
    return [
        {
            "id": r.id,
            "item_id": r.item_id,
            "item_name": r.item.short_name,
            "category": r.item.category,
            "gender_restriction": r.gender_restriction.value if r.gender_restriction else None,
            "display_label": r.display_label,
            "group_key": r.group_key,
        }
        for r in rows
    ]


@router.post("/")
def add_kit_item(
    payload: KitListItemCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
    audit_user_id: int = Depends(get_audit_user_id),
):
    """Admin only. Add an item to the required kit list."""
    item = db.query(Item).filter(Item.id == payload.item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    existing = db.query(KitListItem).filter(
        KitListItem.item_id == payload.item_id,
        KitListItem.gender_restriction == payload.gender_restriction,
    ).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail="This item is already in the kit list with the same gender restriction"
        )

    entry = KitListItem(
        item_id=payload.item_id,
        gender_restriction=payload.gender_restriction,
        display_label=payload.display_label or None,
        group_key=payload.group_key or None,
    )
    db.add(entry)
    log_action(
        db, user_id=audit_user_id, action="KIT_LIST_ADD",
        details=f"Added {item.short_name} to kit list" + (f" (gender: {payload.gender_restriction})" if payload.gender_restriction else ""),
        item_id=payload.item_id,
    )
    db.commit()
    db.refresh(entry)
    return {
        "id": entry.id,
        "item_id": entry.item_id,
        "item_name": item.short_name,
        "category": item.category,
        "gender_restriction": entry.gender_restriction.value if entry.gender_restriction else None,
        "display_label": entry.display_label,
        "group_key": entry.group_key,
    }


@router.delete("/{entry_id}")
def remove_kit_item(
    entry_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
    audit_user_id: int = Depends(get_audit_user_id),
):
    """Admin only. Remove an item from the required kit list."""
    entry = db.query(KitListItem).filter(KitListItem.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Kit list entry not found")

    item_name = entry.item.short_name
    db.delete(entry)
    log_action(
        db, user_id=audit_user_id, action="KIT_LIST_REMOVE",
        details=f"Removed {item_name} from kit list",
        item_id=entry.item_id,
    )
    db.commit()
    return {"message": f"{item_name} removed from kit list"}
