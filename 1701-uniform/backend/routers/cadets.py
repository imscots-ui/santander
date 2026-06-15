from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from database import get_db
from models import Cadet, IssuedItem, User
from schemas import CadetCreate, CadetOut, CadetUpdate, IssuedItemDetail, CadetHistoryOut
from utils.auth_dependencies import get_current_user, get_current_admin, get_audit_user_id
from utils.audit import log_action

router = APIRouter(prefix="/cadets", tags=["Cadets"])


@router.post("/", response_model=CadetOut, status_code=status.HTTP_201_CREATED)
def create_cadet(
    cadet_in: CadetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    audit_user_id: int = Depends(get_audit_user_id),
):
    if db.query(Cadet).filter(Cadet.service_number == cadet_in.service_number).first():
        raise HTTPException(status_code=400, detail="Service number already exists")

    cadet = Cadet(**cadet_in.model_dump())
    db.add(cadet)
    log_action(db, user_id=audit_user_id, action="CADET_CREATE",
               details=f"Created cadet {cadet_in.service_number} {cadet_in.surname}, {cadet_in.forename}")
    db.commit()
    db.refresh(cadet)
    return cadet


@router.get("/", response_model=List[CadetOut])
def list_cadets(
    active_only: bool = True,
    search: Optional[str] = Query(None, description="Search by name or service number"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = db.query(Cadet)
    if active_only:
        q = q.filter(Cadet.active == True)
    if search:
        term = f"%{search}%"
        q = q.filter(
            Cadet.surname.ilike(term) |
            Cadet.forename.ilike(term) |
            Cadet.service_number.ilike(term)
        )
    return q.order_by(Cadet.surname, Cadet.forename).all()


@router.get("/{cadet_id}", response_model=CadetOut)
def get_cadet(
    cadet_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cadet = db.query(Cadet).filter(Cadet.id == cadet_id).first()
    if not cadet:
        raise HTTPException(status_code=404, detail="Cadet not found")
    return cadet


@router.patch("/{cadet_id}", response_model=CadetOut)
def update_cadet(
    cadet_id: int,
    update: CadetUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    audit_user_id: int = Depends(get_audit_user_id),
):
    cadet = db.query(Cadet).filter(Cadet.id == cadet_id).first()
    if not cadet:
        raise HTTPException(status_code=404, detail="Cadet not found")

    for field, value in update.model_dump(exclude_none=True).items():
        setattr(cadet, field, value)

    log_action(db, user_id=audit_user_id, action="CADET_UPDATE",
               details=f"Updated cadet {cadet.service_number}", cadet_id=cadet_id)
    db.commit()
    db.refresh(cadet)
    return cadet


@router.get("/{cadet_id}/issued", response_model=List[IssuedItemDetail])
def get_outstanding_kit(
    cadet_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Returns all currently outstanding (not returned) issued items for a cadet."""
    cadet = db.query(Cadet).filter(Cadet.id == cadet_id).first()
    if not cadet:
        raise HTTPException(status_code=404, detail="Cadet not found")

    issued = db.query(IssuedItem).filter(
        IssuedItem.cadet_id == cadet_id,
        IssuedItem.returned == False
    ).all()

    return _format_issued_list(issued)


@router.get("/{cadet_id}/history")
def get_cadet_history(
    cadet_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Full issue and return history for a cadet."""
    cadet = db.query(Cadet).filter(Cadet.id == cadet_id).first()
    if not cadet:
        raise HTTPException(status_code=404, detail="Cadet not found")

    all_issued = db.query(IssuedItem).filter(
        IssuedItem.cadet_id == cadet_id
    ).order_by(IssuedItem.issued_at.desc()).all()

    outstanding = [i for i in all_issued if not i.returned]
    history = all_issued

    return {
        "cadet": CadetOut.model_validate(cadet),
        "summary": {
            "total_issued": len(all_issued),
            "outstanding_count": len(outstanding),
            "returned_count": len([i for i in all_issued if i.returned]),
        },
        "outstanding": _format_issued_list(outstanding),
        "history": _format_issued_list(history),
    }


def _format_issued_list(issued_items: list) -> list:
    result = []
    for i in issued_items:
        entry = {
            "issued_id": i.id,
            "item_id": i.item_id,
            "item_name": i.item.name,
            "short_name": i.item.short_name,
            "size_label": i.size.size_label,
            "quantity": i.quantity,
            "issued_by": f"{i.issued_by_user.forename} {i.issued_by_user.surname}",
            "issued_at": i.issued_at,
            "returned": i.returned,
            "duplicate_reason": i.duplicate_reason,
            "notes": i.notes,
            "return_record": None,
        }
        if i.returned and i.return_record:
            r = i.return_record
            entry["return_record"] = {
                "return_id": r.id,
                "condition": r.condition.value,
                "returned_by": f"{r.returned_by_user.forename} {r.returned_by_user.surname}",
                "returned_at": r.returned_at,
                "notes": r.notes,
            }
        result.append(entry)
    return result


# ---------------------------------------------------------
# DEACTIVATE CADET (Soft Delete)
# ---------------------------------------------------------
@router.patch("/{cadet_id}/deactivate")
def deactivate_cadet(
    cadet_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
    audit_user_id: int = Depends(get_audit_user_id),
):
    cadet = db.query(Cadet).filter(Cadet.id == cadet_id).first()
    if not cadet:
        raise HTTPException(status_code=404, detail="Cadet not found")

    # Check for outstanding kit
    outstanding = db.query(IssuedItem).filter(
        IssuedItem.cadet_id == cadet_id,
        IssuedItem.returned == False
    ).count()

    if outstanding > 0:
        raise HTTPException(
            status_code=400,
            detail=f"Cadet has {outstanding} item(s) still outstanding. Please process all returns before deactivating."
        )

    cadet.active = False
    log_action(db, user_id=audit_user_id, action="CADET_DEACTIVATE",
               details=f"Deactivated cadet {cadet.service_number} {cadet.surname}, {cadet.forename}",
               cadet_id=cadet_id)
    db.commit()
    return {"message": f"Cadet {cadet.service_number} {cadet.surname} deactivated"}


# ---------------------------------------------------------
# REACTIVATE CADET
# ---------------------------------------------------------
@router.patch("/{cadet_id}/reactivate")
def reactivate_cadet(
    cadet_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
    audit_user_id: int = Depends(get_audit_user_id),
):
    cadet = db.query(Cadet).filter(Cadet.id == cadet_id).first()
    if not cadet:
        raise HTTPException(status_code=404, detail="Cadet not found")

    cadet.active = True
    log_action(db, user_id=audit_user_id, action="CADET_REACTIVATE",
               details=f"Reactivated cadet {cadet.service_number} {cadet.surname}, {cadet.forename}",
               cadet_id=cadet_id)
    db.commit()
    return {"message": f"Cadet {cadet.service_number} {cadet.surname} reactivated"}


@router.patch("/{cadet_id}/rank")
def update_cadet_rank(
    cadet_id: int,
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    audit_user_id: int = Depends(get_audit_user_id),
):
    cadet = db.query(Cadet).filter(Cadet.id == cadet_id).first()
    if not cadet:
        raise HTTPException(status_code=404, detail="Cadet not found")
    old_rank = cadet.rank
    cadet.rank = payload.get("rank", cadet.rank)
    log_action(db, user_id=audit_user_id, action="CADET_RANK_UPDATE",
               details=f"Rank updated {old_rank} -> {cadet.rank} for {cadet.service_number} {cadet.surname}",
               cadet_id=cadet_id)
    db.commit()
    return {"message": f"Rank updated to {cadet.rank}"}
