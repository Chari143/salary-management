const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

export interface Employee {
    id: string;
    employee_number: string;
    first_name: string;
    last_name: string;
    email: string;
    department_id: string;
    job_title: string;
    job_level: string;
    country: string;
    employment_type: string;
    status: string;
    hire_date: string;
}

export async function getEmployees(skip = 0, limit = 100): Promise<Employee[]> {
    const res = await fetch(`${API_BASE_URL}/employees?skip=${skip}&limit=${limit}`, {
        cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch employees");
    return res.json();
}
