def test_analytics_overview(client):
    emp1 = {
        "first_name": "Alice",
        "last_name": "Smith",
        "email": "alice@example.com",
        "department_id": "dept-engineering",
        "job_title": "Engineer",
        "job_level": "L3",
        "country": "US",
        "employment_type": "FULL_TIME",
        "hire_date": "2024-01-01",
        "salary_amount": 100000.0,
        "salary_currency": "USD"
    }
    
    emp2 = {
        "first_name": "Bob",
        "last_name": "Jones",
        "email": "bob@example.com",
        "department_id": "dept-sales",
        "job_title": "Sales",
        "job_level": "L2",
        "country": "IN",
        "employment_type": "FULL_TIME",
        "hire_date": "2024-01-01",
        "salary_amount": 2000000.0,
        "salary_currency": "INR"
    }
    
    client.post("/api/v1/employees", json=emp1)
    client.post("/api/v1/employees", json=emp2)
    
    # Analytics
    response = client.get("/api/v1/analytics/overview")
    assert response.status_code == 200
    
    data = response.json()
    assert data["total_employees"] == 2
    
    # Total Payroll should be 100000 + 24000 = 124000
    assert data["total_payroll_usd"] == 124000.0
    
    # Average Salary should be 124000 / 2 = 62000
    assert data["average_salary_usd"] == 62000.0
    
    dept_averages = {d["department"]: d for d in data["department_averages"]}
    assert dept_averages["Engineering"]["average_salary_usd"] == 100000.0
    assert dept_averages["Engineering"]["headcount"] == 1
    
    assert dept_averages["Sales"]["average_salary_usd"] == 24000.0
    assert dept_averages["Sales"]["headcount"] == 1
