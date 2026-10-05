from sqlalchemy.orm import Session
from app.models.employee import Employee
from app.models.salary import Salary
from app.schemas.enums import EmployeeStatus

# exchange rates.
EXCHANGE_RATES = {
    "USD": 1.0,
    "EUR": 1.1,
    "GBP": 1.25,
    "INR": 0.012,
    "SGD": 0.74,
}

class AnalyticsRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_overview(self) -> dict:
        # Fetch only active employees 
        employees = self.session.query(Employee).filter(Employee.status == EmployeeStatus.ACTIVE.value).all()
        
        # Fetch all salaries.
        salaries = self.session.query(Salary).all()
        
        # Map employee_id to latest Salary object
        latest_salaries = {}
        for s in salaries:
            if s.employee_id not in latest_salaries:
                latest_salaries[s.employee_id] = s
            else:
                if s.effective_date > latest_salaries[s.employee_id].effective_date:
                    latest_salaries[s.employee_id] = s
                    
        total_payroll_usd = 0
        dept_stats = {}
        level_stats = {}
        
        valid_employee_count = 0
        
        for emp in employees:
            sal = latest_salaries.get(emp.id)
            if not sal:
                continue
                
            # Normalize local currency to USD
            rate = EXCHANGE_RATES.get(sal.currency, 1.0)
            usd_amount = float(sal.amount) * rate
            total_payroll_usd += usd_amount
            valid_employee_count += 1
            
            # Department stats
            if emp.department_id not in dept_stats:
                dept_stats[emp.department_id] = {"headcount": 0, "total_usd": 0}
            dept_stats[emp.department_id]["headcount"] += 1
            dept_stats[emp.department_id]["total_usd"] += usd_amount
            
            # Job Level stats
            if emp.job_level not in level_stats:
                level_stats[emp.job_level] = {"headcount": 0, "total_usd": 0}
            level_stats[emp.job_level]["headcount"] += 1
            level_stats[emp.job_level]["total_usd"] += usd_amount

        # Format and sort department
        formatted_dept = [
            {
                "department": k.replace('dept-', '').title(),
                "average_salary_usd": round(v["total_usd"] / v["headcount"], 2),
                "headcount": v["headcount"]
            } for k, v in dept_stats.items()
        ]
        
        # Format and sort level
        formatted_level = [
            {
                "job_level": k,
                "average_salary_usd": round(v["total_usd"] / v["headcount"], 2),
                "headcount": v["headcount"]
            } for k, v in level_stats.items()
        ]

        return {
            "total_employees": valid_employee_count,
            "total_payroll_usd": round(total_payroll_usd, 2),
            "average_salary_usd": round(total_payroll_usd / valid_employee_count, 2) if valid_employee_count else 0,
            "department_averages": sorted(formatted_dept, key=lambda x: x["average_salary_usd"], reverse=True),
            "job_level_averages": sorted(formatted_level, key=lambda x: x["job_level"])
        }
