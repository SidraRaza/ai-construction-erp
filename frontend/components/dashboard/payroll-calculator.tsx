"use client";

import { useState } from "react";
import { Calculator, DollarSign, Calendar, AlertTriangle, CheckCircle2, TrendingDown } from "lucide-react";

export function PayrollCalculator() {
  const [baseSalary, setBaseSalary] = useState<number>(45000);
  const [workingDays, setWorkingDays] = useState<number>(26);
  const [presentDays, setPresentDays] = useState<number>(22);
  const [lateDays, setLateDays] = useState<number>(3);
  const [halfDays, setHalfDays] = useState<number>(1);

  const dailyRate = baseSalary / (workingDays || 1);
  const lateDeductionPerDay = dailyRate * 0.25; // 25% daily rate deduction for late entry
  const totalAbsents = Math.max(0, workingDays - presentDays - halfDays);
  
  const absentDeduction = totalAbsents * dailyRate;
  const halfDayDeduction = halfDays * (dailyRate * 0.5);
  const lateDeduction = lateDays * lateDeductionPerDay;

  const totalDeductions = absentDeduction + halfDayDeduction + lateDeduction;
  const netPayable = Math.max(0, baseSalary - totalDeductions);

  return (
    <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-100">Automated Staff Payroll Calculator</h3>
          <p className="text-xs text-slate-400">Attendance-based salary & deduction engine</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="space-y-1.5">
          <label className="text-slate-400 font-medium">Monthly Base Salary (PKR / USD)</label>
          <input
            type="number"
            value={baseSalary}
            onChange={(e) => setBaseSalary(Number(e.target.value))}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-slate-400 font-medium">Total Work Days in Month</label>
          <input
            type="number"
            value={workingDays}
            onChange={(e) => setWorkingDays(Number(e.target.value))}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-slate-400 font-medium">Present Days Count</label>
          <input
            type="number"
            value={presentDays}
            onChange={(e) => setPresentDays(Number(e.target.value))}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-slate-400 font-medium">Late Entry Count (25% deduction)</label>
          <input
            type="number"
            value={lateDays}
            onChange={(e) => setLateDays(Number(e.target.value))}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-3 text-xs">
        <div className="flex items-center justify-between text-slate-400">
          <span>Daily Wage Rate:</span>
          <span className="font-mono text-slate-200">${dailyRate.toFixed(2)} / day</span>
        </div>
        <div className="flex items-center justify-between text-rose-400/90">
          <span>Absent Deduction ({totalAbsents} days):</span>
          <span className="font-mono">-${absentDeduction.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-amber-400/90">
          <span>Late Entry Deduction ({lateDays} days):</span>
          <span className="font-mono">-${lateDeduction.toFixed(2)}</span>
        </div>

        <div className="pt-3 border-t border-slate-800 flex items-center justify-between font-semibold">
          <span className="text-slate-200">Net Payable Monthly Salary:</span>
          <span className="text-emerald-400 text-base font-mono">${netPayable.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
      </div>
    </div>
  );
}
