export const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

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


export async function getEmployees(skip = 0, limit = 100, search = "", department_id = "", status = "ACTIVE"): Promise<Employee[]> {
    let url = `${API_BASE_URL}/employees?skip=${skip}&limit=${limit}&status=${status}`;
    if (search) {
        url += `&search=${encodeURIComponent(search)}`;
    }
    if (department_id) {
        url += `&department_id=${encodeURIComponent(department_id)}`;
    }
    const res = await fetch(url, { cache: "no-store" });
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

export type CreateEmployeeInput = Omit<Employee, "id" | "employee_number" | "status"> & {
    salary_amount: number;
    salary_currency: string;
};

export async function createEmployee(data: CreateEmployeeInput): Promise<Employee> {
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

export interface AnalyticsOverview {
    total_employees: number;
    total_payroll_usd: number;
    average_salary_usd: number;
    department_averages: Array<{ department: string; average_salary_usd: number; headcount: number }>;
    job_level_averages: Array<{ job_level: string; average_salary_usd: number; headcount: number }>;
}

export async function getAnalyticsOverview(): Promise<AnalyticsOverview> {
    const res = await fetch(`${API_BASE_URL}/analytics/overview`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch analytics");
    return res.json();
}
