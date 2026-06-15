from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel
from models import Gender, UniformCondition


# ================================
# USERS
# ================================

class UserCreate(BaseModel):
    forename: str
    surname: str
    is_admin: bool = False


class UserOut(BaseModel):
    id: int
    username: str
    forename: str
    surname: str
    rank: Optional[str] = None
    role: Optional[str] = None
    is_admin: bool
    active: bool
    created_at: datetime
    last_login: Optional[datetime] = None

    @classmethod
    def from_orm_user(cls, u):
        return cls(
            id=u.id, username=u.username, forename=u.forename, surname=u.surname,
            rank=u.staff_rank, role=u.role, is_admin=u.is_admin, active=u.active,
            created_at=u.created_at, last_login=u.last_login
        )

    model_config = {"from_attributes": True}


class PasswordChange(BaseModel):
    current_password: str
    new_password: str


# ================================
# AUTH
# ================================

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# ================================
# CADETS
# ================================

class CadetCreate(BaseModel):
    service_number: str
    rank: str = "Cadet"
    forename: str
    surname: str
    gender: Gender
    flight: Optional[str] = None


class CadetUpdate(BaseModel):
    rank: Optional[str] = None
    forename: Optional[str] = None
    surname: Optional[str] = None
    gender: Optional[Gender] = None
    flight: Optional[str] = None
    notes: Optional[str] = None


class CadetOut(BaseModel):
    id: int
    service_number: str
    rank: str
    forename: str
    surname: str
    gender: Gender
    flight: Optional[str] = None
    notes: Optional[str] = None
    active: bool
    joined_at: datetime
    issued_count: int = 0

    model_config = {"from_attributes": True}


# ================================
# ITEMS
# ================================

class SizeOut(BaseModel):
    id: int
    size_label: str

    model_config = {"from_attributes": True}


class ItemOut(BaseModel):
    id: int
    name: str
    short_name: str
    category: Optional[str] = None
    allows_multiples: bool
    sizes: List[SizeOut] = []

    model_config = {"from_attributes": True}


# ================================
# STOCK
# ================================

class StockOut(BaseModel):
    stock_id: int
    item_id: int
    item_name: str
    short_name: str
    category: Optional[str]
    size_id: int
    size_label: str
    quantity: int


class StockAdjust(BaseModel):
    item_id: int
    size_id: int
    quantity: int   # positive = add, negative = remove
    reason: Optional[str] = None


class StockCheck(BaseModel):
    item_id: int
    size_id: int


class StockCheckResult(BaseModel):
    item_name: str
    short_name: str
    size_label: str
    quantity: int
    in_stock: bool


# ================================
# ISSUE
# ================================

class IssueRequest(BaseModel):
    cadet_id: int
    item_id: int
    size_id: int
    quantity: int = 1
    duplicate_reason: Optional[str] = None   # Required if cadet already has this item
    notes: Optional[str] = None


class IssueOut(BaseModel):
    issue_id: int
    cadet_id: int
    item_name: str
    short_name: str
    size_label: str
    quantity: int
    issued_by: str
    issued_at: datetime
    duplicate_reason: Optional[str] = None
    notes: Optional[str] = None


# ================================
# RETURN
# ================================

class ReturnRequest(BaseModel):
    issued_item_id: int
    condition: UniformCondition
    notes: Optional[str] = None


class ReturnOut(BaseModel):
    return_id: int
    issued_item_id: int
    item_name: str
    size_label: str
    condition: UniformCondition
    returned_by: str
    returned_at: datetime
    warning: Optional[str] = None   # Set if unserviceable


# ================================
# CADET HISTORY
# ================================

class IssuedItemDetail(BaseModel):
    issued_id: int
    item_id: int
    item_name: str
    short_name: str
    size_label: str
    quantity: int
    issued_by: str
    issued_at: datetime
    returned: bool
    duplicate_reason: Optional[str] = None
    notes: Optional[str] = None
    return_record: Optional[dict] = None


class CadetHistoryOut(BaseModel):
    cadet: CadetOut
    summary: dict
    outstanding: List[IssuedItemDetail]
    history: List[IssuedItemDetail]


# ================================
# DASHBOARD
# ================================

class MissingKitEntry(BaseModel):
    cadet_id: int
    service_number: str
    rank: str
    forename: str
    surname: str
    flight: Optional[str] = None
    missing_items: List[str]


class DashboardOut(BaseModel):
    total_cadets: int
    total_active_cadets: int
    total_items_outstanding: int
    cadets_missing_kit: int
    missing_kit_detail: List[MissingKitEntry]
    low_stock: List[StockOut]
    recent_activity: List[dict]


# ================================
# AUDIT LOG
# ================================

class AuditLogOut(BaseModel):
    id: int
    action: str
    details: Optional[str]
    timestamp: datetime
    user_id: int
    user_name: str
    cadet_id: Optional[int] = None
    item_id: Optional[int] = None

    model_config = {"from_attributes": True}
