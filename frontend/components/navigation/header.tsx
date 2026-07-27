"use client";

import { Bell, Search, Sun, Moon, LogOut, User as UserIcon } from "lucide-react";
import { useTheme } from "next-themes";

interface HeaderProps {
  userName?: string;
  userRole?: string;
}

export function Header({ userName = "Sarah Admin", userRole = "Admin" }: HeaderProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Search Bar */}
      <div className="relative w-80">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Global search projects, invoices, site logs..."
          className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-all"
        />
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition-all"
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <button className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 relative transition-all">
          <Bell className="w-5 h-5" />
          <span className="w-2 h-2 bg-amber-500 rounded-full absolute top-1.5 right-1.5 ring-4 ring-slate-950" />
        </button>

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
