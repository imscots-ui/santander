from sqlalchemy.orm import Session
from models import AuditLog


def log_action(
    db: Session,
    user_id: int,
    action: str,
    details: str = None,
    cadet_id: int = None,
    item_id: int = None,
):
    entry = AuditLog(
        user_id=user_id,
        action=action,
        details=details,
        cadet_id=cadet_id,
        item_id=item_id,
    )
    db.add(entry)
    # Caller is responsible for db.commit()
