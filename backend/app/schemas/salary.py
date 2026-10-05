from datetime import date, datetime
from pydantic import BaseModel, Field

class SalaryCreate(BaseModel):
    employee_id: str
    amount: float = Field(..., gt=0)
    currency: str = Field(..., min_length=3, max_length=3)
    effective_date: date

class SalaryResponse(BaseModel):
    id: str
    employee_id: str
    amount: float
    currency: str
    effective_date: date
    created_at: datetime

    model_config = {"from_attributes": True}
