def test_add_salary_updates_analytics(client):
    emp_payload = {
        "first_name": "Charlie",
        "last_name": "Brown",
        "email": "charlie@example.com",
        "department_id": "dept-marketing",
        "job_title": "Marketer",
        "job_level": "L1",
        "country": "US",
        "employment_type": "FULL_TIME",
        "hire_date": "2024-01-01",
        "salary_amount": 50000.0,
        "salary_currency": "USD" 
    }
    emp_res = client.post("/api/v1/employees", json=emp_payload)
    emp_id = emp_res.json()["id"]
    
    # analytics
    analytics1 = client.get("/api/v1/analytics/overview").json()
    assert analytics1["total_payroll_usd"] == 50000.0
    
    # give the employee a raise (new salary record)
    raise_payload = {
        "employee_id": emp_id,
        "amount": 75000.0,
        "currency": "USD",
        "effective_date": "2025-01-01"
    }
    salary_res = client.post("/api/v1/salaries", json=raise_payload)
    assert salary_res.status_code == 201
    
    # check analytics again to ensure it picks up the LATEST salary
    analytics2 = client.get("/api/v1/analytics/overview").json()
    assert analytics2["total_payroll_usd"] == 75000.0
    assert analytics2["average_salary_usd"] == 75000.0

def test_fetch_salaries(client):
    emp_payload = {
        "first_name": "Diana",
        "last_name": "Prince",
        "email": "diana@example.com",
        "department_id": "dept-hr",
        "job_title": "HR Manager",
        "job_level": "L4",
        "country": "US",
        "employment_type": "FULL_TIME",
        "hire_date": "2023-01-01",
        "salary_amount": 90000.0,
        "salary_currency": "USD" 
    }
    emp_id = client.post("/api/v1/employees", json=emp_payload).json()["id"]
    
    client.post("/api/v1/salaries", json={
        "employee_id": emp_id,
        "amount": 100000.0,
        "currency": "USD",
        "effective_date": "2024-01-01"
    })
    
    salaries_res = client.get(f"/api/v1/salaries/employee/{emp_id}")
    assert salaries_res.status_code == 200
    salaries = salaries_res.json()
    
    # Should have 2 salaries: the initial one from creation, and the new one
    assert len(salaries) == 2
    # They should be sorted by effective_date descending
    assert salaries[0]["amount"] == 100000.0
    assert salaries[1]["amount"] == 90000.0
