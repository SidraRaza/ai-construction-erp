"use client";

import { useState } from "react";
import { Bell, Search, Sun, Moon, ShieldCheck, CheckCircle2, AlertTriangle, Info } from "lucide-react";
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

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    showToast(`Global Search for "${searchQuery}" executed across projects & invoices`, "info");
  };

  const notificationsList = [
    { id: 1, title: "Low Stock Alert", desc: "Portland Cement bags dropped below reorder level (15 remaining)", time: "10m ago", type: "warning" },
    { id: 2, title: "Invoice Reissued", desc: "Invoice #INV-2026-002-v2 incremented to Version 2", time: "1h ago", type: "success" },
    { id: 3, title: "Daily Attendance", desc: "74 site workers checked in via QR badge scan", time: "3h ago", type: "info" },
  ];

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
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 relative transition-all"
          >
            <Bell className="w-5 h-5" />
            <span className="w-2 h-2 bg-amber-500 rounded-full absolute top-1.5 right-1.5 ring-4 ring-slate-950" />
          </button>

          {/* System Notifications Dropdown */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-2xl space-y-3 z-50">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-amber-400" /> System Notifications
                </h4>
                <span className="text-[10px] font-bold bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20">
                  Live DB Alerts
                </span>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notificationsList.map((n) => (
                  <div key={n.id} className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800/80 text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white flex items-center gap-1">
                        {n.type === "warning" && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                        {n.type === "success" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                        {n.type === "info" && <Info className="w-3.5 h-3.5 text-cyan-400" />}
                        {n.title}
                      </span>
                      <span className="text-[10px] text-slate-500">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">{n.desc}</p>
                  </div>
                ))}
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
    </header>
  );
}
