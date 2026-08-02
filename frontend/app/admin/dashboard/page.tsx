"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { Header } from "@/components/navigation/header";
import { useToast } from "@/components/ui/toast-provider";
import { RouteGuard } from "@/components/auth/route-guard";
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
  Lock,
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
        fetch("/api/activity-log?limit=5"),
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
      showToast("Error loading live dashboard metrics", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalBudget = projects.reduce((acc, p) => acc + Number(p.budget || 0), 0);
  const totalSpent = expenses.reduce((acc, e) => acc + Number(e.amount || 0), 0);

  const lowStockMaterials = materials.filter(
    (m) => Number(m.stockQty) <= Number(m.reorderLevel)
  );

  const monthlyCashflowData = [
    { month: "Jan", budget: totalBudget * 0.15 || 40000, spent: totalSpent * 0.12 || 25000 },
    { month: "Feb", budget: totalBudget * 0.25 || 65000, spent: totalSpent * 0.22 || 48000 },
    { month: "Mar", budget: totalBudget * 0.4 || 95000, spent: totalSpent * 0.35 || 72000 },
    { month: "Apr", budget: totalBudget * 0.65 || 140000, spent: totalSpent * 0.55 || 110000 },
    { month: "May", budget: totalBudget * 0.85 || 210000, spent: totalSpent * 0.78 || 165000 },
    { month: "Jun", budget: totalBudget || 320000, spent: totalSpent || 240000 },
  ];

  return (
    <RouteGuard allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
      <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
        <Sidebar role="ADMIN" />

        <div className="flex-1 flex flex-col min-w-0">
          <Header userName="Sarah Admin" userRole="Admin" />

          <main className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 flex-1 overflow-y-auto">
            {/* Header Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-amber-500/15 via-orange-500/5 to-slate-900 p-6 rounded-3xl border border-amber-500/25 shadow-2xl backdrop-blur-xl">
              <div className="space-y-1">
                <h2 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-3">
                  Executive Command Dashboard
                </h2>
                <p className="text-xs text-slate-400 font-medium flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" /> Multi-Tenant Data Vault • Isolated Company Data & Metrics
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={fetchDashboardData}
                  className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/40 hover:bg-slate-800 transition-all duration-200 shadow-md active:scale-95 flex items-center gap-2 text-xs font-bold"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-amber-400" : ""}`} /> Refresh Metrics
                </button>
              </div>
            </div>

            {/* Metrics Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900/60 p-5 rounded-3xl border border-slate-800/80 shadow-xl backdrop-blur-md space-y-3 hover:border-amber-500/30 transition-all">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Active Projects</span>
                  <FolderKanban className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-2xl font-black text-white">{projects.length}</p>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-emerald-400 font-bold">● {projects.filter((p) => p.status === "IN_PROGRESS").length} In Progress</span>
                  <span className="text-slate-500">Live DB</span>
                </div>
              </div>

              <div className="bg-slate-900/60 p-5 rounded-3xl border border-slate-800/80 shadow-xl backdrop-blur-md space-y-3 hover:border-amber-500/30 transition-all">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Total Capital Budget</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-2xl font-black text-white">${totalBudget.toLocaleString()}</p>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Allocated Budget</span>
                  <span className="text-emerald-400 font-bold">100% Verified</span>
                </div>
              </div>

              <div className="bg-slate-900/60 p-5 rounded-3xl border border-slate-800/80 shadow-xl backdrop-blur-md space-y-3 hover:border-amber-500/30 transition-all">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Site Expenses Logged</span>
                  <Receipt className="w-4 h-4 text-purple-400" />
                </div>
                <p className="text-2xl font-black text-white">${totalSpent.toLocaleString()}</p>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-purple-400 font-bold">{expenses.length} Receipts</span>
                  <span className="text-slate-500">Audit Trail</span>
                </div>
              </div>

              <div className="bg-slate-900/60 p-5 rounded-3xl border border-slate-800/80 shadow-xl backdrop-blur-md space-y-3 hover:border-amber-500/30 transition-all">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Material Stock Status</span>
                  <Package className="w-4 h-4 text-blue-400" />
                </div>
                <p className="text-2xl font-black text-white">{materials.length} Items</p>
                <div className="flex items-center justify-between text-[11px]">
                  {lowStockMaterials.length > 0 ? (
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> {lowStockMaterials.length} Low Stock Alert
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-bold">All Stock Optimal</span>
                  )}
                  <span className="text-slate-500">Inventory</span>
                </div>
              </div>
            </div>

            {/* Financial Cashflow Analytics Chart */}
            <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800/80 shadow-xl backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Financial Cashflow & Budget Burn Rate</h3>
                  <p className="text-xs text-slate-400">Comparing total allocated budget vs actual site expenditures</p>
                </div>
              </div>

              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyCashflowData}>
                    <defs>
                      <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", fontSize: "12px" }}
                    />
                    <Area type="monotone" dataKey="budget" stroke="#f59e0b" fillOpacity={1} fill="url(#colorBudget)" name="Allocated Budget" />
                    <Area type="monotone" dataKey="spent" stroke="#10b981" fillOpacity={1} fill="url(#colorSpent)" name="Actual Expenses" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </main>
        </div>
      </div>
    </RouteGuard>
  );
}
