"use client";

import { useState } from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { Header } from "@/components/navigation/header";
import { FileCheck, Plus, Download, ShieldCheck, CheckCircle, DollarSign, Calendar } from "lucide-react";

const initialContracts = [
  { id: "c1", subcontractor: "Apex Steel Erectors Ltd", project: "Skyline Towers Phase 1", trade: "Steel Reinforcement & Formwork", value: "$450,000", status: "ACTIVE", completionPct: 65, date: "Jan 10, 2026" },
  { id: "c2", subcontractor: "Pioneer Plumbing Systems", project: "Grand City Commercial Mall", trade: "Sanitary & Firefighting Piping", value: "$280,000", status: "ACTIVE", completionPct: 40, date: "Feb 01, 2026" },
  { id: "c3", subcontractor: "Universal Electrical Works", project: "Villa Residency Community", trade: "High Voltage Wiring & Panelboards", value: "$175,000", status: "ACTIVE", completionPct: 85, date: "Mar 15, 2026" },
];

export default function ContractsPage() {
  const [contracts, setContracts] = useState(initialContracts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subcontractor, setSubcontractor] = useState("");
  const [trade, setTrade] = useState("");
  const [value, setValue] = useState("");

  const handleCreateContract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subcontractor || !trade || !value) return;

    const newC = {
      id: `c_${Date.now()}`,
      subcontractor,
      project: "Skyline Towers Phase 1",
      trade,
      value: `$${Number(value).toLocaleString()}`,
      status: "ACTIVE",
      completionPct: 0,
      date: new Date().toLocaleDateString(),
    };

    setContracts([newC, ...contracts]);
    setSubcontractor("");
    setTrade("");
    setValue("");
    setIsModalOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar role="ADMIN" />

      <div className="flex-1 flex flex-col min-w-0">
        <Header userName="Sarah Admin" userRole="Company Admin" />

        <main className="p-8 space-y-6 flex-1 overflow-y-auto">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-amber-500/15 via-orange-500/5 to-slate-900 p-6 rounded-3xl border border-amber-500/25 shadow-xl">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                <FileCheck className="w-7 h-7 text-amber-400" /> Subcontractor Contract Management
              </h2>
              <p className="text-sm text-slate-400 mt-1">Trade agreements, milestone progress payouts, and legal compliance records.</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold text-xs shadow-lg shadow-orange-500/25 hover:brightness-110 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> New Subcontract Agreement
            </button>
          </div>

          {/* Contracts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contracts.map((c) => (
              <div key={c.id} className="bg-slate-900/60 rounded-3xl border border-slate-800/90 p-6 space-y-4 shadow-xl backdrop-blur-md relative overflow-hidden group">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                      {c.trade}
                    </span>
                    <h3 className="text-base font-bold text-white mt-2 group-hover:text-amber-400 transition-colors">{c.subcontractor}</h3>
                    <p className="text-xs text-slate-400">Site: {c.project}</p>
                  </div>
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    {c.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Milestone Progress</span>
                    <span className="font-bold text-amber-400">{c.completionPct}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                      style={{ width: `${c.completionPct}%` }}
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <p className="text-[10px] text-slate-500">Contract Value</p>
                    <p className="font-bold text-white">{c.value}</p>
                  </div>
                  <button className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all flex items-center gap-1.5 text-xs">
                    <Download className="w-4 h-4 text-amber-400" /> PDF Agreement
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* New Contract Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
                <h3 className="text-lg font-bold text-white">Create Subcontractor Agreement</h3>
                <form onSubmit={handleCreateContract} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Subcontractor Business Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex Steel Erectors Ltd"
                      value={subcontractor}
                      onChange={(e) => setSubcontractor(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Trade Scope / Work Description</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Steel Reinforcement & Formwork"
                      value={trade}
                      onChange={(e) => setTrade(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Contract Value ($)</label>
                    <input
                      type="number"
                      required
                      placeholder="450000"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-xs font-semibold text-white shadow-lg hover:brightness-110"
                    >
                      Save Contract Agreement
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
