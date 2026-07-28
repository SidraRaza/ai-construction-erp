"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { Header } from "@/components/navigation/header";
import { useToast } from "@/components/ui/toast-provider";
import { Receipt, FileText, CheckCircle, RefreshCw, Plus, Bot, Edit, DollarSign, CreditCard, ShieldCheck } from "lucide-react";

export default function FinancialsPage() {
  const { showToast } = useToast();
  const [quotations, setQuotations] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"quotations" | "invoices">("quotations");
  const [isLoading, setIsLoading] = useState(true);

  // Create Quotation Modal State
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);
  const [customQuotationId, setCustomQuotationId] = useState("");
  const [clientName, setClientName] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [amount, setAmount] = useState("");
  const [quotationStatus, setQuotationStatus] = useState("SENT");
  const [description, setDescription] = useState("");

  // Edit Quotation Modal State
  const [editingQuotation, setEditingQuotation] = useState<any>(null);
  const [editStatus, setEditStatus] = useState("SENT");
  const [editAmount, setEditAmount] = useState("");

  // Payment Proof Modal State
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState("CASH"); // CASH | BANK | JAZZCASH | EASYPAISA | STRIPE
  const [paymentAmount, setPaymentAmount] = useState("");
  const [receiptReference, setReceiptReference] = useState("");

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
        // If status was chosen differently, update status
        if (quotationStatus !== "SENT") {
          await fetch(`/api/quotations/${json.data.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: quotationStatus }),
          });
        }

        showToast(`Quotation for "${clientName}" saved with status ${quotationStatus}!`, "success");
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

  const handleUpdateQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuotation) return;

    try {
      const res = await fetch(`/api/quotations/${editingQuotation.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: editStatus,
          amount: editAmount ? Number(editAmount) : undefined,
        }),
      });

      const json = await res.json();
      if (json.success) {
        showToast(`Quotation ${editingQuotation.id} updated in Database!`, "success");
        setEditingQuotation(null);
        fetchFinancials();
      } else {
        showToast(`Error: ${json.error?.message}`, "error");
      }
    } catch (err) {
      showToast("Failed to update quotation", "error");
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice || !paymentAmount) return;

    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: selectedInvoice.id,
          amount: Number(paymentAmount),
          method: paymentMethod,
          reference: receiptReference || `Paid via ${paymentMethod}`,
        }),
      });

      const json = await res.json();
      if (json.success) {
        showToast(`Payment of $${paymentAmount} via ${paymentMethod} recorded in Database!`, "success");
        setSelectedInvoice(null);
        setPaymentAmount("");
        setReceiptReference("");
        fetchFinancials();
      } else {
        showToast(`Error: ${json.error?.message}`, "error");
      }
    } catch (err) {
      showToast("Failed to record payment", "error");
    }
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
              <p className="text-sm text-slate-400 mt-1">Quotation editing, status selection, and payment proof audit trails.</p>
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
              <Receipt className="w-4 h-4" /> Immutable Invoices & Payments ({invoices.length})
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
                        <th className="py-3 px-4 text-right">Admin Actions</th>
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
                                    : q.status === "SENT" || q.status === "PENDING"
                                    ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                    : q.status === "APPROVED"
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                    : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                }`}
                              >
                                {q.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right space-x-2">
                              <button
                                onClick={() => {
                                  setEditingQuotation(q);
                                  setEditStatus(q.status);
                                  setEditAmount(String(parsedAmount));
                                }}
                                className="px-2.5 py-1 bg-slate-800 text-amber-400 rounded-lg font-semibold hover:bg-slate-700 transition-all border border-slate-700"
                              >
                                Edit Quotation
                              </button>
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
                        <th className="py-3 px-4">Project</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4 text-right">Payment & Immutability Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {invoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-semibold text-amber-400">{inv.id}</td>
                          <td className="py-3.5 px-4 font-bold text-slate-300">v{inv.version || 1}.0</td>
                          <td className="py-3.5 px-4 font-semibold text-slate-100">{inv.project?.name || "Site Project"}</td>
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
                          <td className="py-3.5 px-4 text-right space-x-2">
                            {inv.status !== "PAID" && inv.status !== "VOIDED" && (
                              <button
                                onClick={() => {
                                  setSelectedInvoice(inv);
                                  setPaymentAmount(String(inv.amount));
                                }}
                                className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-xl font-semibold border border-emerald-500/30 hover:bg-emerald-500/30 transition-all text-xs"
                              >
                                Record Payment & Proof
                              </button>
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
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Quotation Initial Status *</label>
                    <select
                      value={quotationStatus}
                      onChange={(e) => setQuotationStatus(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="SENT">SENT</option>
                      <option value="PENDING">PENDING</option>
                      <option value="DRAFT">DRAFT</option>
                      <option value="APPROVED">APPROVED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
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

          {/* Edit Quotation Modal */}
          {editingQuotation && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
                <h3 className="text-lg font-bold text-white">Update Quotation: {editingQuotation.id}</h3>
                <form onSubmit={handleUpdateQuotation} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Update Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="SENT">SENT</option>
                      <option value="PENDING">PENDING</option>
                      <option value="DRAFT">DRAFT</option>
                      <option value="APPROVED">APPROVED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Quotation Amount ($)</label>
                    <input
                      type="number"
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setEditingQuotation(null)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-xs font-semibold text-white shadow-lg hover:brightness-110"
                    >
                      Save Changes to Database
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Record Payment Proof Modal */}
          {selectedInvoice && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-400" /> Record Payment & Receipt Proof
                </h3>
                <form onSubmit={handleRecordPayment} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Payment Method / Type *</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-semibold"
                    >
                      <option value="CASH">Naqad Cash (Physical Cash Handover)</option>
                      <option value="BANK">Bank Wire / Direct Transfer</option>
                      <option value="JAZZCASH">JazzCash Mobile Wallet</option>
                      <option value="EASYPAISA">EasyPaisa Mobile Wallet</option>
                      <option value="STRIPE">Stripe Card Payment</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Payment Amount ($) *</label>
                    <input
                      type="number"
                      required
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Receipt Slip # / Transaction Ref / Screenshot Reference</label>
                    <input
                      type="text"
                      placeholder="e.g. TRX-9988231 / Bank Receipt Slip / Handover Note"
                      value={receiptReference}
                      onChange={(e) => setReceiptReference(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setSelectedInvoice(null)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-xs font-semibold text-white shadow-lg hover:brightness-110"
                    >
                      Verify & Record Payment
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
