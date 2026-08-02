"use client";

import { useState, useEffect } from "react";
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
  Bot,
  ShieldCheck,
  Truck,
  FileCheck,
  Menu,
  X,
  Globe2,
  SlidersHorizontal,
} from "lucide-react";
import { Role } from "@/lib/rbac";

interface SidebarProps {
  role: Role;
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setIsMobileOpen(true);
    window.addEventListener("open-mobile-sidebar", handleToggle);
    return () => window.removeEventListener("open-mobile-sidebar", handleToggle);
  }, []);

  const getNavigationLinks = () => {
    switch (role) {
      case "SUPER_ADMIN":
        return [
          { name: "Platform Overview", href: "/admin/super-admin", icon: Globe2 },
          { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
          { name: "Projects", href: "/admin/projects", icon: FolderKanban },
          { name: "Attendance", href: "/admin/attendance", icon: UserCheck },
          { name: "Materials Inventory", href: "/admin/materials", icon: Package },
          { name: "Suppliers & Procurement", href: "/admin/suppliers", icon: Truck },
          { name: "Quotations & Invoices", href: "/admin/invoices", icon: Receipt },
          { name: "Staff & Payroll", href: "/admin/employees", icon: Users },
          { name: "Subcontracts", href: "/admin/contracts", icon: FileCheck },
          { name: "Custom Production Fields", href: "/admin/custom-fields", icon: SlidersHorizontal },
          { name: "AI Studio", href: "/admin/ai", icon: Bot },
        ];
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
          { name: "Custom Production Fields", href: "/admin/custom-fields", icon: SlidersHorizontal },
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
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 transition-opacity"
        />
      )}

      {/* Sidebar Container (Desktop fixed + Mobile slide-out drawer) */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 w-72 lg:w-64 bg-slate-900 border-r border-slate-800 text-slate-200 flex flex-col h-screen shadow-2xl transition-transform duration-300 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo-128px.png" alt="AI Construction ERP Logo" className="w-9 h-9 object-contain shrink-0" />
            <div>
              <h1 className="font-extrabold tracking-tight text-white text-base">BuildCorp ERP</h1>
              <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                {role.replace("_", " ")}
              </span>
            </div>
          </div>

          {/* Close Mobile Drawer Button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
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
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-amber-500/20 to-orange-500/10 text-amber-400 border border-amber-500/30 shadow-md shadow-amber-500/5"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-amber-400" : "text-slate-400"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Security Badge */}
        <div className="p-4 border-t border-slate-800/80">
          <div className="bg-slate-800/50 rounded-2xl p-3 border border-slate-700/50 flex items-center gap-2.5 text-xs text-slate-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">RBAC & Audit Active</span>
          </div>
        </div>
      </aside>
    </>
  );
}
