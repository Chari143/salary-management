from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.employee import Employee
from app.schemas.employee import EmployeeCreate
from app.schemas.enums import EmployeeStatus

class EmployeeRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_by_email(self, email: str) -> Optional[Employee]:
        return self.session.query(Employee).filter(Employee.email == email).first()

    def get_by_id(self, employee_id: str) -> Optional[Employee]:
        return self.session.query(Employee).filter(Employee.id == employee_id).first()

    def get_all(self, skip: int = 0, limit: int = 100) -> list[Employee]:
        return self.session.query(Employee).offset(skip).limit(limit).all()

    def generate_employee_number(self) -> str:
        count = self.session.query(func.count(Employee.id)).scalar() or 0
        return f"EMP-{(count + 1):05d}"

    def create(self, obj_in: EmployeeCreate) -> Employee:
        db_obj = Employee(
            employee_number=self.generate_employee_number(),
            first_name=obj_in.first_name,
            last_name=obj_in.last_name,
            email=obj_in.email,
            department_id=obj_in.department_id,
            job_title=obj_in.job_title,
            job_level=obj_in.job_level.value,
            country=obj_in.country.upper(),
            employment_type=obj_in.employment_type.value,
            status=EmployeeStatus.ACTIVE.value,
            hire_date=obj_in.hire_date
        )
        self.session.add(db_obj)
        self.session.commit()
        self.session.refresh(db_obj)
        return db_obj
