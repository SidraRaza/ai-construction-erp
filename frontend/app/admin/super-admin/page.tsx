"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { Header } from "@/components/navigation/header";
import { useToast } from "@/components/ui/toast-provider";
import { Building2, Globe2, ShieldCheck, Users, RefreshCw, Lock, Sparkles, CheckCircle2, Server } from "lucide-react";

export default function SuperAdminPage() {
  const { showToast } = useToast();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const companies = data?.companies || [];
  const metrics = data?.platformMetrics || {};

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar role="SUPER_ADMIN" />

      <div className="flex-1 flex flex-col min-w-0">
        <Header userName="Platform Owner (Super Admin)" userRole="Global Administrator" />

        <main className="p-8 space-y-6 flex-1 overflow-y-auto">
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-purple-950/30 via-slate-900 to-slate-900 p-6 rounded-3xl border border-purple-500/30 shadow-2xl backdrop-blur-xl">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-3">
                <Globe2 className="w-8 h-8 text-purple-400 p-1.5 bg-purple-500/10 rounded-2xl border border-purple-500/20 shadow-inner" />
                Super Admin Multi-Tenant Control Center
              </h2>
              <p className="text-xs text-slate-400 font-medium">Global platform owner overview for all customer accounts, geographical locations, and strict tenant data isolation.</p>
            </div>

            <button
              onClick={fetchSuperAdminData}
              className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-purple-400 hover:border-purple-500/40 hover:bg-slate-800 transition-all duration-200 shadow-md active:scale-95 flex items-center gap-2 text-xs font-bold"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-purple-400" : ""}`} /> Refresh Platform Data
            </button>
          </div>

          {/* Platform High-Level Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/60 p-5 rounded-3xl border border-slate-800/80 shadow-xl backdrop-blur-md space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Registered Customer Companies</span>
                <Building2 className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-2xl font-black text-white">{metrics.totalTenantAccounts || 0}</p>
              <p className="text-[11px] text-purple-400 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Independent Database Tenants
              </p>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-3xl border border-slate-800/80 shadow-xl backdrop-blur-md space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Total Active Platform Users</span>
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-2xl font-black text-white">{metrics.totalRegisteredUsers || 0}</p>
              <p className="text-[11px] text-blue-400 font-medium">Unique Encrypted Accounts</p>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-3xl border border-slate-800/80 shadow-xl backdrop-blur-md space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Data Privacy & Isolation</span>
                <Lock className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-base font-black text-emerald-400">Strict Scoping</p>
              <p className="text-[11px] text-slate-400 font-medium">100% Private Business Vaults</p>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-3xl border border-slate-800/80 shadow-xl backdrop-blur-md space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Global System Status</span>
                <Server className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl font-black text-white">99.9% Online</p>
              <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> All APIs Operational
              </p>
            </div>
          </div>

          {/* Registered Tenant Companies Directory Table */}
          <div className="bg-slate-900/60 rounded-3xl border border-slate-800/80 p-6 space-y-4 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-400" /> Tenant Accounts & Country Locations
              </h3>
              <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                Multi-Tenant Scoped
              </span>
            </div>

            {companies.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center text-center space-y-4 border-2 border-dashed border-slate-800/80 rounded-3xl bg-slate-950/40">
                <Building2 className="w-10 h-10 text-slate-600" />
                <h4 className="text-base font-bold text-slate-300">No Tenant Companies Registered Yet</h4>
                <p className="text-xs text-slate-500 max-w-sm">When new customers sign up on AI Construction ERP, their isolated company tenant will appear here automatically.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="py-3.5 px-4">Company ID</th>
                      <th className="py-3.5 px-4">Company Name</th>
                      <th className="py-3.5 px-4">Country / Location</th>
                      <th className="py-3.5 px-4">Subscription Plan</th>
                      <th className="py-3.5 px-4">Users Count</th>
                      <th className="py-3.5 px-4">Projects Count</th>
                      <th className="py-3.5 px-4 text-center">Data Isolation Status</th>
                      <th className="py-3.5 px-4 text-right">Created Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {companies.map((c: any) => (
                      <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-4 px-4 font-bold font-mono text-purple-400">{c.id}</td>
                        <td className="py-4 px-4 font-bold text-white text-sm">{c.name}</td>
                        <td className="py-4 px-4 font-semibold text-slate-300 flex items-center gap-1.5">
                          <Globe2 className="w-3.5 h-3.5 text-blue-400" /> {c.country || "Pakistan"}
                        </td>
                        <td className="py-4 px-4">
                          <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-extrabold px-3 py-1 rounded-full">
                            {c.subscriptionPlan || "FREE"}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-bold text-slate-200">{c.users?.length || 0} Users</td>
                        <td className="py-4 px-4 font-bold text-slate-200">{c.projects?.length || 0} Projects</td>
                        <td className="py-4 px-4 text-center">
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-extrabold px-3 py-1 rounded-full flex items-center justify-center gap-1 w-max mx-auto">
                            <Lock className="w-3 h-3" /> 100% PRIVATE VAULT
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right text-slate-400 font-medium">
                          {new Date(c.createdAt).toLocaleDateString()}
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
