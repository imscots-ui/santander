from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import Item, Size, Stock
from schemas import ItemOut, StockCheckResult
from utils.auth_dependencies import get_current_user

router = APIRouter(prefix="/items", tags=["Items"])


@router.get("/", response_model=List[ItemOut])
def list_items(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return db.query(Item).filter(Item.is_active == True).order_by(Item.category, Item.short_name).all()


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
