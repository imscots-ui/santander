from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Optional
from pydantic import BaseModel
from database import get_db
from models import User
from utils.auth_dependencies import get_current_user, get_current_admin
from utils.audit import log_action

router = APIRouter(prefix="/feedback", tags=["Feedback"])


class FeedbackSubmit(BaseModel):
    subject: str
    message: str
    category: Optional[str] = "General"


class FeedbackReply(BaseModel):
    reply: str


@router.get("/")
def list_feedback(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Admins see all, staff see only their own
    if current_user.is_admin:
        rows = db.execute(text("""
            SELECT f.id, f.subject, f.message, f.category, f.status,
                   f.admin_reply, f.created_at, f.replied_at,
                   CONCAT(u.forename, ' ', u.surname) as submitted_by,
                   u.staff_rank as submitted_by_rank,
                   CONCAT(r.forename, ' ', r.surname) as replied_by
            FROM feedback f
            JOIN users u ON u.id = f.submitted_by_id
            LEFT JOIN users r ON r.id = f.replied_by_id
            ORDER BY f.status ASC, f.created_at DESC
        """)).fetchall()
    else:
        rows = db.execute(text("""
            SELECT f.id, f.subject, f.message, f.category, f.status,
                   f.admin_reply, f.created_at, f.replied_at,
                   CONCAT(u.forename, ' ', u.surname) as submitted_by,
                   u.staff_rank as submitted_by_rank,
                   CONCAT(r.forename, ' ', r.surname) as replied_by
            FROM feedback f
            JOIN users u ON u.id = f.submitted_by_id
            LEFT JOIN users r ON r.id = f.replied_by_id
            WHERE f.submitted_by_id = :uid
            ORDER BY f.created_at DESC
        """), {"uid": current_user.id}).fetchall()
    return [dict(r._mapping) for r in rows]


@router.get("/unread-count")
def unread_count(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.is_admin:
        # Admin: count open items
        row = db.execute(text("SELECT COUNT(*) as c FROM feedback WHERE status = 'open'")).fetchone()
    else:
        # Staff: count items with new replies they haven't seen
        row = db.execute(text("""
            SELECT COUNT(*) as c FROM feedback 
            WHERE submitted_by_id = :uid AND admin_reply IS NOT NULL AND status = 'replied'
        """), {"uid": current_user.id}).fetchone()
    return {"count": row.c}


@router.post("/")
def submit_feedback(payload: FeedbackSubmit, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db.execute(text("""
        INSERT INTO feedback (submitted_by_id, subject, message, category)
        VALUES (:uid, :subject, :message, :category)
    """), {
        "uid": current_user.id,
        "subject": payload.subject,
        "message": payload.message,
        "category": payload.category or "General",
    })
    log_action(db, user_id=current_user.id, action="FEEDBACK_SUBMIT",
               details=f"Submitted feedback: {payload.subject}")
    db.commit()
    return {"message": "Feedback submitted"}


@router.patch("/{feedback_id}/reply")
def reply_to_feedback(feedback_id: int, payload: FeedbackReply, db: Session = Depends(get_db), current_user: User = Depends(get_current_admin)):
    item = db.execute(text("SELECT id FROM feedback WHERE id = :id"), {"id": feedback_id}).fetchone()
    if not item:
        raise HTTPException(status_code=404, detail="Feedback not found")
    db.execute(text("""
        UPDATE feedback SET admin_reply = :reply, replied_by_id = :uid,
        replied_at = NOW(), status = 'replied' WHERE id = :id
    """), {"reply": payload.reply, "uid": current_user.id, "id": feedback_id})
    log_action(db, user_id=current_user.id, action="FEEDBACK_REPLY",
               details=f"Replied to feedback #{feedback_id}")
    db.commit()
    return {"message": "Reply sent"}


@router.patch("/{feedback_id}/close")
def close_feedback(feedback_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_admin)):
    db.execute(text("UPDATE feedback SET status = 'closed' WHERE id = :id"), {"id": feedback_id})
    db.commit()
    return {"message": "Feedback closed"}
