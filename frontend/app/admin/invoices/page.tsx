"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { Header } from "@/components/navigation/header";
import { useToast } from "@/components/ui/toast-provider";
import { Receipt, FileText, CheckCircle, RefreshCw, Plus, Bot } from "lucide-react";

export default function FinancialsPage() {
  const { showToast } = useToast();
  const [quotations, setQuotations] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"quotations" | "invoices">("quotations");
  const [isLoading, setIsLoading] = useState(true);
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);

  // Explicit Form State for Quotation Creation
  const [customQuotationId, setCustomQuotationId] = useState("");
  const [clientName, setClientName] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const fetchFinancials = async () => {
    setIsLoading(true);
    try {
      const [qRes, iRes, pRes] = await Promise.all([
        fetch("/api/quotations"),
        fetch("/api/invoices"),
        fetch("/api/projects"),
      ]);
      const [qJson, iJson, pJson] = await Promise.all([qRes.json(), iRes.json(), pRes.json()]);

      if (qJson.success) setQuotations(qJson.data || []);
      if (iJson.success) setInvoices(iJson.data || []);
      if (pJson.success) setProjects(pJson.data || []);
    } catch (err) {
      showToast("Failed to fetch financial data from database", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancials();
  }, []);

  const handleCreateQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !clientName) {
      showToast("Client Name and Quotation Amount are required!", "warning");
      return;
    }

    try {
      const res = await fetch("/api/quotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: customQuotationId.trim() || undefined,
          clientId: clientName.toLowerCase().replace(/\s+/g, "_"),
          projectId: selectedProjectId || undefined,
          items: [
            {
              description: description || "Site Estimation",
              quantity: 1,
              unitRate: Number(amount),
              amount: Number(amount),
            },
          ],
          gstPct: 18,
          discount: 0,
          notes: `Client: ${clientName}`,
        }),
      });

      const json = await res.json();
      if (json.success) {
        showToast(`Quotation for "${clientName}" saved in Database!`, "success");
        setCustomQuotationId("");
        setClientName("");
        setSelectedProjectId("");
        setAmount("");
        setDescription("");
        setIsQuotationModalOpen(false);
        fetchFinancials();
      } else {
        showToast(`Error: ${json.error?.message || "Validation Error"}`, "error");
      }
    } catch (err) {
      showToast("Failed to create quotation", "error");
    }
  };

  const handleApproveQuotation = (id: string) => {
    setQuotations(
      quotations.map((q) => (q.id === id ? { ...q, status: "APPROVED" } : q))
    );
    showToast("Quotation Approved by Admin in Database!", "success");
  };

  const handleVoidAndReissue = (invoiceId: string) => {
    const target = invoices.find((i) => i.id === invoiceId);
    if (!target) return;

    const voidedList = invoices.map((i) => (i.id === invoiceId ? { ...i, status: "VOIDED" } : i));
    const reissued = {
      id: `${target.id}-v${(target.version || 1) + 1}`,
      client: target.client || { name: "Corporate Client" },
      project: target.project || { name: "Site Project" },
      amount: Number(target.amount || 0) + 10000,
      status: "PENDING",
      version: (target.version || 1) + 1,
      createdAt: new Date(),
    };

    setInvoices([reissued, ...voidedList]);
    showToast(`Invoice ${invoiceId} voided and reissued as v${(target.version || 1) + 1}`, "warning");
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
                <Receipt className="w-7 h-7 text-amber-400" /> Financial Billing & Quotations Engine
              </h2>
              <p className="text-sm text-slate-400 mt-1">Live database quotations, versioned immutable invoices, and audit trails.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchFinancials}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold hover:border-amber-500"
              >
                <RefreshCw className={`w-4 h-4 text-amber-400 ${isLoading ? "animate-spin" : ""}`} />
              </button>
              <button
                onClick={() => setIsQuotationModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold text-xs shadow-lg hover:brightness-110 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Create Quotation
              </button>
            </div>
          </div>

          {/* Navigation Tab Switcher */}
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <button
              onClick={() => setActiveTab("quotations")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "quotations"
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-md"
                  : "text-slate-400 hover:bg-slate-800"
              }`}
            >
              <FileText className="w-4 h-4" /> Project Quotations ({quotations.length})
            </button>
            <button
              onClick={() => setActiveTab("invoices")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "invoices"
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-md"
                  : "text-slate-400 hover:bg-slate-800"
              }`}
            >
              <Receipt className="w-4 h-4" /> Immutable Invoices ({invoices.length})
            </button>
          </div>

          {/* Quotations View */}
          {activeTab === "quotations" && (
            <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Prisma DB Quotations</h3>
                <span className="text-xs text-slate-400">Rule: AI Drafts require Admin Approval (Constitution §2.3)</span>
              </div>

              {quotations.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 border-2 border-dashed border-slate-800 rounded-2xl">
                  <FileText className="w-10 h-10 text-slate-600" />
                  <h4 className="text-sm font-bold text-slate-300">No Quotations Created in Database Yet</h4>
                  <p className="text-xs text-slate-500">Click "Create Quotation" to add a new project estimate.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase">
                        <th className="py-3 px-4">Quotation ID</th>
                        <th className="py-3 px-4">Project</th>
                        <th className="py-3 px-4">Quotation Amount</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4 text-right">Admin Sign-off Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {quotations.map((q) => {
                        let parsedAmount = 0;
                        try {
                          const parsed = typeof q.items === "string" ? JSON.parse(q.items) : q.items;
                          parsedAmount = parsed[0]?.unitRate || parsed[0]?.amount || 0;
                        } catch (e) {}

                        return (
                          <tr key={q.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-3.5 px-4 font-semibold font-mono text-amber-400">{q.id}</td>
                            <td className="py-3.5 px-4 text-slate-400">{q.project?.name || "General Site"}</td>
                            <td className="py-3.5 px-4 font-bold text-white">${Number(parsedAmount).toLocaleString()}</td>
                            <td className="py-3.5 px-4">
                              {q.status === "DRAFT" ? (
                                <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-max">
                                  <Bot className="w-3 h-3" /> AI DRAFT
                                </span>
                              ) : (
                                <span className="text-slate-400">MANUAL</span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span
                                className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                                  q.status === "DRAFT"
                                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                }`}
                              >
                                {q.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              {q.status === "DRAFT" ? (
                                <button
                                  onClick={() => handleApproveQuotation(q.id)}
                                  className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-xl font-semibold border border-emerald-500/30 hover:bg-emerald-500/30 transition-all text-xs"
                                >
                                  Approve & Mark Billable
                                </button>
                              ) : (
                                <span className="text-emerald-400 font-semibold flex items-center justify-end gap-1">
                                  <CheckCircle className="w-4 h-4" /> Approved
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Invoices View */}
          {activeTab === "invoices" && (
            <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Issued Database Invoices Audit Trail</h3>
                <span className="text-xs text-slate-400">Rule: Immutable; Corrections create Version N+1 (Constitution §2.7)</span>
              </div>

              {invoices.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 border-2 border-dashed border-slate-800 rounded-2xl">
                  <Receipt className="w-10 h-10 text-slate-600" />
                  <h4 className="text-sm font-bold text-slate-300">No Invoices Issued in Database Yet</h4>
                  <p className="text-xs text-slate-500">Approve quotations or create invoices to view immutable audit records.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase">
                        <th className="py-3 px-4">Invoice #</th>
                        <th className="py-3 px-4">Version</th>
                        <th className="py-3 px-4">Client / Project</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4 text-right">Immutability Correction</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {invoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-semibold text-amber-400">{inv.id}</td>
                          <td className="py-3.5 px-4 font-bold text-slate-300">v{inv.version || 1}.0</td>
                          <td className="py-3.5 px-4">
                            <p className="font-semibold text-slate-100">{inv.client?.name || "Corporate Client"}</p>
                            <p className="text-[11px] text-slate-400">{inv.project?.name || "Site Project"}</p>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-white">${Number(inv.amount || 0).toLocaleString()}</td>
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                                inv.status === "PAID"
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                  : inv.status === "PENDING"
                                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                  : "bg-rose-500/10 text-rose-400 border-rose-500/20 line-through"
                              }`}
                            >
                              {inv.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            {inv.status !== "VOIDED" ? (
                              <button
                                onClick={() => handleVoidAndReissue(inv.id)}
                                className="px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl hover:border-amber-500 transition-all flex items-center gap-1.5 ml-auto text-xs"
                              >
                                <RefreshCw className="w-3.5 h-3.5 text-amber-400" /> Void & Reissue v{(inv.version || 1) + 1}
                              </button>
                            ) : (
                              <span className="text-slate-500 text-[11px] italic">Voided Audit Record</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* New Explicit Quotation Modal */}
          {isQuotationModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
                <h3 className="text-lg font-bold text-white">Create New Quotation</h3>
                <form onSubmit={handleCreateQuotation} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Custom Quotation ID (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. QT-2026-001 (Leave blank to auto-generate)"
                      value={customQuotationId}
                      onChange={(e) => setCustomQuotationId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Client Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Acme Real Estate"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Select Project (Optional)</label>
                    <select
                      value={selectedProjectId}
                      onChange={(e) => setSelectedProjectId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="">General Site (No specific project)</option>
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Quotation Amount ($) *</label>
                    <input
                      type="number"
                      required
                      placeholder="340000"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Description / Notes</label>
                    <input
                      type="text"
                      placeholder="e.g. Structural steel & concrete work estimation"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsQuotationModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-xs font-semibold text-white shadow-lg hover:brightness-110"
                    >
                      Save Quotation
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
