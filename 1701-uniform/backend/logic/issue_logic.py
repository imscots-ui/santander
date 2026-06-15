from sqlalchemy.orm import Session
from fastapi import HTTPException
from models import Cadet, Item, Size, Stock, IssuedItem
from utils.audit import log_action


def issue_item(
    db: Session,
    cadet_id: int,
    item_id: int,
    size_id: int,
    quantity: int,
    issued_by_id: int,
    duplicate_reason: str = None,
    notes: str = None,
) -> IssuedItem:
    # 1. Validate cadet
    cadet = db.query(Cadet).filter(Cadet.id == cadet_id, Cadet.active == True).first()
    if not cadet:
        raise HTTPException(status_code=404, detail="Cadet not found or inactive")

    # 2. Validate item
    item = db.query(Item).filter(Item.id == item_id, Item.is_active == True).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    # 3. Validate size belongs to item
    size = db.query(Size).filter(Size.id == size_id, Size.item_id == item_id).first()
    if not size:
        raise HTTPException(status_code=404, detail="Size not found for this item")

    # 4. Check stock
    stock = db.query(Stock).filter(
        Stock.item_id == item_id,
        Stock.size_id == size_id
    ).first()

    if not stock or stock.quantity < quantity:
        available = stock.quantity if stock else 0
        raise HTTPException(
            status_code=400,
            detail=f"Insufficient stock. Requested: {quantity}, Available: {available}"
        )

    # 5. Check for existing unreturned issue of same item
    existing = db.query(IssuedItem).filter(
        IssuedItem.cadet_id == cadet_id,
        IssuedItem.item_id == item_id,
        IssuedItem.returned == False
    ).first()

    if existing and not item.allows_multiples:
        # Item doesn't allow multiples at all
        raise HTTPException(
            status_code=400,
            detail=f"Cadet already has this item issued (issue ID {existing.id}). This item cannot be issued multiple times."
        )

    if existing and item.allows_multiples and not duplicate_reason:
        # Multiples allowed but reason required
        raise HTTPException(
            status_code=400,
            detail="Cadet already has this item. A reason must be provided to issue another."
        )

    # 6. Deduct stock
    stock.quantity -= quantity

    # 7. Create issued record
    issued = IssuedItem(
        cadet_id=cadet_id,
        item_id=item_id,
        size_id=size_id,
        quantity=quantity,
        issued_by_id=issued_by_id,
        duplicate_reason=duplicate_reason,
        notes=notes,
    )
    db.add(issued)

    # 8. Audit log
    log_action(
        db,
        user_id=issued_by_id,
        action="ISSUE",
        details=f"Issued {quantity}x {item.short_name} size {size.size_label} to cadet {cadet.service_number} ({cadet.surname}, {cadet.forename})",
        cadet_id=cadet_id,
        item_id=item_id,
    )

    db.commit()
    db.refresh(issued)
    return issued
