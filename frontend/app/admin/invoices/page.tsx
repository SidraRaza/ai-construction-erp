"use client";

import { useState } from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { Header } from "@/components/navigation/header";
import { Receipt, FileText, CheckCircle, AlertCircle, RefreshCw, Plus, Download, Bot } from "lucide-react";

const initialQuotations = [
  { id: "q1", client: "Acme Real Estate", project: "Skyline Towers Phase 1", amount: "$185,000", status: "DRAFT", isAiDraft: true, version: 1, date: "Jul 26, 2026" },
  { id: "q2", client: "Urban Properties Group", project: "Grand City Commercial Mall", amount: "$420,000", status: "APPROVED", isAiDraft: false, version: 1, date: "Jul 20, 2026" },
];

const initialInvoices = [
  { id: "inv-2026-004", client: "Acme Real Estate", project: "Skyline Towers Phase 1", amount: "$180,000", status: "PENDING", version: 1, dueDate: "Aug 15, 2026" },
  { id: "inv-2026-003", client: "Acme Real Estate", project: "Skyline Towers Phase 1", amount: "$240,000", status: "PAID", version: 1, dueDate: "Jun 30, 2026" },
  { id: "inv-2026-002", client: "Acme Real Estate", project: "Skyline Towers Phase 1", amount: "$300,000", status: "VOIDED", version: 1, dueDate: "Mar 15, 2026" },
  { id: "inv-2026-002-v2", client: "Acme Real Estate", project: "Skyline Towers Phase 1", amount: "$320,000", status: "PAID", version: 2, dueDate: "Apr 01, 2026" },
];

export default function FinancialsPage() {
  const [quotations, setQuotations] = useState(initialQuotations);
  const [invoices, setInvoices] = useState(initialInvoices);
  const [activeTab, setActiveTab] = useState<"quotations" | "invoices">("quotations");

  const handleApproveQuotation = (id: string) => {
    setQuotations(
      quotations.map((q) => (q.id === id ? { ...q, status: "APPROVED" } : q))
    );
  };

  const handleVoidAndReissue = (invoiceId: string) => {
    const target = invoices.find((i) => i.id === invoiceId);
    if (!target) return;

    // Void old invoice, create version N+1
    const voidedList = invoices.map((i) => (i.id === invoiceId ? { ...i, status: "VOIDED" } : i));
    const reissued = {
      id: `${target.id}-v${target.version + 1}`,
      client: target.client,
      project: target.project,
      amount: `$${(parseInt(target.amount.replace(/[^0-9]/g, ""), 10) + 10000).toLocaleString()}`,
      status: "PENDING",
      version: target.version + 1,
      dueDate: "Sep 01, 2026",
    };

    setInvoices([reissued, ...voidedList]);
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
              <p className="text-sm text-slate-400 mt-1">Admin sign-off on AI draft estimates, versioned immutable invoices, and audit trails.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold hover:border-slate-700 transition-all flex items-center gap-2">
                <Bot className="w-4 h-4 text-amber-400" />
                AI Draft Quotation
              </button>
              <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold text-xs shadow-lg hover:brightness-110 flex items-center gap-2">
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
                <h3 className="text-base font-bold text-white">Quotations & AI Drafts</h3>
                <span className="text-xs text-slate-400">Rule: AI Drafts require Admin Approval (Constitution §2.3)</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase">
                      <th className="py-3 px-4">Client</th>
                      <th className="py-3 px-4">Project</th>
                      <th className="py-3 px-4">Quotation Amount</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Admin Sign-off Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {quotations.map((q) => (
                      <tr key={q.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-slate-100">{q.client}</td>
                        <td className="py-3.5 px-4 text-slate-400">{q.project}</td>
                        <td className="py-3.5 px-4 font-bold text-white">{q.amount}</td>
                        <td className="py-3.5 px-4">
                          {q.isAiDraft ? (
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
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Invoices View */}
          {activeTab === "invoices" && (
            <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Issued Invoices Audit Trail</h3>
                <span className="text-xs text-slate-400">Rule: Immutable; Corrections create Version N+1 (Constitution §2.7)</span>
              </div>

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
                        <td className="py-3.5 px-4 font-bold text-slate-300">v{inv.version}.0</td>
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-slate-100">{inv.client}</p>
                          <p className="text-[11px] text-slate-400">{inv.project}</p>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-white">{inv.amount}</td>
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
                              <RefreshCw className="w-3.5 h-3.5 text-amber-400" /> Void & Reissue v{inv.version + 1}
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
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
