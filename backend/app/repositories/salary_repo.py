from typing import List
from sqlalchemy.orm import Session
from app.models.salary import Salary
from app.schemas.salary import SalaryCreate

class SalaryRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(self, obj_in: SalaryCreate) -> Salary:
        db_obj = Salary(
            employee_id=obj_in.employee_id,
            amount=obj_in.amount,
            currency=obj_in.currency.upper(),
            effective_date=obj_in.effective_date
        )
        self.session.add(db_obj)
        self.session.commit()
        self.session.refresh(db_obj)
        return db_obj

    def get_by_employee_id(self, employee_id: str) -> List[Salary]:
        # Orders by effective_date descending (latest salary first)
        return self.session.query(Salary).filter(
            Salary.employee_id == employee_id
        ).order_by(Salary.effective_date.desc()).all()
