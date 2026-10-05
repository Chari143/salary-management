from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.schemas.salary import SalaryCreate, SalaryResponse
from app.repositories.salary_repo import SalaryRepository
from app.repositories.employee_repo import EmployeeRepository

router = APIRouter(prefix="/salaries", tags=["Salaries"])

@router.post("", response_model=SalaryResponse, status_code=status.HTTP_201_CREATED)
def add_salary(
    request: SalaryCreate,
    db: Session = Depends(get_db)
):
    emp_repo = EmployeeRepository(db)
    if not emp_repo.get_by_id(request.employee_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
        
    repo = SalaryRepository(db)
    return repo.create(request)

@router.get("/employee/{employee_id}", response_model=List[SalaryResponse])
def get_employee_salary_history(
    employee_id: str,
    db: Session = Depends(get_db)
):
    emp_repo = EmployeeRepository(db)
    if not emp_repo.get_by_id(employee_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
        
    repo = SalaryRepository(db)
    return repo.get_by_employee_id(employee_id)
