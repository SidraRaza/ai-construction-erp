"use client";

import { useState } from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { Header } from "@/components/navigation/header";
import { Users, DollarSign, Calendar, Calculator, CheckCircle2, Clock, UserPlus } from "lucide-react";

const initialEmployees = [
  { id: "e1", name: "Alex Engineer", role: "ENGINEER", designation: "Site Engineer Lead", monthlySalary: 120000, joinedDate: "Jan 10, 2026", status: "ACTIVE" },
  { id: "e2", name: "John Labour", role: "LABOUR", designation: "Mason Lead", monthlySalary: 60000, joinedDate: "Feb 01, 2026", status: "ACTIVE" },
  { id: "e3", name: "Tariq Mahmood", role: "LABOUR", designation: "Steel Fixer Lead", monthlySalary: 65000, joinedDate: "Feb 15, 2026", status: "ACTIVE" },
  { id: "e4", name: "Sarah Admin", role: "ADMIN", designation: "Company Operations Admin", monthlySalary: 150000, joinedDate: "Jan 01, 2026", status: "ACTIVE" },
];

export default function EmployeesPage() {
  const [employees] = useState(initialEmployees);
  const [selectedEmp, setSelectedEmp] = useState<typeof initialEmployees[0] | null>(null);
  const [presentDays, setPresentDays] = useState(26);
  const [lateDays, setLateDays] = useState(2);
  const [calculatedPayroll, setCalculatedPayroll] = useState<{
    baseSalary: number;
    dailyRate: number;
    deductions: number;
    netSalary: number;
  } | null>(null);

  const handleCalculatePayroll = (emp: typeof initialEmployees[0]) => {
    setSelectedEmp(emp);
    const dailyRate = Math.round(emp.monthlySalary / 30);
    const absentDays = 30 - presentDays;
    const deductions = Math.round(absentDays * dailyRate + lateDays * (dailyRate * 0.25));
    const netSalary = Math.max(0, emp.monthlySalary - deductions);

    setCalculatedPayroll({
      baseSalary: emp.monthlySalary,
      dailyRate,
      deductions,
      netSalary,
    });
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar role="ADMIN" />

      <div className="flex-1 flex flex-col min-w-0">
        <Header userName="Sarah Admin" userRole="Company Admin" />

        <main className="p-8 space-y-6 flex-1 overflow-y-auto">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-amber-500/15 via-orange-500/5 to-slate-900 p-6 rounded-3xl border border-amber-500/25 shadow-xl">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                <Users className="w-7 h-7 text-amber-400" /> Employee Directory & Payroll Engine
              </h2>
              <p className="text-sm text-slate-400 mt-1">Staff management, monthly salary computation, and attendance deductions.</p>
            </div>
            <button className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold text-xs shadow-lg shadow-orange-500/25 hover:brightness-110 transition-all flex items-center gap-2">
              <UserPlus className="w-4 h-4" /> Add Employee
            </button>
          </div>

          {/* Employee Directory Table */}
          <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Active Staff Roster</h3>
              <span className="text-xs text-slate-400">Total Staff: {employees.length}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase">
                    <th className="py-3 px-4">Employee Name</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Designation</th>
                    <th className="py-3 px-4">Monthly Salary</th>
                    <th className="py-3 px-4">Join Date</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Payroll Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {employees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-100">{emp.name}</td>
                      <td className="py-3.5 px-4">
                        <span className="bg-amber-400/10 text-amber-400 border border-amber-400/20 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {emp.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">{emp.designation}</td>
                      <td className="py-3.5 px-4 font-bold text-white">${emp.monthlySalary.toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-slate-400">{emp.joinedDate}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          {emp.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleCalculatePayroll(emp)}
                          className="px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold hover:border-amber-500 transition-all flex items-center gap-1.5 ml-auto"
                        >
                          <Calculator className="w-3.5 h-3.5 text-amber-400" /> Compute Payroll
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payroll Calculator Modal */}
          {selectedEmp && calculatedPayroll && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
                <h3 className="text-lg font-bold text-white">Payroll Slip: {selectedEmp.name}</h3>
                <p className="text-xs text-slate-400">Designation: {selectedEmp.designation} ({selectedEmp.role})</p>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2.5 text-xs">
                  <div className="flex justify-between text-slate-400"><span>Base Salary:</span> <strong className="text-white">${calculatedPayroll.baseSalary.toLocaleString()}</strong></div>
                  <div className="flex justify-between text-slate-400"><span>Daily Rate (30 days):</span> <strong className="text-slate-200">${calculatedPayroll.dailyRate.toLocaleString()} / day</strong></div>
                  <div className="flex justify-between text-slate-400"><span>Present Days:</span> <strong className="text-emerald-400">{presentDays} / 30 Days</strong></div>
                  <div className="flex justify-between text-slate-400"><span>Late Days (25% deduction):</span> <strong className="text-amber-400">{lateDays} Days</strong></div>
                  <div className="flex justify-between text-slate-400 border-t border-slate-800 pt-2"><span>Total Deductions:</span> <strong className="text-rose-400">-${calculatedPayroll.deductions.toLocaleString()}</strong></div>
                  <div className="flex justify-between text-base font-bold text-amber-400 border-t border-slate-800 pt-2"><span>Net Payable Salary:</span> <span>${calculatedPayroll.netSalary.toLocaleString()}</span></div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => setSelectedEmp(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      alert(`✅ Payroll generated for ${selectedEmp.name}: $${calculatedPayroll.netSalary.toLocaleString()}`);
                      setSelectedEmp(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-xs font-semibold text-white shadow-lg hover:brightness-110 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Issue Payroll Slip
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
