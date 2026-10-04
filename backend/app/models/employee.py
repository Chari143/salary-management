import uuid
from datetime import date, datetime
from sqlalchemy import String, Date, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base

def _new_uuid() -> str:
    return str(uuid.uuid4())

class Employee(Base):
    __tablename__ = "employees"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_new_uuid)
    employee_number: Mapped[str] = mapped_column(String(20), unique=True, nullable=False, index=True)
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    department_id: Mapped[str] = mapped_column(String(36), nullable=False, index=True)
    job_title: Mapped[str] = mapped_column(String(200), nullable=False)
    job_level: Mapped[str] = mapped_column(String(10), nullable=False)
    country: Mapped[str] = mapped_column(String(2), nullable=False) # e.g. "US", "IN"
    employment_type: Mapped[str] = mapped_column(String(20), nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="ACTIVE")
    hire_date: Mapped[date] = mapped_column(Date, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
