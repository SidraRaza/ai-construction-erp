"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { Header } from "@/components/navigation/header";
import { useToast } from "@/components/ui/toast-provider";
import { UserAuthModal } from "@/components/auth/user-auth-modal";
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

  // Auth Gatekeeper State
  const [activeSession, setActiveSession] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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
      showToast("Failed to fetch live database analytics", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem("erp_user_session");
      if (saved) {
        setActiveSession(JSON.parse(saved));
      } else {
        setIsAuthModalOpen(true);
      }
    } catch (e) {
      setIsAuthModalOpen(true);
    }
    fetchDashboardData();
  }, []);

  const lowStockCount = materials.filter((m) => Number(m.stockQty) < Number(m.reorderLevel)).length;
  const totalProjectBudget = projects.reduce((acc, p) => acc + Number(p.budget || 0), 0);
  const totalExpensesLogged = expenses.reduce((acc, e) => acc + Number(e.amount || 0), 0);

  const financialTrend = [
    { month: "Jan", budget: 350000, spent: 120000 },
    { month: "Feb", budget: 450000, spent: 210000 },
    { month: "Mar", budget: 600000, spent: 340000 },
    { month: "Apr", budget: 850000, spent: 480000 },
    { month: "May", budget: 1100000, spent: 620000 },
    { month: "Jun", budget: totalProjectBudget || 1500000, spent: totalExpensesLogged || 780000 },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar role="ADMIN" />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          userName={activeSession?.user?.name || "Sarah Admin"}
          userRole={activeSession?.user ? `${activeSession.user.role} (${activeSession.company?.name || "Company"})` : "Company Admin"}
        />

        <main className="p-8 space-y-6 flex-1 overflow-y-auto">
          {/* Top Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 p-6 rounded-3xl border border-amber-500/20 shadow-2xl backdrop-blur-xl">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-3">
                <FolderKanban className="w-8 h-8 text-amber-400 p-1.5 bg-amber-500/10 rounded-2xl border border-amber-500/20 shadow-inner" />
                {activeSession?.company?.name || "BuildCorp Enterprise"} Admin Portal
              </h2>
              <p className="text-xs text-slate-400 font-medium flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-emerald-400" /> Private Isolated Dashboard for {activeSession?.user?.email || "sarah@buildcorp.com"}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={fetchDashboardData}
                className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/40 hover:bg-slate-800 transition-all duration-200 shadow-md active:scale-95 flex items-center gap-2 text-xs font-bold"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-amber-400" : ""}`} /> Refresh Live Data
              </button>

              {!activeSession && (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-bold text-xs shadow-lg hover:brightness-110 flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" /> Register / Login To Your Account
                </button>
              )}
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/60 p-5 rounded-3xl border border-slate-800/80 shadow-xl backdrop-blur-md space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Active Projects</span>
                <FolderKanban className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl font-black text-white">{projects.length}</p>
              <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> Live Database Records
              </p>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-3xl border border-slate-800/80 shadow-xl backdrop-blur-md space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Total Project Portfolio Budget</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-black text-white">${totalProjectBudget.toLocaleString()}</p>
              <p className="text-[11px] text-slate-400 font-medium">Scoped to your Company</p>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-3xl border border-slate-800/80 shadow-xl backdrop-blur-md space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Material Reorder Warnings</span>
                <AlertTriangle className="w-4 h-4 text-rose-400" />
              </div>
              <p className="text-2xl font-black text-white">{lowStockCount}</p>
              <p className="text-[11px] text-rose-400 font-medium">Items Below Threshold</p>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-3xl border border-slate-800/80 shadow-xl backdrop-blur-md space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Logged Site Expenses</span>
                <Receipt className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-2xl font-black text-white">${totalExpensesLogged.toLocaleString()}</p>
              <p className="text-[11px] text-blue-400 font-medium">Verified Field Expenses</p>
            </div>
          </div>

          {/* Recharts Analytics */}
          <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800/80 shadow-xl backdrop-blur-md space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-amber-400" /> Company Financial Growth & Budget Utilization
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={financialTrend}>
                  <defs>
                    <linearGradient id="budgetGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "1rem" }} />
                  <Area type="monotone" dataKey="budget" stroke="#f59e0b" fillOpacity={1} fill="url(#budgetGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </main>
      </div>

      {/* Gatekeeper Modal */}
      <UserAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(session) => {
          setActiveSession(session);
          fetchDashboardData();
        }}
      />
    </div>
  );
}
