from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from schemas import IssueRequest, IssueOut, ReturnRequest, ReturnOut
from logic.issue_logic import issue_item
from logic.return_logic import return_item
from utils.auth_dependencies import get_current_user
from models import User

router = APIRouter(prefix="/transactions", tags=["Transactions"])


@router.post("/issue", response_model=IssueOut, status_code=201)
def issue(
    request: IssueRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Issue a uniform item to a cadet.
    - Any staff member can issue.
    - If cadet already has this item and it allows multiples, duplicate_reason is required.
    - Stock is deducted immediately.
    """
    issued = issue_item(
        db=db,
        cadet_id=request.cadet_id,
        item_id=request.item_id,
        size_id=request.size_id,
        quantity=request.quantity,
        issued_by_id=current_user.id,
        duplicate_reason=request.duplicate_reason,
        notes=request.notes,
    )

    return IssueOut(
        issue_id=issued.id,
        cadet_id=issued.cadet_id,
        item_name=issued.item.name,
        short_name=issued.item.short_name,
        size_label=issued.size.size_label,
        quantity=issued.quantity,
        issued_by=f"{current_user.forename} {current_user.surname}",
        issued_at=issued.issued_at,
        duplicate_reason=issued.duplicate_reason,
        notes=issued.notes,
    )


@router.post("/return", response_model=ReturnOut)
def process_return(
    request: ReturnRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Return a uniform item from a cadet.
    - Any staff member can process a return.
    - Condition must be specified: serviceable or unserviceable.
    - Serviceable items go back into stock.
    - Unserviceable items do NOT return to stock — a warning is shown.
    """
    result = return_item(
        db=db,
        issued_item_id=request.issued_item_id,
        condition=request.condition,
        returned_by_id=current_user.id,
        notes=request.notes,
    )

    return ReturnOut(**result)


from fastapi import APIRouter
from sqlalchemy.orm import Session
from models import ReturnedItem, IssuedItem, Item, Size, Cadet, User, UniformCondition

@router.get("/returns/unserviceable")
def get_unserviceable(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Returns all items marked as unserviceable."""
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
