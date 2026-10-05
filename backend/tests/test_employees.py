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

def test_update_employee_and_filters(client):
    payload = {
        "first_name": "Mark",
        "last_name": "Twain",
        "email": "mark@example.com",
        "department_id": "dept-engineering",
        "job_title": "Software Engineer",
        "job_level": "L3",
        "country": "US",
        "employment_type": "FULL_TIME",
        "hire_date": "2024-01-01",
        "salary_amount": 100000.0,
        "salary_currency": "USD"
    }
    
    # 1. Create employee
    res = client.post("/api/v1/employees", json=payload)
    emp_id = res.json()["id"]
    
    # 2. Update employee (Promotion to L4, move to Marketing, status INACTIVE)
    update_payload = {
        "job_level": "L4",
        "department_id": "dept-marketing",
        "status": "INACTIVE"
    }
    update_res = client.put(f"/api/v1/employees/{emp_id}", json=update_payload)
    assert update_res.status_code == 200
    updated_emp = update_res.json()
    assert updated_emp["job_level"] == "L4"
    assert updated_emp["department_id"] == "dept-marketing"
    
    # 3. Test Filters (By default, status=ACTIVE should return empty because he is INACTIVE)
    active_res = client.get("/api/v1/employees?status=ACTIVE")
    assert len(active_res.json()) == 0
    
    # 4. Test Filters (status=INACTIVE should return him)
    inactive_res = client.get("/api/v1/employees?status=INACTIVE")
    assert len(inactive_res.json()) == 1
    
    # 5. Test Filters (department_id=dept-marketing should return him if status is ALL)
    dept_res = client.get("/api/v1/employees?department_id=dept-marketing&status=ALL")
    assert len(dept_res.json()) == 1
    
    # 6. Test Search
    search_res = client.get("/api/v1/employees?search=Twain&status=ALL")
    assert len(search_res.json()) == 1

