from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import Stock, Item, Size, User
from schemas import StockOut, StockAdjust
from utils.auth_dependencies import get_current_user, get_current_admin, get_audit_user_id
from utils.audit import log_action

router = APIRouter(prefix="/stock", tags=["Stock"])


@router.get("/", response_model=List[StockOut])
def list_stock(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    rows = (
        db.query(Stock, Item, Size)
        .join(Item, Stock.item_id == Item.id)
        .join(Size, Stock.size_id == Size.id)
        .order_by(Item.category, Item.short_name, Size.size_label)
        .all()
    )
    return [
        StockOut(
            stock_id=s.id,
            item_id=s.item_id,
            item_name=item.name,
            short_name=item.short_name,
            category=item.category,
            size_id=s.size_id,
            size_label=size.size_label,
            quantity=s.quantity,
        )
        for s, item, size in rows
    ]


@router.get("/low", response_model=List[StockOut])
def low_stock(
    threshold: int = 3,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Returns all stock lines where quantity is at or below the threshold."""
    rows = (
        db.query(Stock, Item, Size)
        .join(Item, Stock.item_id == Item.id)
        .join(Size, Stock.size_id == Size.id)
        .filter(Stock.quantity <= threshold)
        .order_by(Stock.quantity, Item.short_name)
        .all()
    )
    return [
        StockOut(
            stock_id=s.id,
            item_id=s.item_id,
            item_name=item.name,
            short_name=item.short_name,
            category=item.category,
            size_id=s.size_id,
            size_label=size.size_label,
            quantity=s.quantity,
        )
        for s, item, size in rows
    ]


@router.post("/adjust")
def adjust_stock(
    adjustment: StockAdjust,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
    audit_user_id: int = Depends(get_audit_user_id),
):
    """Admin only. Add or remove stock. Use positive quantity to add, negative to remove."""
    item = db.query(Item).filter(Item.id == adjustment.item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    size = db.query(Size).filter(
        Size.id == adjustment.size_id,
        Size.item_id == adjustment.item_id
    ).first()
    if not size:
        raise HTTPException(status_code=404, detail="Size not found for this item")

    stock = db.query(Stock).filter(
        Stock.item_id == adjustment.item_id,
        Stock.size_id == adjustment.size_id,
    ).first()

    if not stock:
        if adjustment.quantity < 0:
            raise HTTPException(status_code=400, detail="No stock record exists to remove from")
        stock = Stock(item_id=adjustment.item_id, size_id=adjustment.size_id, quantity=0)
        db.add(stock)

    new_qty = stock.quantity + adjustment.quantity
    if new_qty < 0:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot reduce below zero. Current: {stock.quantity}, Adjustment: {adjustment.quantity}"
        )

    stock.quantity = new_qty

    action = "STOCK_ADD" if adjustment.quantity > 0 else "STOCK_REMOVE"
    reason_suffix = f" — {adjustment.reason}" if adjustment.reason else ""
    log_action(
        db, user_id=audit_user_id, action=action,
        details=f"{action}: {item.short_name} size {size.size_label} by {adjustment.quantity} (new total: {new_qty}){reason_suffix}",
        item_id=adjustment.item_id,
    )
    db.commit()

    return {
        "item_name": item.short_name,
        "size_label": size.size_label,
        "previous_quantity": stock.quantity - adjustment.quantity,
        "adjustment": adjustment.quantity,
        "new_quantity": new_qty,
    }


@router.post("/bulk-adjust")
def bulk_adjust_stock(
    adjustments: List[StockAdjust],
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
    audit_user_id: int = Depends(get_audit_user_id),
):
    """Admin only. Bulk add stock for multiple items at once."""
    results = []
    for adj in adjustments:
        item = db.query(Item).filter(Item.id == adj.item_id).first()
        size = db.query(Size).filter(Size.id == adj.size_id, Size.item_id == adj.item_id).first()

        if not item or not size:
            results.append({"error": f"Item {adj.item_id} or size {adj.size_id} not found"})
            continue

        stock = db.query(Stock).filter(
            Stock.item_id == adj.item_id,
            Stock.size_id == adj.size_id,
        ).first()

        if not stock:
            stock = Stock(item_id=adj.item_id, size_id=adj.size_id, quantity=0)
            db.add(stock)

        new_qty = max(0, stock.quantity + adj.quantity)
        stock.quantity = new_qty

        action = "STOCK_BULK_ADD" if adj.quantity > 0 else "STOCK_REMOVE"
        reason_suffix = f" — {adj.reason}" if adj.reason else ""
        log_action(db, user_id=audit_user_id, action=action,
                   details=f"{'Bulk' if adj.quantity > 0 else 'Remove'}: {item.short_name} {size.size_label} {adj.quantity:+d} = {new_qty}{reason_suffix}",
                   item_id=adj.item_id)

        results.append({
            "item": item.short_name,
            "size": size.size_label,
            "new_quantity": new_qty,
        })

    db.commit()
    return {"updated": results}


from models import IssuedItem


@router.delete("/item/{item_id}/size/{size_id}")
def delete_stock_line(
    item_id: int,
    size_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
    audit_user_id: int = Depends(get_audit_user_id),
):
    # Check no outstanding issued items for this size
    outstanding = db.query(IssuedItem).filter(
        IssuedItem.item_id == item_id,
        IssuedItem.size_id == size_id,
        IssuedItem.returned == False
    ).count()

    if outstanding > 0:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot remove — {outstanding} item(s) of this size are currently issued to cadets."
        )

    stock = db.query(Stock).filter(
        Stock.item_id == item_id,
        Stock.size_id == size_id
    ).first()

    if not stock:
        raise HTTPException(status_code=404, detail="Stock line not found")

    item = db.query(Item).filter(Item.id == item_id).first()
    size = db.query(Size).filter(Size.id == size_id).first()

    db.delete(stock)
    db.delete(size)

    log_action(db, user_id=audit_user_id, action="STOCK_DELETE",
               details=f"Deleted stock line: {item.short_name if item else item_id} size {size.size_label if size else size_id}",
               item_id=item_id)
    db.commit()
    return {"message": "Stock line removed successfully"}
