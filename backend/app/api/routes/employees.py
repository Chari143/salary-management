from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.schemas.employee import EmployeeCreate, EmployeeResponse, EmployeeUpdate
from app.repositories.employee_repo import EmployeeRepository
from typing import List

router = APIRouter(prefix="/employees", tags=["Employees"])


@router.get("", response_model=List[EmployeeResponse])
def get_employees(
    skip: int = Query(0, ge=0, description="Skip the first N records"),
    limit: int = Query(100, ge=1, le=1000, description="Limit the number of records returned"),
    search: str = Query(None, description="Search term for name, email or ID"),
    department_id: str = Query(None, description="Filter by department ID"),
    status: str = Query("ACTIVE", description="Filter by status (ACTIVE, INACTIVE, ALL)"),
    db: Session = Depends(get_db)
):
    repo = EmployeeRepository(db)
    return repo.get_all(skip=skip, limit=limit, search=search, department_id=department_id, status=status)

@router.post("", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
def create_employee(
    request: EmployeeCreate,
    db: Session = Depends(get_db)
):
    repo = EmployeeRepository(db)
    
    if repo.get_by_email(request.email):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, 
            detail=f"Employee with email '{request.email}' already exists."
        )
    
    return repo.create(request)

@router.get("/{employee_id}", response_model=EmployeeResponse)
def get_employee(
    employee_id: str,
    db: Session = Depends(get_db)
):
    repo = EmployeeRepository(db)   
    employee = repo.get_by_id(employee_id)
    
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Employee not found"
        )
        
    return employee



@router.put("/{employee_id}", response_model=EmployeeResponse)
def update_employee(
    employee_id: str,
    request: EmployeeUpdate,
    db: Session = Depends(get_db)
):
    repo = EmployeeRepository(db)
    employee = repo.get_by_id(employee_id)
    
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Employee not found"
        )
        
    return repo.update(db_obj=employee, obj_in=request)
