from datetime import datetime
from sqlalchemy import (
    Boolean, Column, DateTime, ForeignKey,
    Integer, String, Text, Enum
)
from sqlalchemy.orm import relationship
from database import Base
import enum


class Gender(str, enum.Enum):
    male = "male"
    female = "female"
    other = "other"

class UniformCondition(str, enum.Enum):
    serviceable = "serviceable"
    unserviceable = "unserviceable"

class StaffRank(str, enum.Enum):
    CI = "CI"
    Sgt = "Sgt"
    FS = "FS"
    WO = "WO"
    A_Plt_Off = "A/Plt Off"
    Plt_Off = "Plt Off"
    Fg_Off = "Fg Off"
    Flt_Lt = "Flt Lt"
    Sqn_Ldr = "Sqn Ldr"

class StaffRole(str, enum.Enum):
    OC = "OC"
    Adj = "Adj"
    Trg_Off = "Trg Off"
    SNCO = "SNCO"
    CI = "CI"

class CadetRank(str, enum.Enum):
    Cdt = "Cdt"
    Cpl = "Cpl"
    Sgt = "Sgt"
    FS = "FS"
    CWO = "CWO"


# ── USERS ──────────────────────────────────────────────
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    forename = Column(String(100), nullable=False)
    surname = Column(String(100), nullable=False)
    staff_rank = Column(String(20), nullable=True)   # Staff rank e.g. Flt Lt
    role = Column(String(20), nullable=True)   # Role e.g. OC, Adj
    is_admin = Column(Boolean, default=False, nullable=False)
    active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)

    issued_items = relationship("IssuedItem", foreign_keys="IssuedItem.issued_by_id", back_populates="issued_by_user")
    returned_items = relationship("ReturnedItem", foreign_keys="ReturnedItem.returned_by_id", back_populates="returned_by_user")
    audit_logs = relationship("AuditLog", back_populates="user")


# ── AUDIT LOG ──────────────────────────────────────────
class AuditLog(Base):
    __tablename__ = "audit_log"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    action = Column(String(100), nullable=False)
    cadet_id = Column(Integer, ForeignKey("cadets.id"), nullable=True)
    item_id = Column(Integer, ForeignKey("items.id"), nullable=True)
    details = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="audit_logs")


# ── CADETS ─────────────────────────────────────────────
class Cadet(Base):
    __tablename__ = "cadets"

    id = Column(Integer, primary_key=True, index=True)
    service_number = Column(String(20), unique=True, nullable=False, index=True)
    rank = Column(String(20), nullable=False, default="Cdt")
    forename = Column(String(100), nullable=False)
    surname = Column(String(100), nullable=False)
    gender = Column(Enum(Gender), nullable=False, default=Gender.male)
    flight = Column(String(50), nullable=True)
    active = Column(Boolean, default=True, nullable=False)
    joined_at = Column(DateTime, default=datetime.utcnow)

    issued_items = relationship("IssuedItem", back_populates="cadet")


# ── ITEMS ──────────────────────────────────────────────
class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    short_name = Column(String(100), nullable=False)
    category = Column(String(100), nullable=True)
    allows_multiples = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)

    sizes = relationship("Size", back_populates="item", cascade="all, delete-orphan")
    stock = relationship("Stock", back_populates="item")


# ── SIZES ──────────────────────────────────────────────
class Size(Base):
    __tablename__ = "sizes"

    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("items.id"), nullable=False)
    size_label = Column(String(50), nullable=False)

    item = relationship("Item", back_populates="sizes")
    stock = relationship("Stock", back_populates="size", uselist=False)


# ── STOCK ──────────────────────────────────────────────
class Stock(Base):
    __tablename__ = "stock"

    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("items.id"), nullable=False)
    size_id = Column(Integer, ForeignKey("sizes.id"), nullable=False)
    quantity = Column(Integer, nullable=False, default=0)

    item = relationship("Item", back_populates="stock")
    size = relationship("Size", back_populates="stock")


# ── KIT LIST ───────────────────────────────────────────
class KitListItem(Base):
    __tablename__ = "kit_list"

    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("items.id"), nullable=False)
    gender_restriction = Column(Enum(Gender), nullable=True)
    display_label = Column(String(100), nullable=True)
    group_key = Column(String(50), nullable=True)

    item = relationship("Item")


# ── ISSUED ITEMS ───────────────────────────────────────
class IssuedItem(Base):
    __tablename__ = "issued_items"

    id = Column(Integer, primary_key=True, index=True)
    cadet_id = Column(Integer, ForeignKey("cadets.id"), nullable=False)
    item_id = Column(Integer, ForeignKey("items.id"), nullable=False)
    size_id = Column(Integer, ForeignKey("sizes.id"), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    issued_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    issued_at = Column(DateTime, default=datetime.utcnow)
    duplicate_reason = Column(String(500), nullable=True)
    notes = Column(Text, nullable=True)
    returned = Column(Boolean, default=False, nullable=False)

    cadet = relationship("Cadet", back_populates="issued_items")
    item = relationship("Item")
    size = relationship("Size")
    issued_by_user = relationship("User", foreign_keys=[issued_by_id], back_populates="issued_items")
    return_record = relationship("ReturnedItem", back_populates="issued_item", uselist=False)


# ── RETURNED ITEMS ─────────────────────────────────────
class ReturnedItem(Base):
    __tablename__ = "returned_items"

    id = Column(Integer, primary_key=True, index=True)
    issued_item_id = Column(Integer, ForeignKey("issued_items.id"), nullable=False, unique=True)
    returned_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    returned_at = Column(DateTime, default=datetime.utcnow)
    condition = Column(Enum(UniformCondition), nullable=False)
    notes = Column(Text, nullable=True)

    issued_item = relationship("IssuedItem", back_populates="return_record")
    returned_by_user = relationship("User", foreign_keys=[returned_by_id], back_populates="returned_items")


# ── STAFF (legacy - kept for compatibility) ────────────
class Staff(Base):
    __tablename__ = "staff"

    id = Column(Integer, primary_key=True, index=True)
    service_number = Column(String(50), unique=True, nullable=False)
    forename = Column(String(100), nullable=False)
    surname = Column(String(100), nullable=False)
    active = Column(Boolean, default=True)
