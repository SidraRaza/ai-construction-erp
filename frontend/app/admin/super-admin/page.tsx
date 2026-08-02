"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/toast-provider";
import { saveSession, getValidSession, clearSession } from "@/lib/session";
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
  ArrowRight,
  ShieldAlert,
  LogOut,
  ChevronRight,
  MessageSquareHeart,
  Lightbulb,
  Bug,
  MessageCircle,
  Mail,
} from "lucide-react";

export default function SuperAdminPage() {
  const { showToast } = useToast();
  const [data, setData] = useState<any>(null);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("ALL");

  // Owner Password Authentication Gatekeeper State
  const [isSuperAdminAuth, setIsSuperAdminAuth] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const checkAuth = () => {
    const validSession = getValidSession();
    if (validSession && validSession.user?.role === "SUPER_ADMIN") {
      setIsSuperAdminAuth(true);
      return true;
    }
    setIsSuperAdminAuth(false);
    return false;
  };

  const fetchSuperAdminData = async () => {
    setIsLoading(true);
    try {
      const [res, fbRes] = await Promise.all([
        fetch("/api/super-admin"),
        fetch("/api/feedback"),
      ]);

      const json = await res.json();
      if (json.success) {
        setData(json.data);
      } else {
        showToast(`Error: ${json.error?.message}`, "error");
      }

      const fbJson = await fbRes.json();
      if (fbJson.success) {
        setFeedbacks(fbJson.data || []);
      }
    } catch (err) {
      showToast("Failed to fetch platform metrics", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const authorized = checkAuth();
    if (authorized) {
      fetchSuperAdminData();
    } else {
      setIsLoading(false);
    }

    // Check for 1-hour session expiry every 30 seconds
    const interval = setInterval(() => {
      const valid = getValidSession();
      if (!valid && isSuperAdminAuth) {
        showToast("Super Admin session expired after 1 hour. Please log in again!", "warning");
        setIsSuperAdminAuth(false);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleSuperAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    if (adminPassword !== "87626") {
      setAuthError("Incorrect Owner Password!");
      showToast("Incorrect Super Admin Password", "error");
      return;
    }

    const superAdminSession = saveSession({
      user: {
        id: "super_admin_sidra",
        name: adminName.trim() || "Sidra",
        email: "sidra@buildcorp.com",
        role: "SUPER_ADMIN",
        companyId: "cl_default_company",
      },
      company: {
        id: "cl_default_company",
        name: "Global Platform Control Center",
      },
    });

    setIsSuperAdminAuth(true);
    showToast(`Authenticated as Platform Owner (${adminName.trim() || "Sidra"})! 1-Hour Session Active`, "success");
    fetchSuperAdminData();
  };

  const handleLogoutSuperAdmin = () => {
    clearSession();
    setIsSuperAdminAuth(false);
    setAdminName("");
    setAdminPassword("");
    showToast("Logged out of Super Admin Owner Portal", "info");
  };

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

  // If NOT Authenticated as Super Admin: Render Full Screen Standalone Login Portal (NO Sidebar, NO Header)
  if (!isSuperAdminAuth) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Background Decorative Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="bg-slate-900/90 border border-amber-500/30 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 text-center relative z-10 backdrop-blur-xl">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 border border-amber-400/40 flex items-center justify-center mx-auto text-white shadow-lg shadow-orange-500/20">
            <Crown className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-white">Platform Owner Portal</h2>
            <p className="text-xs text-slate-400 font-medium">Enter owner name and password to unlock global user creation ledgers (1-Hour Session Expiry).</p>
          </div>

          <form onSubmit={handleSuperAdminLogin} autoComplete="off" className="space-y-4 text-left">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Owner Name *</label>
              <input
                type="text"
                required
                autoComplete="off"
                placeholder="Enter owner name"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Super Admin Password *</label>
              <input
                type="password"
                required
                autoComplete="new-password"
                placeholder="••••••••"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500 font-mono text-sm"
              />
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" /> {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-bold text-xs shadow-lg shadow-orange-500/20 hover:brightness-110 flex items-center justify-center gap-2 transition-all"
            >
              Unlock Super Admin Control Center <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-center gap-1 font-medium">
            <Lock className="w-3.5 h-3.5 text-emerald-400" /> Protected Standalone Owner Portal (1-Hour Session Expiry)
          </div>
        </div>
      </div>
    );
  }

  // Once Authenticated: Render Full-Width Standalone Owner Workspace (NO SIDEBAR)
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Standalone Owner Top Header Bar */}
      <header className="h-16 bg-slate-900/90 border-b border-amber-500/20 px-8 flex items-center justify-between sticky top-0 z-30 shadow-xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/20">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-white text-base tracking-tight flex items-center gap-2">
              BuildCorp ERP <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 uppercase">Super Admin</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">Global Platform Owner Workspace</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={fetchSuperAdminData}
            title="Refresh Registration Ledger"
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/40 transition-all flex items-center gap-2 text-xs font-bold"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-amber-400" : ""}`} /> Sync Database
          </button>

          <div className="h-6 w-px bg-slate-800" />

          {/* Owner Profile Badge & Lock Button */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
              {(adminName || "Sidra").charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-white">{adminName || "Sidra"} (Platform Owner)</p>
              <p className="text-[11px] text-emerald-400 font-mono">SUPER_ADMIN Active</p>
            </div>
            <button
              onClick={handleLogoutSuperAdmin}
              title="Lock Super Admin Portal"
              className="p-2 rounded-xl bg-slate-950 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-800 text-xs transition-all flex items-center gap-1.5 font-bold"
            >
              <LogOut className="w-4 h-4 text-rose-400" /> Lock Portal
            </button>
          </div>
        </div>
      </header>

      {/* Main Full-Width Content Container */}
      <main className="p-8 space-y-8 flex-1 overflow-y-auto max-w-7xl w-full mx-auto">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-purple-950/40 via-amber-950/20 to-slate-900 p-6 rounded-3xl border border-amber-500/30 shadow-2xl backdrop-blur-xl">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <Crown className="w-8 h-8 text-amber-400 p-1.5 bg-amber-500/10 rounded-2xl border border-amber-500/20 shadow-inner" />
              {adminName || "Sidra"}'s Super Admin Owner Control Center
            </h2>
            <p className="text-xs text-slate-400 font-medium flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-emerald-400" /> Standalone Full-Width Owner Workspace • Track real-time user registrations, feedback notes, and system security.
            </p>
          </div>
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
              <span>User Feedbacks Received</span>
              <MessageSquareHeart className="w-4 h-4 text-orange-400" />
            </div>
            <p className="text-2xl font-black text-white">{feedbacks.length}</p>
            <p className="text-[11px] text-orange-400 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Live Messages to Sidra Raza
            </p>
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

        {/* SECTION 1: User Feedback & Feature Suggestions Ledger */}
        <div className="bg-slate-900/60 rounded-3xl border border-orange-500/30 p-6 space-y-4 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                <MessageSquareHeart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  User Feedback & Feature Requests Ledger
                </h3>
                <p className="text-xs text-slate-400">Direct notes, bug reports, and feature requests submitted by website visitors for Sidra Raza.</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400">
              {feedbacks.length} Total Received
            </span>
          </div>

          {feedbacks.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-950/40">
              <MessageSquareHeart className="w-10 h-10 text-slate-600" />
              <h4 className="text-sm font-bold text-slate-300">No Feedback Messages Received Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm">When users fill out the Feedback form on the Home Page, their messages will appear here in real-time.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {feedbacks.map((fb: any) => (
                <div key={fb.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 hover:border-orange-500/40 transition-all">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wider flex items-center gap-1 ${
                      fb.category === "BUG"
                        ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                        : fb.category === "FEATURE"
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                        : "bg-blue-500/10 border-blue-500/30 text-blue-400"
                    }`}>
                      {fb.category === "BUG" ? <Bug className="w-3 h-3" /> : fb.category === "FEATURE" ? <Lightbulb className="w-3 h-3" /> : <MessageCircle className="w-3 h-3" />}
                      {fb.category}
                    </span>

                    <span className="text-[11px] font-mono text-slate-500">
                      {new Date(fb.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed font-medium bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                    "{fb.message}"
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <div className="flex items-center gap-1.5 text-slate-400 font-mono">
                      <Mail className="w-3.5 h-3.5 text-orange-400" />
                      {fb.email ? fb.email : <span className="italic text-slate-600">Anonymous Visitor</span>}
                    </div>

                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      {fb.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 2: User Account Registration Activity Ledger Table */}
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
  );
}
