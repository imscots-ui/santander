from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import Cadet, IssuedItem, Stock, AuditLog, KitListItem, Item, Gender, User
from utils.auth_dependencies import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/")
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    total_cadets = db.query(Cadet).count()
    active_cadets = db.query(Cadet).filter(Cadet.active == True).all()
    total_active = len(active_cadets)

    total_issued = db.query(IssuedItem).filter(IssuedItem.returned == False).count()

    # Low stock (threshold = 3)
    from routers.stock import low_stock as get_low_stock
    low_stock_items = get_low_stock(threshold=3, db=db, current_user=current_user)

    # Missing kit calculation
    kit_list = db.query(KitListItem).all()
    missing_kit_detail = []

    for cadet in active_cadets:
        missing = _get_missing_kit(db, cadet, kit_list)
        if missing:
            missing_kit_detail.append({
                "cadet_id": cadet.id,
                "service_number": cadet.service_number,
                "rank": cadet.rank,
                "forename": cadet.forename,
                "surname": cadet.surname,
                "flight": cadet.flight,
                "missing_items": missing,
            })

    # Recent activity (last 10 audit log entries)
    logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(10).all()
    recent_activity = [
        {
            "id": log.id,
            "action": log.action,
            "details": log.details,
            "timestamp": log.timestamp,
            "user": f"{log.user.forename} {log.user.surname}",
        }
        for log in logs
    ]

    return {
        "total_cadets": total_cadets,
        "total_active_cadets": total_active,
        "total_items_outstanding": total_issued,
        "cadets_missing_kit": len(missing_kit_detail),
        "missing_kit_detail": missing_kit_detail,
        "low_stock": low_stock_items,
        "recent_activity": recent_activity,
    }


def _get_missing_kit(db: Session, cadet: Cadet, kit_list: list) -> List[str]:
    """
    Returns a list of kit item labels that the cadet is missing.
    Handles gender-specific rules and group logic (e.g. skirt OR slacks for females).
    """
    # Get cadet's currently issued item IDs (not returned)
    issued_item_ids = {
        row.item_id
        for row in db.query(IssuedItem.item_id)
        .filter(IssuedItem.cadet_id == cadet.id, IssuedItem.returned == False)
        .all()
    }

    missing = []
    handled_groups = set()

    for kit_entry in kit_list:
        # Skip if gender-restricted and doesn't apply to this cadet
        if kit_entry.gender_restriction and kit_entry.gender_restriction != cadet.gender:
            continue

        # Handle group logic — if group already satisfied, skip
        if kit_entry.group_key:
            if kit_entry.group_key in handled_groups:
                continue
            # Check if any item in this group has been issued
            group_items = [k for k in kit_list if k.group_key == kit_entry.group_key]
            group_item_ids = {k.item_id for k in group_items}
            if group_item_ids & issued_item_ids:
                handled_groups.add(kit_entry.group_key)
                continue
            else:
                # Group not satisfied — report it once with the display label
                label = kit_entry.display_label or kit_entry.item.short_name
                missing.append(label)
                handled_groups.add(kit_entry.group_key)
        else:
            if kit_entry.item_id not in issued_item_ids:
                label = kit_entry.display_label or kit_entry.item.short_name
                missing.append(label)

    return missing
