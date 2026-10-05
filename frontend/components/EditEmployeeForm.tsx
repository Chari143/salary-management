"use client";

import { useState } from "react";
import { Employee, API_BASE_URL } from "@/lib/api";
import { Edit2, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";

export function EditEmployeeForm({ employee, onSuccess }: { employee: Employee, onSuccess?: (emp: Employee) => void }) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        try {
            const res = await fetch(`${API_BASE_URL}/employees/${employee.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    first_name: formData.get("first_name") as string,
                    last_name: formData.get("last_name") as string,
                    department_id: formData.get("department_id") as string,
                    job_title: formData.get("job_title") as string,
                    job_level: formData.get("job_level") as string,
                    status: formData.get("status") as string,
                })
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.detail || "Failed to update employee");
            }
            
            const updatedEmp = await res.json();
            setIsOpen(false);
            router.refresh();
            if (onSuccess) onSuccess(updatedEmp);
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg font-semibold hover:bg-slate-50 hover:text-indigo-600 transition-all shadow-sm"
            >
                <Edit2 className="w-4 h-4" />
                Edit Profile
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        
                        <div className="flex justify-between items-center p-6 border-b border-slate-100">
                            <h3 className="text-xl font-extrabold text-slate-900">Edit Employee</h3>
                            <button type="button" onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 hover:bg-slate-100 p-2 rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 border-b border-red-100 font-medium text-sm flex items-center gap-2">
                                <X className="w-4 h-4 shrink-0" />
                                {error}
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">First Name</label>
                                    <input required type="text" name="first_name" defaultValue={employee.first_name} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Last Name</label>
                                    <input required type="text" name="last_name" defaultValue={employee.last_name} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium" />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Department</label>
                                    <select required name="department_id" defaultValue={employee.department_id} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium">
                                        <option value="dept-engineering">Engineering</option>
                                        <option value="dept-sales">Sales</option>
                                        <option value="dept-marketing">Marketing</option>
                                        <option value="dept-hr">HR</option>
                                        <option value="dept-finance">Finance</option>
                                        <option value="dept-product">Product</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Job Title</label>
                                    <input required type="text" name="job_title" defaultValue={employee.job_title} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium" />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Job Level</label>
                                    <select required name="job_level" defaultValue={employee.job_level} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium">
                                        <option value="L1">L1 (Entry / Associate)</option>
                                        <option value="L2">L2 (Intermediate)</option>
                                        <option value="L3">L3 (Senior)</option>
                                        <option value="L4">L4 (Lead / Specialist)</option>
                                        <option value="L5">L5 (Manager / Principal)</option>
                                        <option value="L6">L6 (Director)</option>
                                        <option value="L7">L7 (VP / Executive)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                                    <select required name="status" defaultValue={employee.status} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium">
                                        <option value="ACTIVE">Active</option>
                                        <option value="INACTIVE">Inactive (Soft Delete)</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsOpen(false)} className="flex-1 px-4 py-2.5 text-slate-700 font-bold bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors flex justify-center items-center gap-2 disabled:opacity-70 shadow-md">
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Update Employee"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
