"use client";

import { useEffect, useState } from "react";
import { getAnalyticsOverview, AnalyticsOverview } from "@/lib/api";
import { Loader2, Users, DollarSign, TrendingUp, Building } from "lucide-react";

export function AnalyticsDashboard() {
    const [data, setData] = useState<AnalyticsOverview | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAnalytics() {
            try {
                const res = await getAnalyticsOverview();
                setData(res);
            } catch (err) {
                console.error("Failed to load analytics", err);
            } finally {
                setLoading(false);
            }
        }
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-8 flex items-center justify-center min-h-[200px]">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (!data) return null;

    const formatUSD = (val: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 shadow-sm text-white">
                    <div className="flex items-center gap-3 mb-4 text-indigo-100">
                        <Users className="w-5 h-5" />
                        <h3 className="font-semibold">Total Headcount</h3>
                    </div>
                    <p className="text-4xl font-extrabold">{data.total_employees.toLocaleString()}</p>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 shadow-sm text-white">
                    <div className="flex items-center gap-3 mb-4 text-emerald-100">
                        <DollarSign className="w-5 h-5" />
                        <h3 className="font-semibold">Total Payroll (USD)</h3>
                    </div>
                    <p className="text-4xl font-extrabold">{formatUSD(data.total_payroll_usd)}</p>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-sm text-white">
                    <div className="flex items-center gap-3 mb-4 text-blue-100">
                        <TrendingUp className="w-5 h-5" />
                        <h3 className="font-semibold">Average Salary (USD)</h3>
                    </div>
                    <p className="text-4xl font-extrabold">{formatUSD(data.average_salary_usd)}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Building className="w-5 h-5 text-slate-400" />
                        <h3 className="text-lg font-bold text-slate-800">Department Averages</h3>
                    </div>
                    <div className="space-y-4">
                        {data.department_averages.map((dept) => (
                            <div key={dept.department} className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="font-semibold text-slate-700">{dept.department}</span>
                                    <span className="text-sm text-slate-500">{dept.headcount} employees</span>
                                </div>
                                <span className="font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                                    {formatUSD(dept.average_salary_usd)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp className="w-5 h-5 text-slate-400" />
                        <h3 className="text-lg font-bold text-slate-800">Job Level Averages</h3>
                    </div>
                    <div className="space-y-4">
                        {data.job_level_averages.map((lvl) => (
                            <div key={lvl.job_level} className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="font-semibold text-slate-700">{lvl.job_level}</span>
                                    <span className="text-sm text-slate-500">{lvl.headcount} employees</span>
                                </div>
                                <span className="font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                                    {formatUSD(lvl.average_salary_usd)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
