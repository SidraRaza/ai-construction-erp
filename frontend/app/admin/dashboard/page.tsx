"use client";

import { Sidebar } from "@/components/navigation/sidebar";
import { Header } from "@/components/navigation/header";
import { useToast } from "@/components/ui/toast-provider";
import {
  FolderKanban,
  UserCheck,
  Package,
  Receipt,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  Bot,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
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

const financialTrend = [
  { month: "Jan", revenue: 450000, expense: 280000 },
  { month: "Feb", revenue: 520000, expense: 310000 },
  { month: "Mar", revenue: 610000, expense: 340000 },
  { month: "Apr", revenue: 580000, expense: 390000 },
  { month: "May", revenue: 730000, expense: 420000 },
  { month: "Jun", revenue: 890000, expense: 460000 },
  { month: "Jul", revenue: 950000, expense: 480000 },
];

const siteProgressData = [
  { name: "Skyline Towers Phase 1", progress: 68 },
  { name: "Grand City Commercial Mall", progress: 34 },
  { name: "Villa Residency 5 Marla", progress: 90 },
  { name: "Metro Overpass Highway", progress: 15 },
];

export default function AdminDashboardPage() {
  const { showToast } = useToast();

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
                Command Center v1.0
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-white pt-1">Company Executive Overview</h2>
              <p className="text-sm text-slate-400">Multi-project financial health, site progress, and low-stock reorder alerts.</p>
            </div>

            {/* Quick Action Button Group */}
            <div className="flex flex-wrap items-center gap-3 relative z-10">
              <button
                onClick={() => showToast("Navigating to Project Portfolio...", "info")}
                className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold hover:border-slate-700 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                New Project
              </button>
              <button
                onClick={() => showToast("Opening AI Quotation Draft Engine...", "success")}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold text-xs shadow-lg shadow-orange-500/20 hover:brightness-110 transition-all flex items-center gap-2"
              >
                <Bot className="w-4 h-4" />
                AI Draft Quotation
              </button>
            </div>
          </div>

          {/* Metric KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-3 shadow-xl backdrop-blur-md relative overflow-hidden group hover:border-slate-700 transition-all">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Active Sites</span>
                <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <FolderKanban className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-white">4 Projects</p>
              <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <ArrowUpRight className="w-4 h-4" /> +1 site added this month
              </p>
            </div>

            <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-3 shadow-xl backdrop-blur-md relative overflow-hidden group hover:border-slate-700 transition-all">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">YTD Revenue</span>
                <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-white">$4.70M</p>
              <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <ArrowUpRight className="w-4 h-4" /> +18.4% vs last quarter
              </p>
            </div>

            <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-3 shadow-xl backdrop-blur-md relative overflow-hidden group hover:border-slate-700 transition-all">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Daily Workforce</span>
                <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <UserCheck className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-white">74 Workers</p>
              <p className="text-xs text-slate-400 font-semibold">92% Present via QR scan</p>
            </div>

            <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-3 shadow-xl backdrop-blur-md relative overflow-hidden group hover:border-slate-700 transition-all">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Stock Reorder Alert</span>
                <div className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-rose-400">2 Low Stock</p>
              <p className="text-xs text-rose-300 font-semibold">Portland Cement & Red Bricks</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Monthly Cash Flow (Revenue vs Expense)</h3>
                  <p className="text-xs text-slate-400">All amounts in USD ($)</p>
                </div>
              </div>

              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={financialTrend}>
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
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "1rem", color: "#fff", fontSize: "12px" }} />
                    <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" name="Revenue" />
                    <Area type="monotone" dataKey="expense" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorExp)" name="Expense" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl backdrop-blur-md flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Project Milestone Progress</h3>
                <p className="text-xs text-slate-400">Completion % across active sites</p>
                <div className="h-60 w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={siteProgressData} layout="vertical">
                      <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" fontSize={10} />
                      <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={90} />
                      <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "1rem", color: "#fff" }} />
                      <Bar dataKey="progress" fill="#f59e0b" radius={[0, 8, 8, 0]} name="Progress %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs flex items-center justify-between">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> All Audit Logs Immutable
                </span>
                <button
                  onClick={() => showToast("Audit Log Report Exported", "success")}
                  className="text-amber-400 hover:underline text-[11px] font-bold"
                >
                  Export Log
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
