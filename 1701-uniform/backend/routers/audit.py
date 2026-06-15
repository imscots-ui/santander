from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from database import get_db
from models import AuditLog, User
from utils.auth_dependencies import get_current_user

router = APIRouter(prefix="/audit", tags=["Audit"])


@router.get("/")
def get_audit_log(
    limit: int = Query(100, le=1000),
    offset: int = 0,
    action: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = db.query(AuditLog)
    if action:
        q = q.filter(AuditLog.action == action.upper())
    logs = q.order_by(AuditLog.timestamp.desc()).offset(offset).limit(limit).all()

    return [
        {
            "id": log.id,
            "action": log.action,
            "details": log.details,
            "timestamp": log.timestamp,
            "user_id": log.user_id,
            "user_name": f"{log.user.forename} {log.user.surname}",
            "cadet_id": log.cadet_id,
            "item_id": log.item_id,
        }
        for log in logs
    ]


@router.get("/cadet/{cadet_id}")
def get_cadet_audit(
    cadet_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    logs = (
        db.query(AuditLog)
        .filter(AuditLog.cadet_id == cadet_id)
        .order_by(AuditLog.timestamp.desc())
        .all()
    )

    return [
        {
            "id": log.id,
            "action": log.action,
            "details": log.details,
            "timestamp": log.timestamp,
            "user_name": f"{log.user.forename} {log.user.surname}",
        }
        for log in logs
    ]


@router.get("/unserviceable")
def get_unserviceable_items(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    from models import ReturnedItem, UniformCondition
    records = (
        db.query(ReturnedItem)
        .filter(ReturnedItem.condition == UniformCondition.unserviceable)
        .order_by(ReturnedItem.returned_at.desc())
        .all()
    )
    result = []
    for r in records:
        issued = r.issued_item
        cadet = issued.cadet if issued else None
        item = issued.item if issued else None
        size = issued.size if issued else None
        staff = r.returned_by_user
        result.append({
            "return_id": r.id,
            "returned_at": r.returned_at,
            "item_name": item.short_name if item else "Unknown",
            "size_label": size.size_label if size else "Unknown",
            "returned_by": f"{staff.forename} {staff.surname}" if staff else "Unknown",
            "cadet_name": f"{cadet.rank} {cadet.surname}, {cadet.forename}" if cadet else "Unknown",
            "notes": r.notes,
        })
    return result
