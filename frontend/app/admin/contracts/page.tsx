"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { Header } from "@/components/navigation/header";
import { useToast } from "@/components/ui/toast-provider";
import { FileCheck, Plus, Download, ShieldCheck, CheckCircle, DollarSign, Calendar, RefreshCw, Building2 } from "lucide-react";

export default function ContractsPage() {
  const { showToast } = useToast();
  const [contracts, setContracts] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [subcontractorName, setSubcontractorName] = useState("");
  const [tradeScope, setTradeScope] = useState("");
  const [contractValue, setContractValue] = useState("");

  const fetchContractsAndProjects = async () => {
    setIsLoading(true);
    try {
      const [cRes, pRes] = await Promise.all([
        fetch("/api/contracts"),
        fetch("/api/projects"),
      ]);

      const [cJson, pJson] = await Promise.all([
        cRes.json(),
        pRes.json(),
      ]);

      if (cJson.success && Array.isArray(cJson.data)) {
        setContracts(cJson.data);
      }
      if (pJson.success && Array.isArray(pJson.data)) {
        setProjects(pJson.data);
        if (pJson.data.length > 0 && !projectId) {
          setProjectId(pJson.data[0].id);
        }
      }
    } catch (err) {
      showToast("Failed to fetch live contracts from database", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContractsAndProjects();
  }, []);

  const handleCreateContract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subcontractorName || !tradeScope || !contractValue || !projectId) {
      showToast("Please fill in all required contract fields!", "warning");
      return;
    }

    try {
      const res = await fetch("/api/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          subcontractorName,
          tradeScope,
          contractValue: Number(contractValue),
        }),
      });

      const json = await res.json();
      if (json.success) {
        showToast(`Subcontract agreement created for ${subcontractorName}!`, "success");
        setSubcontractorName("");
        setTradeScope("");
        setContractValue("");
        setIsModalOpen(false);
        fetchContractsAndProjects();
      } else {
        showToast(`Error: ${json.error?.message}`, "error");
      }
    } catch (err) {
      showToast("Failed to save contract agreement", "error");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar role="ADMIN" />

      <div className="flex-1 flex flex-col min-w-0">
        <Header userName="Sarah Admin" userRole="Company Admin" />

        <main className="p-8 space-y-6 flex-1 overflow-y-auto">
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-amber-500/15 via-orange-500/5 to-slate-900 p-6 rounded-3xl border border-amber-500/25 shadow-2xl backdrop-blur-xl">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-3">
                <FileCheck className="w-8 h-8 text-amber-400 p-1.5 bg-amber-500/10 rounded-2xl border border-amber-500/20 shadow-inner" />
                Subcontractor Contract Management
              </h2>
              <p className="text-xs text-slate-400 font-medium">Real-time database trade agreements, milestone progress payouts, and legal compliance records.</p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={fetchContractsAndProjects}
                title="Refresh Live Contracts"
                className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/40 hover:bg-slate-800 transition-all duration-200 shadow-md active:scale-95 flex items-center gap-2 text-xs font-bold"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-amber-400" : ""}`} /> Refresh Live Contracts
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-bold text-xs shadow-lg shadow-orange-500/20 hover:brightness-110 active:scale-95 transition-all duration-200 flex items-center gap-2 border border-amber-400/30"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" /> + New Subcontract Agreement
              </button>
            </div>
          </div>

          {/* Contracts Grid */}
          {contracts.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-4 border-2 border-dashed border-slate-800/80 rounded-3xl bg-slate-950/40">
              <div className="p-4 bg-amber-500/10 rounded-full border border-amber-500/20">
                <FileCheck className="w-10 h-10 text-amber-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-200">No Subcontract Agreements in Database Yet</h4>
                <p className="text-xs text-slate-500 max-w-sm">Click "+ New Subcontract Agreement" above to register trade agreements directly into your Prisma database.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-400 font-bold text-xs border border-amber-500/30 hover:bg-amber-500/30 transition-all"
              >
                + Register First Agreement
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contracts.map((c) => {
                const matchedProj = projects.find((p) => p.id === c.projectId);
                const projName = matchedProj ? matchedProj.name : "Skyline Towers Phase 1";

                return (
                  <div key={c.id} className="bg-slate-900/60 rounded-3xl border border-slate-800/90 p-6 space-y-4 shadow-xl backdrop-blur-md relative overflow-hidden group">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-extrabold tracking-widest text-amber-400 uppercase bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                          {c.tradeScope || "General Trade"}
                        </span>
                        <h3 className="text-base font-bold text-white mt-2 group-hover:text-amber-400 transition-colors">{c.subcontractorName}</h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                          <Building2 className="w-3.5 h-3.5 text-slate-500" /> Site: {projName}
                        </p>
                      </div>
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                        {c.status || "ACTIVE"}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-400">Milestone Progress</span>
                        <span className="font-bold text-amber-400">65%</span>
                      </div>
                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                          style={{ width: "65%" }}
                        />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <div>
                        <p className="text-[10px] text-slate-500 font-semibold">Contract Value</p>
                        <p className="font-extrabold text-white text-sm">${Number(c.contractValue || 0).toLocaleString()}</p>
                      </div>
                      <a
                        href={c.documentUrl || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/40 transition-all flex items-center gap-1.5 text-xs font-bold shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5 text-amber-400" /> PDF Agreement
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* New Contract Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-amber-400" /> Create Subcontractor Agreement
                  </h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                </div>
                <form onSubmit={handleCreateContract} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1">Target Project Site *</label>
                    <select
                      value={projectId}
                      onChange={(e) => setProjectId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
                    >
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1">Subcontractor Business Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex Steel Erectors Ltd"
                      value={subcontractorName}
                      onChange={(e) => setSubcontractorName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1">Trade Scope / Work Description *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Steel Reinforcement & Formwork"
                      value={tradeScope}
                      onChange={(e) => setTradeScope(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1">Contract Value ($) *</label>
                    <input
                      type="number"
                      required
                      placeholder="450000"
                      value={contractValue}
                      onChange={(e) => setContractValue(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-xs font-bold text-white shadow-lg hover:brightness-110"
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
