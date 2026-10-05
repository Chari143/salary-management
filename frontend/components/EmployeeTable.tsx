"use client"

import { Employee } from "@/lib/api";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";


interface EmployeeTableProps {
    employees: Employee[];
}

export function EmployeeTable({ employees }: EmployeeTableProps) {
    const router = useRouter();
    if (employees.length === 0) {
        return <div className="p-8 text-center text-slate-500">No employees found.</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-slate-50/50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                        <th className="px-6 py-4">Employee</th>
                        <th className="px-6 py-4">Role & Level</th>
                        <th className="px-6 py-4">Location</th>
                        <th className="px-6 py-4">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {employees.map((emp) => (
                        <tr key={emp.id} onClick={() => router.push(`/employee/${emp.id}`)} className="hover:bg-slate-50/80 transition-colors group cursor-pointer">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-white">
                                        {emp.first_name[0]}{emp.last_name[0]}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900 group-hover:underline group-hover:text-indigo-600 transition-colors">{emp.first_name} {emp.last_name}</p>
                                        <p className="text-sm text-slate-500">{emp.email}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <p className="font-medium text-slate-900">{emp.job_title}</p>
                                <p className="text-sm text-slate-500">
                                    Dept: {emp.department_id.replace('dept-', '').toUpperCase()} • {emp.job_level}
                                </p>
                            </td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                                    {emp.country}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${emp.status === 'ACTIVE'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-rose-100 text-rose-700'
                                    }`}>
                                    {emp.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
