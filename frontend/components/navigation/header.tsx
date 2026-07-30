"use client";

import { useState, useEffect } from "react";
import { Bell, Search, Sun, Moon, CheckCircle2, Info, Clock, UserPlus, LogOut, KeyRound, Edit3, ChevronDown, UserCheck, ShieldCheck, Building2, Globe2, Menu } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useToast } from "@/components/ui/toast-provider";
import { UserAuthModal } from "@/components/auth/user-auth-modal";
import { EditProfileModal } from "@/components/auth/edit-profile-modal";
import { getValidSession, clearSession } from "@/lib/session";

interface HeaderProps {
  userName?: string;
  userRole?: string;
}

export function Header({ userName: initialName = "Sarah Admin", userRole: initialRole = "Admin" }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dbNotifications, setDbNotifications] = useState<any[]>([]);
  const [isLoadingNotifs, setIsLoadingNotifs] = useState(false);

  // Active Auth Session State
  const [activeSession, setActiveSession] = useState<{ user?: any; company?: any } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Session 1-Hour Verification & Periodic Auto-Expiry Check
  useEffect(() => {
    const verify = () => {
      const valid = getValidSession();
      if (valid) {
        setActiveSession(valid);
      } else {
        if (activeSession) {
          showToast("Your session has expired after 1 hour. Please log in again!", "warning");
        }
        setActiveSession(null);
      }
    };

    verify();

    // Check every 30 seconds for 1-hour session expiration
    const interval = setInterval(() => {
      const valid = getValidSession();
      if (!valid && activeSession) {
        showToast("Your session has expired after 1 hour. Please log in again!", "warning");
        setActiveSession(null);
        setIsAuthModalOpen(true);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

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

  const handleLogout = () => {
    clearSession();
    setActiveSession(null);
    setIsUserMenuOpen(false);
    showToast("Logged out of private account", "info");
    setIsAuthModalOpen(true);
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
      case "UPDATE_USER_PROFILE":
        return { title: "Profile Updated", icon: <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> };
      case "REGISTER_USER":
      case "REGISTER_COMPANY_ADMIN":
        return { title: "New Account Registered", icon: <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> };
      case "CREATE_PROJECT":
        return { title: "Project Initialized", icon: <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> };
      default:
        return { title: action.replace(/_/g, " "), icon: <Info className="w-3.5 h-3.5 text-amber-400" /> };
    }
  };

  const currentUser = activeSession?.user;
  const currentCompany = activeSession?.company;

  const displayName = currentUser?.name || initialName;
  const displayEmail = currentUser?.email || "admin@buildcorp.com";
  const displayCompany = currentCompany?.name || "BuildCorp Enterprise";
  const displayRole = currentUser?.role ? `${currentUser.role}` : initialRole;

  return (
    <header className="h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Mobile Hamburger Menu Toggle + Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={() => window.dispatchEvent(new Event("open-mobile-sidebar"))}
          className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 hover:text-white hover:border-amber-500/40 transition-all"
          aria-label="Open Mobile Menu"
          title="Open Navigation Menu"
        >
          <Menu className="w-5 h-5 stroke-[2.5]" />
        </button>

        <form onSubmit={handleGlobalSearch} className="relative w-full sm:w-72 lg:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Global search projects, invoices..."
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-all"
          />
        </form>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
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
              if (!isNotifOpen) {
                fetchNotifications();
                setIsUserMenuOpen(false);
              }
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
                    <Clock className="w-4 h-4 animate-spin text-amber-400" /> Loading live alerts...
                  </div>
                ) : dbNotifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-500">
                    No system alerts in database yet.
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
                          {n.entityType} ({n.entityId || "Record"}) recorded.
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-800 hidden sm:block" />

        {/* Clickable User Profile Badge with Dropdown Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setIsUserMenuOpen(!isUserMenuOpen);
              setIsNotifOpen(false);
            }}
            className="flex items-center gap-3 p-1 rounded-2xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all duration-200 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:scale-105 transition-transform">
              {displayName.charAt(0)}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-slate-100 flex items-center gap-1">
                {displayName}
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isUserMenuOpen ? "rotate-180 text-amber-400" : ""}`} />
              </p>
              <p className="text-[11px] text-slate-400 truncate max-w-[130px] font-medium">{displayRole}</p>
            </div>
          </button>

          {/* Enterprise User Profile Dropdown Menu */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-3 w-72 bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-2xl space-y-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Profile Card Header */}
              <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800/80 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white font-black text-base shadow-md">
                    {displayName.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate">{displayName}</p>
                    <p className="text-[11px] text-slate-400 truncate font-mono">{displayEmail}</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                  <span className="flex items-center gap-1"><Building2 className="w-3 h-3 text-amber-400" /> {displayCompany}</span>
                  <span className="bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20 font-bold">{displayRole}</span>
                </div>
              </div>

              {/* Menu Items */}
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setIsEditProfileOpen(true);
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-slate-800 text-xs font-bold text-slate-200 flex items-center gap-2.5 transition-colors group text-left"
                >
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-white transition-all">
                    <Edit3 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-slate-100">Edit Profile & Company</p>
                    <p className="text-[10px] text-slate-400 font-normal">Update name, phone, company, country</p>
                  </div>
                </button>

                {!activeSession && (
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-slate-800 text-xs font-bold text-amber-400 flex items-center gap-2.5 transition-colors text-left"
                  >
                    <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <KeyRound className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p>Register / Login Account</p>
                      <p className="text-[10px] text-slate-400 font-normal">Access your private dashboard</p>
                    </div>
                  </button>
                )}

                {activeSession && (
                  <button
                    onClick={handleLogout}
                    className="w-full p-2.5 rounded-xl hover:bg-rose-500/10 text-xs font-bold text-rose-400 flex items-center gap-2.5 transition-colors text-left"
                  >
                    <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
                      <LogOut className="w-3.5 h-3.5 text-rose-400" />
                    </div>
                    <div>
                      <p>Sign Out / Switch Account</p>
                      <p className="text-[10px] text-slate-400 font-normal">Log out of current private dashboard</p>
                    </div>
                  </button>
                )}
              </div>

              <div className="pt-2 border-t border-slate-800 text-center">
                <p className="text-[10px] text-slate-500 flex items-center justify-center gap-1 font-medium">
                  <Clock className="w-3 h-3 text-emerald-400" /> 1-Hour Auto Expiration Active
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Registration & Login Gatekeeper Modal */}
      <UserAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(session) => {
          setActiveSession(session);
        }}
      />

      {/* Edit Profile & Company Details Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        currentUser={currentUser}
        currentCompany={currentCompany}
        onSuccess={(updatedSession) => {
          setActiveSession(updatedSession);
        }}
      />
    </header>
  );
}
