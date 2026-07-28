"use client";

import { useState, useEffect } from "react";
import { Bell, Search, Sun, Moon, CheckCircle2, AlertTriangle, Info, Clock, UserPlus } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useToast } from "@/components/ui/toast-provider";

interface HeaderProps {
  userName?: string;
  userRole?: string;
}

export function Header({ userName = "Sarah Admin", userRole = "Admin" }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dbNotifications, setDbNotifications] = useState<any[]>([]);
  const [isLoadingNotifs, setIsLoadingNotifs] = useState(false);

  // Visitor Onboarding Modal State
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("CLIENT");

  const fetchNotifications = async () => {
    setIsLoadingNotifs(true);
    try {
      const res = await fetch("/api/activity-log?limit=20");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setDbNotifications(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch activity log notifications", err);
    } finally {
      setIsLoadingNotifs(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    showToast(`Global Search for "${searchQuery}" executed across projects & invoices`, "info");
  };

  const handleVisitorRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      showToast("Name and Email are required!", "warning");
      return;
    }

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, role }),
      });

      const json = await res.json();
      if (json.success) {
        showToast(`Welcome ${name}! Your profile has been registered in the database.`, "success");
        setIsOnboardingOpen(false);
        setName("");
        setEmail("");
        setPhone("");
      } else {
        showToast(`Error: ${json.error?.message}`, "error");
      }
    } catch (err) {
      showToast("Failed to register user profile", "error");
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const diff = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case "RECORD_PAYMENT":
        return { title: "Payment Recorded", icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> };
      case "CREATE_QUOTATION":
        return { title: "Quotation Created", icon: <Info className="w-3.5 h-3.5 text-amber-400" /> };
      case "UPDATE_QUOTATION":
        return { title: "Quotation Updated", icon: <Info className="w-3.5 h-3.5 text-amber-400" /> };
      case "REGISTER_USER":
        return { title: "User Profile Registered", icon: <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> };
      case "CREATE_PROJECT":
        return { title: "Project Initialized", icon: <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> };
      default:
        return { title: action.replace(/_/g, " "), icon: <Info className="w-3.5 h-3.5 text-amber-400" /> };
    }
  };

  return (
    <header className="h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Search Bar */}
      <form onSubmit={handleGlobalSearch} className="relative w-80">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Global search projects, invoices, site logs..."
          className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-all"
        />
      </form>

      {/* Action Controls */}
      <div className="flex items-center gap-4">
        {/* Onboard Profile Button */}
        <button
          onClick={() => setIsOnboardingOpen(true)}
          className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20 text-xs font-bold transition-all flex items-center gap-1.5"
        >
          <UserPlus className="w-3.5 h-3.5" /> Onboard Profile
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={() => {
            toggleTheme();
            showToast(`Theme switched to ${theme === "dark" ? "Light" : "Dark"} Mode`, "info");
          }}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition-all"
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
        </button>

        {/* Notifications Dropdown Toggle */}
        <div className="relative">
          <button
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              if (!isNotifOpen) fetchNotifications();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 relative transition-all"
          >
            <Bell className="w-5 h-5" />
            {dbNotifications.length > 0 && (
              <span className="w-2 h-2 bg-amber-500 rounded-full absolute top-1.5 right-1.5 ring-4 ring-slate-950" />
            )}
          </button>

          {/* System Notifications Dropdown */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-2xl space-y-3 z-50">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-amber-400" /> System Notifications
                </h4>
                <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Live DB Feed
                </span>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {isLoadingNotifs ? (
                  <div className="py-6 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4 animate-spin text-amber-400" /> Loading live database alerts...
                  </div>
                ) : dbNotifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-500">
                    No system activity alerts in database yet.
                  </div>
                ) : (
                  dbNotifications.map((n) => {
                    const { title, icon } = getActionLabel(n.action);
                    return (
                      <div key={n.id} className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800/80 text-xs space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-white flex items-center gap-1.5">
                            {icon}
                            {title}
                          </span>
                          <span className="text-[10px] text-slate-500">{formatTimeAgo(n.createdAt)}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-snug">
                          {n.entityType} ({n.entityId || "Record"}) recorded in system.
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-800" />

        {/* User Profile Badge */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
            {userName.charAt(0)}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-100">{userName}</p>
            <p className="text-[11px] text-slate-400">{userRole}</p>
          </div>
        </div>
      </div>

      {/* Visitor Profile Onboarding Modal */}
      {isOnboardingOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-400" /> Onboard Visitor / User Profile
              </h3>
              <button onClick={() => setIsOnboardingOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleVisitorRegister} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Labour"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. john@buildcorp.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Contact Phone Number</label>
                <input
                  type="text"
                  placeholder="e.g. +92 300 9876543"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Role / Persona *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
                >
                  <option value="CLIENT">CLIENT (Project Owner / Investor)</option>
                  <option value="ENGINEER">ENGINEER (Civil Engineer)</option>
                  <option value="LABOUR">LABOUR (Skilled Workforce)</option>
                  <option value="ADMIN">ADMIN (Operations Lead)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsOnboardingOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-xs font-bold text-white shadow-lg hover:brightness-110"
                >
                  Register Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
