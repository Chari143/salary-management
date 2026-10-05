from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.employee import Employee
from app.models.salary import Salary
from app.schemas.employee import EmployeeCreate, EmployeeUpdate
from app.schemas.enums import EmployeeStatus

class EmployeeRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_by_email(self, email: str) -> Optional[Employee]:
        return self.session.query(Employee).filter(Employee.email == email).first()

    def get_by_id(self, employee_id: str) -> Optional[Employee]:
        return self.session.query(Employee).filter(Employee.id == employee_id).first()

    def get_all(self, skip: int = 0, limit: int = 100) -> list[Employee]:
        return self.session.query(Employee).order_by(Employee.created_at.desc()).offset(skip).limit(limit).all()

    def generate_employee_number(self) -> str:
        last_emp = self.session.query(Employee).order_by(Employee.employee_number.desc()).first()
        if not last_emp or not last_emp.employee_number.startswith("EMP-"):
            return "EMP-00001"
        try:
            num = int(last_emp.employee_number.split("-")[1])
            return f"EMP-{num + 1:05d}"
        except Exception:
            return "EMP-00001"

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
        self.session.flush()

        salary_obj = Salary(
            employee_id=db_obj.id,
            amount=obj_in.salary_amount,
            currency=obj_in.salary_currency.upper(),
            effective_date=obj_in.hire_date
        )
        self.session.add(salary_obj)

        self.session.commit()
        self.session.refresh(db_obj)
        return db_obj
    
    def update(self, db_obj: Employee, obj_in: EmployeeUpdate) -> Employee:
        update_data = obj_in.model_dump(exclude_unset=True)
        
        for field, value in update_data.items():
            if hasattr(value, "value"):
                setattr(db_obj, field, value.value)
            else:
                setattr(db_obj, field, value)
                
        self.session.commit()
        self.session.refresh(db_obj)
        return db_obj

