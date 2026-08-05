"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Crown, Building2, Users, DollarSign, TrendingUp, ShieldCheck } from "lucide-react";

const tenantGrowthData = [
  { month: "Jan", companies: 12, revenue: 14400 },
  { month: "Feb", companies: 19, revenue: 22800 },
  { month: "Mar", companies: 28, revenue: 33600 },
  { month: "Apr", companies: 42, revenue: 50400 },
  { month: "May", companies: 65, revenue: 78000 },
  { month: "Jun", companies: 94, revenue: 112800 },
];

const roleDistribution = [
  { name: "Admins (Contractors)", value: 94, color: "#10b981" },
  { name: "Civil Site Engineers", value: 340, color: "#06b6d4" },
  { name: "Site Labour Workers", value: 1280, color: "#8b5cf6" },
  { name: "Client Investors", value: 185, color: "#f59e0b" },
];

export function SuperAdminAnalytics() {
  return (
    <div className="space-y-6">
      {/* High Level Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Total Registered SaaS Tenants</span>
            <Building2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-100">94 Companies</p>
          <span className="text-[10px] text-emerald-400 font-semibold">+24.5% from last month</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Global Platform Users</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-100">1,899 Users</p>
          <span className="text-[10px] text-cyan-400 font-semibold">Across 5 Active Roles</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Monthly SaaS ARR</span>
            <DollarSign className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-100">$112,800</p>
          <span className="text-[10px] text-purple-400 font-semibold">Enterprise Subscriptions</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Database Engine</span>
            <ShieldCheck className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl font-bold font-mono text-slate-100">Neon Postgres</p>
          <span className="text-[10px] text-emerald-400 font-semibold">100% Isolated Vaults</span>
        </div>
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-100">SaaS Tenant Growth & ARR Trajectory</h3>
              <p className="text-xs text-slate-400">Monthly enterprise company onboarding rate</p>
            </div>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tenantGrowthData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", fontSize: "12px" }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">User Role Distribution</h3>
            <p className="text-xs text-slate-400">Active users by system role</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={roleDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                  {roleDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 text-xs">
            {roleDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </div>
                <span className="font-mono text-slate-200">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
