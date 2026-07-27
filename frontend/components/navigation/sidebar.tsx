"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  LayoutDashboard,
  FolderKanban,
  UserCheck,
  Package,
  Receipt,
  FileSpreadsheet,
  Users,
  Settings,
  Bot,
  ShieldCheck,
  Truck,
  FileCheck,
} from "lucide-react";
import { Role } from "@/lib/rbac";

interface SidebarProps {
  role: Role;
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const getNavigationLinks = () => {
    switch (role) {
      case "SUPER_ADMIN":
      case "ADMIN":
        return [
          { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
          { name: "Projects", href: "/admin/projects", icon: FolderKanban },
          { name: "Attendance", href: "/admin/attendance", icon: UserCheck },
          { name: "Materials Inventory", href: "/admin/materials", icon: Package },
          { name: "Suppliers & Procurement", href: "/admin/suppliers", icon: Truck },
          { name: "Quotations & Invoices", href: "/admin/invoices", icon: Receipt },
          { name: "Staff & Payroll", href: "/admin/employees", icon: Users },
          { name: "Subcontracts", href: "/admin/contracts", icon: FileCheck },
          { name: "AI Studio", href: "/admin/ai", icon: Bot },
        ];
      case "ENGINEER":
        return [
          { name: "My Sites", href: "/engineer/dashboard", icon: FolderKanban },
          { name: "Daily Progress Report", href: "/engineer/progress", icon: FileSpreadsheet },
          { name: "Attendance Check-in", href: "/engineer/attendance", icon: UserCheck },
          { name: "Site Expenses", href: "/engineer/expenses", icon: Receipt },
          { name: "AI Progress Assistant", href: "/engineer/ai", icon: Bot },
        ];
      case "CLIENT":
        return [
          { name: "Project Progress", href: "/client/dashboard", icon: FolderKanban },
          { name: "Invoices & Receipts", href: "/client/invoices", icon: Receipt },
          { name: "Documents", href: "/client/documents", icon: FileSpreadsheet },
          { name: "AI Support Chat", href: "/client/ai", icon: Bot },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavigationLinks();

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-200 flex flex-col h-screen sticky top-0 shadow-2xl">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/20">
          <Building2 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold tracking-tight text-white text-base">BuildCorp ERP</h1>
          <span className="text-[10px] font-semibold tracking-widest text-amber-400 uppercase bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
            {role.replace("_", " ")}
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-amber-500/20 to-orange-500/10 text-amber-400 border border-amber-500/30 shadow-md shadow-amber-500/5"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-amber-400" : "text-slate-400"}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Security Badge */}
      <div className="p-4 border-t border-slate-800/80">
        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50 flex items-center gap-2.5 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="truncate">RBAC & Audit Active</span>
        </div>
      </div>
    </aside>
  );
}
