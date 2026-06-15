from sqlalchemy.orm import Session
from fastapi import HTTPException
from models import IssuedItem, ReturnedItem, Stock, UniformCondition
from utils.audit import log_action

UNSERVICEABLE_WARNING = (
    "⚠️ This item has been returned as UNSERVICEABLE. "
    "Please set it aside and return it to parent stores or arrange for destruction. "
    "It has NOT been returned to circulation."
)


def return_item(
    db: Session,
    issued_item_id: int,
    condition: UniformCondition,
    returned_by_id: int,
    notes: str = None,
) -> dict:
    # 1. Find the issued record
    issued = db.query(IssuedItem).filter(IssuedItem.id == issued_item_id).first()
    if not issued:
        raise HTTPException(status_code=404, detail="Issued item record not found")

    if issued.returned:
        raise HTTPException(status_code=400, detail="This item has already been returned")

    # 2. Create return record
    returned = ReturnedItem(
        issued_item_id=issued_item_id,
        returned_by_id=returned_by_id,
        condition=condition,
        notes=notes,
    )
    db.add(returned)

    # 3. Mark issued record as returned
    issued.returned = True

    # 4. Only return to stock if serviceable
    warning = None
    if condition == UniformCondition.serviceable:
        stock = db.query(Stock).filter(
            Stock.item_id == issued.item_id,
            Stock.size_id == issued.size_id,
        ).first()

        if not stock:
            raise HTTPException(status_code=500, detail="Stock record missing for this item/size")

        stock.quantity += issued.quantity
    else:
        warning = UNSERVICEABLE_WARNING

    # 5. Audit log
    cadet = issued.cadet
    item = issued.item
    size = issued.size

    log_action(
        db,
        user_id=returned_by_id,
        action="RETURN",
        details=(
            f"Returned {issued.quantity}x {item.short_name} size {size.size_label} "
            f"from cadet {cadet.service_number} ({cadet.surname}, {cadet.forename}). "
            f"Condition: {condition.value}."
            + (f" Notes: {notes}" if notes else "")
        ),
        cadet_id=issued.cadet_id,
        item_id=issued.item_id,
    )

    db.commit()
    db.refresh(returned)

    return {
        "return_id": returned.id,
        "issued_item_id": issued_item_id,
        "item_name": item.name,
        "size_label": size.size_label,
        "condition": condition,
        "returned_by": f"{returned.returned_by_user.forename} {returned.returned_by_user.surname}",
        "returned_at": returned.returned_at,
        "warning": warning,
    }
