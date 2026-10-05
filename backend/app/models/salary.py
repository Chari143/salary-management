import uuid
from datetime import date, datetime
from sqlalchemy import String, Date, DateTime, Numeric, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base

def _new_uuid() -> str:
    return str(uuid.uuid4())

class Salary(Base):
    __tablename__ = "salaries"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_new_uuid)
    employee_id: Mapped[str] = mapped_column(String(36), ForeignKey("employees.id"), nullable=False, index=True)
    amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), nullable=False) # e.g., USD, INR
    effective_date: Mapped[date] = mapped_column(Date, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
