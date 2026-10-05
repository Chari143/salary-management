"use client";

import { useState } from "react";
import { createEmployee, Employee } from "@/lib/api";
import { Plus, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

export function AddEmployeeForm({ onSuccess }: { onSuccess: (emp: Employee) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hireDate, setHireDate] = useState<Date | null>(new Date());

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        if (!hireDate) {
            setError("Please select a hire date.");
            return;
        }
        
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        try {
            const newEmp = await createEmployee({
                first_name: formData.get("first_name") as string,
                last_name: formData.get("last_name") as string,
                email: formData.get("email") as string,
                department_id: formData.get("department_id") as string,
                job_title: formData.get("job_title") as string,
                job_level: formData.get("job_level") as string,
                country: formData.get("country") as string,
                employment_type: formData.get("employment_type") as string,
                hire_date: format(hireDate, "yyyy-MM-dd"),
            });
            setIsOpen(false);
            onSuccess(newEmp);
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
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
            >
                <Plus className="w-5 h-5" />
                Add Employee
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        
                        <div className="flex justify-between items-center p-6 border-b border-slate-100">
                            <h3 className="text-xl font-extrabold text-slate-900">Add New Employee</h3>
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
                                    <input required type="text" name="first_name" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Last Name</label>
                                    <input required type="text" name="last_name" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
                                    <input required type="email" name="email" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium" />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Department</label>
                                    <select required name="department_id" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium">
                                        <option value="dept-engineering">Engineering</option>
                                        <option value="dept-sales">Sales</option>
                                        <option value="dept-marketing">Marketing</option>
                                        <option value="dept-hr">HR</option>
                                        <option value="dept-finance">Finance</option>
                                        <option value="dept-product">Product</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Country</label>
                                    <select required name="country" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium">
                                        <option value="US">United States</option>
                                        <option value="GB">United Kingdom</option>
                                        <option value="IN">India</option>
                                        <option value="DE">Germany</option>
                                        <option value="SG">Singapore</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Job Title</label>
                                    <input required type="text" name="job_title" placeholder="e.g. Software Engineer" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium" />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Job Level</label>
                                    <select required name="job_level" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium">
                                        <option value="L1">L1 (Entry / Associate)</option>
                                        <option value="L2">L2 (Intermediate)</option>
                                        <option value="L3">L3 (Senior)</option>
                                        <option value="L4">L4 (Lead / Specialist)</option>
                                        <option value="L5">L5 (Manager / Principal)</option>
                                        <option value="L6">L6 (Director)</option>
                                        <option value="L7">L7 (VP / Executive)</option>
                                    </select>
                                </div>

                                <div className="md:col-span-1">
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Employment Type</label>
                                    <select required name="employment_type" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium">
                                        <option value="FULL_TIME">Full Time</option>
                                        <option value="PART_TIME">Part Time</option>
                                        <option value="CONTRACTOR">Contractor</option>
                                    </select>
                                </div>

                                <div className="md:col-span-1">
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Hire Date</label>
                                    <div className="w-full relative">
                                        <DatePicker
                                            selected={hireDate}
                                            onChange={(d) => setHireDate(d)}
                                            dateFormat="yyyy-MM-dd"
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select"
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium cursor-pointer"
                                            wrapperClassName="w-full"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsOpen(false)} className="flex-1 px-4 py-2.5 text-slate-700 font-bold bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors flex justify-center items-center gap-2 disabled:opacity-70 shadow-md">
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Employee"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
