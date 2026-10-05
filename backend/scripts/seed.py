import sys
import os
import random
from faker import Faker

# Adding backend dir to sys.path to import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal, create_db_and_tables
from app.models.employee import Employee
from app.models.salary import Salary
from app.schemas.enums import JobLevel, EmploymentType, EmployeeStatus

fake = Faker()

import uuid 

def generate_employee(index: int) -> Employee:
    job_levels = list(JobLevel)
    employment_types = list(EmploymentType)
    
    first_name = fake.first_name()
    last_name = fake.last_name()
    
    emp_id = str(uuid.uuid4())
    
    return Employee(
        id=emp_id,
        employee_number=f"EMP-{10000 + index}", 
        first_name=first_name,
        last_name=last_name,
        email=f"{first_name.lower()}.{last_name.lower()}{index}@acme.com", 
        department_id=f"dept-{random.choice(['engineering', 'sales', 'hr', 'finance', 'marketing'])}",
        job_title=fake.job(),
        job_level=random.choice(job_levels).value,
        country=random.choice(["US", "IN", "UK", "CA", "AU"]),
        employment_type=random.choice(employment_types).value,
        status=EmployeeStatus.ACTIVE.value,
        hire_date=fake.date_between(start_date='-5y', end_date='today')
    )



def generate_salary_for_employee(employee:Employee) -> Salary:

    return Salary(
        employee_id = employee.id,
        amount = round(random.uniform(310000,500000),2),
        currency = "INR",
        effective_date = employee.hire_date
        
    )

def seed_database(num_records: int = 10000):
    print("Creating database tables if not exist...")
    create_db_and_tables()

    db = SessionLocal()
    
    try:
        print("deleting old data...")
        db.query(Salary).delete()
        db.query(Employee).delete()
        db.commit()

        print(f"Seeding {num_records} employees and salaries.")
        
        employees_to_insert = []
        salaries_to_insert = []
        
        # batch size
        batch_size = 2000
        
        for i in range(num_records):
            emp = generate_employee(i)
            employees_to_insert.append(emp)
            salaries_to_insert.append(generate_salary_for_employee(emp))
            
            if len(employees_to_insert) >= batch_size:
                db.add_all(employees_to_insert)
                db.add_all(salaries_to_insert)
                db.commit()
                print(f"Inserted {i + 1} records...")
                employees_to_insert.clear()
                salaries_to_insert.clear()
                
        if employees_to_insert:
            db.add_all(employees_to_insert)
            db.add_all(salaries_to_insert)
            db.commit()
            print(f"Inserted all {num_records} records successfully!")
            
    except Exception as e:
        db.rollback()
        print(f"An error occurred: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database(10000)
