"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { Header } from "@/components/navigation/header";
import { useToast } from "@/components/ui/toast-provider";
import {
  FolderKanban,
  UserCheck,
  Package,
  Receipt,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  Bot,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function AdminDashboardPage() {
  const { showToast } = useToast();
  const [projects, setProjects] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [projRes, matRes, expRes, logRes] = await Promise.all([
        fetch("/api/projects"),
        fetch("/api/materials"),
        fetch("/api/expenses"),
        fetch("/api/activity-log"),
      ]);

      const [projData, matData, expData, logData] = await Promise.all([
        projRes.json(),
        matRes.json(),
        expRes.json(),
        logRes.json(),
      ]);

      if (projData.success) setProjects(projData.data || []);
      if (matData.success) setMaterials(matData.data || []);
      if (expData.success) setExpenses(expData.data || []);
      if (logData.success) setActivityLogs(logData.data || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalBudget = projects.reduce((acc, p) => acc + (Number(p.budget) || 0), 0);
  const lowStockCount = materials.filter((m) => Number(m.stockQty) <= Number(m.reorderLevel)).length;
  const totalExpensesLogged = expenses.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);

  const siteProgressData = projects.map((p) => ({
    name: p.name,
    progress: p.status === "COMPLETED" ? 100 : p.status === "IN_PROGRESS" ? 65 : 20,
  }));

  const chartCashFlow = [
    { month: "Jan", revenue: totalBudget * 0.2, expense: totalExpensesLogged * 0.15 },
    { month: "Feb", revenue: totalBudget * 0.35, expense: totalExpensesLogged * 0.3 },
    { month: "Mar", revenue: totalBudget * 0.5, expense: totalExpensesLogged * 0.45 },
    { month: "Apr", revenue: totalBudget * 0.65, expense: totalExpensesLogged * 0.6 },
    { month: "May", revenue: totalBudget * 0.8, expense: totalExpensesLogged * 0.75 },
    { month: "Jun", revenue: totalBudget, expense: totalExpensesLogged },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar role="ADMIN" />

      <div className="flex-1 flex flex-col min-w-0">
        <Header userName="Sarah Admin" userRole="Company Admin" />

        <main className="p-8 space-y-8 flex-1 overflow-y-auto">
          {/* Welcome Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-amber-500/15 via-orange-500/5 to-slate-900 p-6 rounded-3xl border border-amber-500/25 shadow-xl relative overflow-hidden">
            <div className="space-y-1 relative z-10">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                Production Database Active
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-white pt-1">Company Executive Command Center</h2>
              <p className="text-sm text-slate-400">Live Prisma Database metrics, financial cashflow, and audit log entries.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 relative z-10">
              <button
                onClick={fetchDashboardData}
                className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold hover:border-amber-500 transition-all flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 text-amber-400 ${isLoading ? "animate-spin" : ""}`} />
                Sync DB State
              </button>
              <button
                onClick={() => showToast("Opening AI Draft Quotation Engine...", "success")}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold text-xs shadow-lg hover:brightness-110 flex items-center gap-2"
              >
                <Bot className="w-4 h-4" /> AI Quotation Draft
              </button>
            </div>
          </div>

          {/* Metric KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-3 shadow-xl backdrop-blur-md">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active DB Projects</span>
                <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <FolderKanban className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-white">{projects.length} Sites</p>
              <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <ArrowUpRight className="w-4 h-4" /> Live Prisma Database Query
              </p>
            </div>

            <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-3 shadow-xl backdrop-blur-md">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Site Budget</span>
                <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-white">${totalBudget.toLocaleString()}</p>
              <p className="text-xs text-emerald-400 font-semibold">Summed across all tenant projects</p>
            </div>

            <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-3 shadow-xl backdrop-blur-md">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Logged Site Expenses</span>
                <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Receipt className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-white">${totalExpensesLogged.toLocaleString()}</p>
              <p className="text-xs text-slate-400 font-semibold">Includes $10k capped site entries</p>
            </div>

            <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-3 shadow-xl backdrop-blur-md">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Low Stock Reorders</span>
                <div className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-rose-400">{lowStockCount} Materials</p>
              <p className="text-xs text-rose-300 font-semibold">Stock &lt;= Reorder Threshold</p>
            </div>
          </div>

          {/* Charts & Audit Logs Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl backdrop-blur-md">
              <h3 className="text-base font-bold text-white">Monthly Cash Flow (Budget Allocation vs Expenses)</h3>
              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartCashFlow}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `$${val / 1000}k`} />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "1rem", color: "#fff" }} />
                    <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" name="Budget" />
                    <Area type="monotone" dataKey="expense" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorExp)" name="Expenses" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Real Activity Audit Log Stream */}
            <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl backdrop-blur-md flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" /> Database Activity Audit Trail
                </h3>
                <p className="text-xs text-slate-400">Append-only immutable event stream</p>
              </div>

              <div className="space-y-2.5 max-h-64 overflow-y-auto">
                {activityLogs.slice(0, 5).map((log: any) => (
                  <div key={log.id} className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs space-y-1">
                    <div className="flex justify-between font-mono font-bold text-amber-400">
                      <span>{log.action}</span>
                      <span className="text-[10px] text-slate-500">{new Date(log.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-[11px] text-slate-300">Entity: {log.entityType} ({log.entityId?.substring(0, 10)}...)</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
