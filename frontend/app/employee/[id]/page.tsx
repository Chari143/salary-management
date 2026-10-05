import { getEmployee, getEmployeeSalaries } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft, History } from "lucide-react";
import { AddSalaryForm } from "@/components/AddSalaryForm";
import { EditEmployeeForm } from "@/components/EditEmployeeForm";

export default async function EmployeeDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const [employee, salaries] = await Promise.all([
        getEmployee(id),
        getEmployeeSalaries(id)
    ]);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-8">

                <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Go Back
                </Link>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 shrink-0 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl shadow-md">
                            {employee.first_name[0]}{employee.last_name[0]}
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-extrabold text-slate-900">{employee.first_name} {employee.last_name}</h1>
                                {employee.status === "INACTIVE" && (
                                    <span className="px-2.5 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">INACTIVE</span>
                                )}
                            </div>
                            <p className="text-lg text-slate-500 font-medium">{employee.job_title} • {employee.department_id.replace('dept-', '').toUpperCase()}</p>
                        </div>
                    </div>
                    <div>
                        <EditEmployeeForm employee={employee} />
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <History className="w-5 h-5 text-slate-400" />
                            <h2 className="text-xl font-bold text-slate-800">Salary History</h2>
                        </div>

                        <AddSalaryForm employeeId={id} />
                    </div>

                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                                <th className="px-6 py-4">Effective Date</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Currency</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {salaries.map((salary) => (
                                <tr key={salary.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">{salary.effective_date}</td>
                                    <td className="px-6 py-4 font-bold text-emerald-600">
                                        {Number(salary.amount).toLocaleString('en-US')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-600">
                                            {salary.currency}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {salaries.length === 0 && (
                        <div className="p-8 text-center text-slate-500">No salary history found.</div>
                    )}
                </div>

            </div>
        </div>
    );
}
