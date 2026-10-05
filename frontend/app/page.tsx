"use client";

import { useState, useEffect } from "react";
import { getEmployees, Employee } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { EmployeeTable } from "@/components/EmployeeTable";
import { AddEmployeeForm } from "@/components/AddEmployeeForm";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";

export default function Home() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [skip, setSkip] = useState(0);
  const limit = 10;

  useEffect(() => {
    async function loadInitial() {
      try {
        const data = await getEmployees(0, limit);
        setEmployees(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadInitial();
  }, []);

  const loadMore = async () => {
    const newSkip = skip + limit;
    try {
      const data = await getEmployees(newSkip, limit);
      setEmployees([...employees, ...data]);
      setSkip(newSkip);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8 selection:bg-indigo-100">
      <div className="max-w-7xl mx-auto space-y-8">

        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
              Team Overview
            </h1>
            <p className="text-slate-500 mt-1 text-lg">
              Manage your employees and their compensation globally.
            </p>
          </div>
          <AddEmployeeForm onSuccess={(newEmp) => setEmployees([newEmp, ...employees])} />
        </header>

        <AnalyticsDashboard />

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-slate-800">Employee Roster</h2>
          </div>

          <EmployeeTable employees={employees} />

          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-center">
            <button
              onClick={loadMore}
              className="text-sm font-semibold px-6 py-2.5 bg-white border border-slate-200 rounded-lg text-indigo-600 hover:text-indigo-700 hover:bg-slate-50 transition-colors shadow-sm"
            >
              View More Employees
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
