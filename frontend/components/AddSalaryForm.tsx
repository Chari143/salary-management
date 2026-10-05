"use client";

import { useState } from "react";
import { addSalary } from "@/lib/api";
import { Plus, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

export function AddSalaryForm({ employeeId }: { employeeId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState<Date | null>(new Date());
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!date) return alert("Please select a date");
        
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        try {
            await addSalary({
                employee_id: employeeId,
                amount: Number(formData.get("amount")),
                currency: formData.get("currency") as string,
                effective_date: format(date, "yyyy-MM-dd"),
            });
            setIsOpen(false);
            router.refresh(); 
        } catch (error) {
            console.error(error);
            alert("Failed to add salary");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-semibold hover:bg-indigo-100 transition-colors shadow-sm"
            >
                <Plus className="w-4 h-4" />
                Update Salary
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        
                        <div className="flex justify-between items-center p-6 border-b border-slate-100">
                            <h3 className="text-xl font-extrabold text-slate-900">Add New Salary</h3>
                            <button type="button" onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 hover:bg-slate-100 p-2 rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Amount</label>
                                <input required type="number" name="amount" min="0" step="0.01" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium" placeholder="e.g. 120000" />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Currency</label>
                                <select name="currency" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium">
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                    <option value="GBP">GBP</option>
                                    <option value="INR">INR</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Effective Date</label>
                                <div className="w-full">
                                    <DatePicker
                                        selected={date}
                                        onChange={(d) => setDate(d)}
                                        dateFormat="yyyy-MM-dd"
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium cursor-pointer"
                                        wrapperClassName="w-full"
                                    />
                                </div>
                            </div>
                            
                            <div className="pt-2 flex gap-3">
                                <button type="button" onClick={() => setIsOpen(false)} className="flex-1 px-4 py-2.5 text-slate-700 font-bold bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors flex justify-center items-center gap-2 disabled:opacity-70 shadow-md">
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Salary"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
