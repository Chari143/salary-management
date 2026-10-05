def test_create_employee(client):
    payload = {
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe@example.com",
        "department_id": "dept-engineering",
        "job_title": "Software Engineer",
        "job_level": "L3",
        "country": "US",
        "employment_type": "FULL_TIME",
        "hire_date": "2024-01-01",
        "salary_amount": 120000.0,
        "salary_currency": "USD"
    }
    
    response = client.post("/api/v1/employees", json=payload)
    assert response.status_code == 201
    
    data = response.json()
    assert data["first_name"] == "John"
    assert data["email"] == "john.doe@example.com"
    assert "id" in data
    assert data["employee_number"].startswith("EMP-")

def test_create_duplicate_email(client):
    payload = {
        "first_name": "Jane",
        "last_name": "Doe",
        "email": "jane@example.com",
        "department_id": "dept-sales",
        "job_title": "Account Executive",
        "job_level": "L2",
        "country": "US",
        "employment_type": "FULL_TIME",
        "hire_date": "2024-02-01",
        "salary_amount": 90000.0,
        "salary_currency": "USD"
    }
    
    # should be success
    res1 = client.post("/api/v1/employees", json=payload)
    assert res1.status_code == 201
    
    # fail with 409 Conflict
    res2 = client.post("/api/v1/employees", json=payload)
    assert res2.status_code == 409
    assert "already exists" in res2.json()["detail"]

def test_get_employees_list(client):
    # return an empty list initially
    response = client.get("/api/v1/employees")
    assert response.status_code == 200
    assert response.json() == []
