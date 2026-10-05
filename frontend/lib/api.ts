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

export interface Salary {
    id: string;
    employee_id: string;
    amount: number;
    currency: string;
    effective_date: string;
    created_at: string;
}


export async function getEmployees(skip = 0, limit = 100): Promise<Employee[]> {
    const res = await fetch(`${API_BASE_URL}/employees?skip=${skip}&limit=${limit}`, {
        cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch employees");
    return res.json();
}


export async function getEmployee(employeeId: string): Promise<Employee> {
    const res = await fetch(`${API_BASE_URL}/employees/${employeeId}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch employee");
    return res.json();
}
export async function getEmployeeSalaries(employeeId: string): Promise<Salary[]> {
    const res = await fetch(`${API_BASE_URL}/salaries/employee/${employeeId}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch salaries");
    return res.json();
}
export async function addSalary(data: { employee_id: string; amount: number; currency: string; effective_date: string }) {
    const res = await fetch(`${API_BASE_URL}/salaries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        let errorMsg = "Failed to add salary";
        try {
            const errorData = await res.json();
            if (errorData.detail) {
                if (typeof errorData.detail === 'string') {
                    errorMsg = errorData.detail;
                } else if (Array.isArray(errorData.detail)) {
                    errorMsg = errorData.detail.map((e: any) => `${e.loc[e.loc.length - 1]}: ${e.msg}`).join(", ");
                }
            }
        } catch (e) {
            // ignore
        }
        throw new Error(errorMsg);
    }
    return res.json();
}

export async function createEmployee(data: Omit<Employee, "id" | "employee_number" | "status">): Promise<Employee> {
    const res = await fetch(`${API_BASE_URL}/employees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        let errorMsg = "Failed to create employee";
        try {
            const errorData = await res.json();
            if (errorData.detail) {
                if (typeof errorData.detail === 'string') {
                    errorMsg = errorData.detail;
                } else if (Array.isArray(errorData.detail)) {
                    errorMsg = errorData.detail.map((e: any) => `${e.loc[e.loc.length - 1]}: ${e.msg}`).join(", ");
                }
            }
        } catch (e) {
            // ignore
        }
        throw new Error(errorMsg);
    }
    return res.json();
}
