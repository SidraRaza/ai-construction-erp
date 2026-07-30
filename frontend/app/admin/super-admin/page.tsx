"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { Header } from "@/components/navigation/header";
import { useToast } from "@/components/ui/toast-provider";
import {
  Building2,
  Globe2,
  ShieldCheck,
  Users,
  RefreshCw,
  Lock,
  Sparkles,
  CheckCircle2,
  Server,
  Calendar,
  Clock,
  Search,
  UserCheck,
  Crown,
  KeyRound,
} from "lucide-react";

export default function SuperAdminPage() {
  const { showToast } = useToast();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("ALL");

  const fetchSuperAdminData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/super-admin");
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      } else {
        showToast(`Error: ${json.error?.message}`, "error");
      }
    } catch (err) {
      showToast("Failed to fetch platform metrics", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuperAdminData();
  }, []);

  const userLedger: any[] = data?.userLedger || [];
  const companies: any[] = data?.companies || [];
  const metrics: any = data?.platformMetrics || {};

  // Filter User Ledger by Search & Time
  const filteredUsers = userLedger.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.country.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    const uDate = new Date(u.rawDate);
    const now = new Date();

    if (timeFilter === "TODAY") {
      return uDate.toISOString().split("T")[0] === now.toISOString().split("T")[0];
    }
    if (timeFilter === "THIS_MONTH") {
      return uDate.getMonth() === now.getMonth() && uDate.getFullYear() === now.getFullYear();
    }
    return true;
  });

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar role="SUPER_ADMIN" />

      <div className="flex-1 flex flex-col min-w-0">
        <Header userName="Sidra (Owner)" userRole="Platform Super Admin" />

        <main className="p-8 space-y-6 flex-1 overflow-y-auto">
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-purple-950/40 via-amber-950/20 to-slate-900 p-6 rounded-3xl border border-amber-500/30 shadow-2xl backdrop-blur-xl">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-3">
                <Crown className="w-8 h-8 text-amber-400 p-1.5 bg-amber-500/10 rounded-2xl border border-amber-500/20 shadow-inner" />
                Welcome Sidra! Super Admin Owner Control Center
              </h2>
              <p className="text-xs text-slate-400 font-medium flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-emerald-400" /> Platform Owner Credentials Active (Password: 87626) • Track real-time account creations, timestamps, days, & months.
              </p>
            </div>

            <button
              onClick={fetchSuperAdminData}
              className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/40 hover:bg-slate-800 transition-all duration-200 shadow-md active:scale-95 flex items-center gap-2 text-xs font-bold"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-amber-400" : ""}`} /> Refresh Registration Ledger
            </button>
          </div>

          {/* Platform High-Level Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/60 p-5 rounded-3xl border border-slate-800/80 shadow-xl backdrop-blur-md space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Total Registered Accounts</span>
                <Users className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl font-black text-white">{metrics.totalRegisteredUsers || 0}</p>
              <p className="text-[11px] text-amber-400 font-medium flex items-center gap-1">
                <UserCheck className="w-3 h-3" /> Across {metrics.totalTenantAccounts || 0} Companies
              </p>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-3xl border border-slate-800/80 shadow-xl backdrop-blur-md space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>New Signups Today</span>
                <Calendar className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-black text-white">{metrics.usersRegisteredToday || 0}</p>
              <p className="text-[11px] text-emerald-400 font-medium">Joined In Last 24 Hours</p>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-3xl border border-slate-800/80 shadow-xl backdrop-blur-md space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>New Signups This Month</span>
                <Clock className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-2xl font-black text-white">{metrics.usersRegisteredThisMonth || 0}</p>
              <p className="text-[11px] text-blue-400 font-medium">Current Month Growth</p>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-3xl border border-slate-800/80 shadow-xl backdrop-blur-md space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Data Isolation & Privacy</span>
                <ShieldCheck className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-base font-black text-purple-400">100% Isolated</p>
              <p className="text-[11px] text-slate-400 font-medium">Encrypted Tenant DBs</p>
            </div>
          </div>

          {/* User Account Registration Ledger Table */}
          <div className="bg-slate-900/60 rounded-3xl border border-slate-800/80 p-6 space-y-4 shadow-xl backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-amber-400" /> User Registration Activity Ledger
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Track every user who created an account with exact time, day, month, and country location.</p>
              </div>

              {/* Search & Filter Controls */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="relative w-48 sm:w-60">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search name, email, company..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-amber-500"
                >
                  <option value="ALL">All Time</option>
                  <option value="TODAY">Today Only</option>
                  <option value="THIS_MONTH">This Month</option>
                </select>
              </div>
            </div>

            {filteredUsers.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center text-center space-y-3 border-2 border-dashed border-slate-800/80 rounded-3xl bg-slate-950/40">
                <Users className="w-10 h-10 text-slate-600" />
                <h4 className="text-base font-bold text-slate-300">No User Account Creation Records Found</h4>
                <p className="text-xs text-slate-500 max-w-sm">When users create accounts via the registration modal, their registration timestamp, day, month, and country will appear here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="py-3.5 px-4">User Name</th>
                      <th className="py-3.5 px-4">Email Address</th>
                      <th className="py-3.5 px-4">Company / Business</th>
                      <th className="py-3.5 px-4">Country Location</th>
                      <th className="py-3.5 px-4">Day of Week</th>
                      <th className="py-3.5 px-4">Month & Year</th>
                      <th className="py-3.5 px-4">Time Created</th>
                      <th className="py-3.5 px-4 text-right">Date Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredUsers.map((u: any) => (
                      <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-4 px-4 font-bold text-white text-sm flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-xs">
                            {u.name.charAt(0)}
                          </div>
                          {u.name}
                        </td>
                        <td className="py-4 px-4 font-mono text-slate-300">{u.email}</td>
                        <td className="py-4 px-4 font-bold text-amber-400">{u.companyName}</td>
                        <td className="py-4 px-4 font-semibold text-slate-300 flex items-center gap-1.5">
                          <Globe2 className="w-3.5 h-3.5 text-blue-400" /> {u.country}
                        </td>
                        <td className="py-4 px-4">
                          <span className="bg-slate-800 text-slate-300 font-bold px-2.5 py-0.5 rounded-full border border-slate-700">
                            {u.dayOfWeek}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-semibold text-purple-400">
                          {u.monthName} {u.year}
                        </td>
                        <td className="py-4 px-4 font-mono text-emerald-400 font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3 text-emerald-400" /> {u.formattedTime}
                        </td>
                        <td className="py-4 px-4 text-right text-slate-400 font-medium">
                          {u.formattedFullDate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
