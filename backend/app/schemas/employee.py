from datetime import date, datetime
from pydantic import BaseModel, Field, EmailStr
from app.schemas.enums import JobLevel, EmploymentType, EmployeeStatus
from typing import Optional

class EmployeeCreate(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    department_id: str
    job_title: str = Field(..., min_length=1, max_length=200)
    job_level: JobLevel
    country: str = Field(..., min_length=2, max_length=2, description="US, IN")
    employment_type: EmploymentType
    hire_date: date
    salary_amount: float = Field(..., gt=0)
    salary_currency: str = Field(..., min_length=3, max_length=3)


class EmployeeUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    department_id: Optional[str] = None
    job_title: Optional[str] = None
    job_level: Optional[JobLevel] = None
    status: Optional[EmployeeStatus] = None # for soft delete

class EmployeeResponse(BaseModel):
    id: str
    employee_number: str
    first_name: str
    last_name: str
    email: str
    department_id: str
    job_title: str
    job_level: JobLevel
    country: str
    employment_type: EmploymentType
    status: EmployeeStatus
    hire_date: date
    created_at: datetime
    
    model_config = {"from_attributes": True}
