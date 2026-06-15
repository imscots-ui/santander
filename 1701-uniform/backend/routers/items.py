from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from database import get_db
from models import Item, Size, Stock, IssuedItem, User
from schemas import ItemOut, StockCheckResult
from utils.auth_dependencies import get_current_user, get_current_admin, get_audit_user_id
from utils.audit import log_action
from pydantic import BaseModel

router = APIRouter(prefix="/items", tags=["Items"])


class SizeCreate(BaseModel):
    size_label: str


class ItemCreate(BaseModel):
    name: str
    short_name: str
    category: Optional[str] = None
    allows_multiples: bool = False
    sizes: List[str] = []


@router.get("/", response_model=List[ItemOut])
def list_items(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return db.query(Item).filter(Item.is_active == True).order_by(Item.category, Item.short_name).all()


@router.get("/archived", response_model=List[ItemOut])
def list_archived_items(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    return db.query(Item).filter(Item.is_active == False).order_by(Item.category, Item.short_name).all()


@router.get("/{item_id}", response_model=ItemOut)
def get_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@router.post("/", response_model=ItemOut)
def create_item(
    payload: ItemCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
    audit_user_id: int = Depends(get_audit_user_id),
):
    """Admin only. Add a new uniform item."""
    if db.query(Item).filter(Item.short_name == payload.short_name).first():
        raise HTTPException(status_code=400, detail="An item with this short name already exists")

    item = Item(
        name=payload.name,
        short_name=payload.short_name,
        category=payload.category or None,
        allows_multiples=payload.allows_multiples,
    )
    db.add(item)
    db.flush()

    for label in payload.sizes:
        label = label.strip()
        if label:
            db.add(Size(item_id=item.id, size_label=label))

    log_action(db, user_id=audit_user_id, action="ITEM_CREATE",
               details=f"Created item: {payload.short_name}" + (f" with {len(payload.sizes)} size(s)" if payload.sizes else ""),
               item_id=item.id)
    db.commit()
    db.refresh(item)
    return item


@router.post("/{item_id}/sizes")
def add_size(
    item_id: int,
    payload: SizeCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
    audit_user_id: int = Depends(get_audit_user_id),
):
    """Admin only. Add a new size to an existing item."""
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    label = payload.size_label.strip()
    if not label:
        raise HTTPException(status_code=400, detail="Size label cannot be empty")

    existing = db.query(Size).filter(Size.item_id == item_id, Size.size_label == label).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Size '{label}' already exists for this item")

    size = Size(item_id=item_id, size_label=label)
    db.add(size)
    log_action(db, user_id=audit_user_id, action="ITEM_ADD_SIZE",
               details=f"Added size '{label}' to {item.short_name}",
               item_id=item_id)
    db.commit()
    db.refresh(size)
    return {"id": size.id, "size_label": size.size_label, "item_id": item_id}


@router.patch("/{item_id}/deactivate")
def deactivate_item(
    item_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
    audit_user_id: int = Depends(get_audit_user_id),
):
    """Admin only. Archive an item so it no longer appears in the active catalogue."""
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    outstanding = db.query(IssuedItem).filter(IssuedItem.item_id == item_id, IssuedItem.returned == False).count()
    if outstanding > 0:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot archive '{item.short_name}' — {outstanding} unit(s) are still outstanding"
        )
    item.is_active = False
    log_action(db, user_id=audit_user_id, action="ITEM_DEACTIVATE",
               details=f"Archived item: {item.short_name}", item_id=item_id)
    db.commit()
    return {"message": f"Item '{item.short_name}' archived"}


@router.patch("/{item_id}/reactivate")
def reactivate_item(
    item_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
    audit_user_id: int = Depends(get_audit_user_id),
):
    """Admin only. Restore a previously archived item."""
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    item.is_active = True
    log_action(db, user_id=audit_user_id, action="ITEM_REACTIVATE",
               details=f"Restored item: {item.short_name}", item_id=item_id)
    db.commit()
    return {"message": f"Item '{item.short_name}' restored"}


@router.delete("/{item_id}/sizes/{size_id}", status_code=204)
def delete_size(
    item_id: int,
    size_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
    audit_user_id: int = Depends(get_audit_user_id),
):
    """Admin only. Remove a size from an item, provided no issued items reference it."""
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    size = db.query(Size).filter(Size.id == size_id, Size.item_id == item_id).first()
    if not size:
        raise HTTPException(status_code=404, detail="Size not found for this item")

    in_use = db.query(IssuedItem).filter(IssuedItem.size_id == size_id).count()
    if in_use > 0:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot delete size '{size.size_label}' — it is referenced by {in_use} issued item record(s)"
        )

    log_action(db, user_id=audit_user_id, action="ITEM_DELETE_SIZE",
               details=f"Deleted size '{size.size_label}' from {item.short_name}",
               item_id=item_id)
    db.delete(size)
    db.commit()


@router.get("/{item_id}/sizes/{size_id}/stock", response_model=StockCheckResult)
def check_stock(
    item_id: int,
    size_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Check if a specific size is in stock."""
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    size = db.query(Size).filter(Size.id == size_id, Size.item_id == item_id).first()
    if not size:
        raise HTTPException(status_code=404, detail="Size not found for this item")

    stock = db.query(Stock).filter(
        Stock.item_id == item_id,
        Stock.size_id == size_id
    ).first()

    qty = stock.quantity if stock else 0

    return StockCheckResult(
        item_name=item.name,
        short_name=item.short_name,
        size_label=size.size_label,
        quantity=qty,
        in_stock=qty > 0,
    )
