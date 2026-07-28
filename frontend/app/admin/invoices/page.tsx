"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { Header } from "@/components/navigation/header";
import { useToast } from "@/components/ui/toast-provider";
import { Receipt, FileText, CheckCircle, RefreshCw, Plus, Bot, Edit, DollarSign, CreditCard, ShieldCheck, Wallet } from "lucide-react";

export default function FinancialsPage() {
  const { showToast } = useToast();
  const [quotations, setQuotations] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"quotations" | "invoices" | "payments">("quotations");
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
  const [editQuotationId, setEditQuotationId] = useState("");
  const [editProjectId, setEditProjectId] = useState("");
  const [editStatus, setEditStatus] = useState("SENT");
  const [editAmount, setEditAmount] = useState("");

  // Record Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [payClientName, setPayClientName] = useState("");
  const [payProjectId, setPayProjectId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH"); // CASH | BANK | CHEQUE | JAZZCASH | EASYPAISA | STRIPE
  const [paymentAmount, setPaymentAmount] = useState("");
  const [receiptReference, setReceiptReference] = useState("");

  const fetchFinancials = async () => {
    setIsLoading(true);
    try {
      const [qRes, iRes, payRes, pRes] = await Promise.all([
        fetch("/api/quotations"),
        fetch("/api/invoices"),
        fetch("/api/payments"),
        fetch("/api/projects"),
      ]);
      const [qJson, iJson, payJson, pJson] = await Promise.all([
        qRes.json(),
        iRes.json(),
        payRes.json(),
        pRes.json(),
      ]);

      if (qJson.success) setQuotations(qJson.data || []);
      if (iJson.success) setInvoices(iJson.data || []);
      if (payJson.success) setPayments(payJson.data || []);
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
          newId: editQuotationId !== editingQuotation.id ? editQuotationId : undefined,
          projectId: editProjectId || null,
          status: editStatus,
          amount: editAmount ? Number(editAmount) : undefined,
        }),
      });

      const json = await res.json();
      if (json.success) {
        showToast(`Quotation updated in Database!`, "success");
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
    if (!paymentAmount) {
      showToast("Payment Amount is required!", "warning");
      return;
    }

    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: payClientName || "General Client",
          projectId: payProjectId || undefined,
          amount: Number(paymentAmount),
          method: paymentMethod,
          reference: receiptReference || `Paid via ${paymentMethod}`,
        }),
      });

      const json = await res.json();
      if (json.success) {
        showToast(`Payment of $${paymentAmount} via ${paymentMethod} recorded in Database!`, "success");
        setIsPaymentModalOpen(false);
        setPayClientName("");
        setPayProjectId("");
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
                <Receipt className="w-7 h-7 text-amber-400" /> Financial Billing & Payments Engine
              </h2>
              <p className="text-sm text-slate-400 mt-1">Quotations, invoices, and direct payment tracking (Cash, Bank Cheque, JazzCash, EasyPaisa).</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
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
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-xs shadow-lg hover:brightness-110 flex items-center gap-2"
              >
                <CreditCard className="w-4 h-4" /> + Record Payment
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
              <Receipt className="w-4 h-4" /> Invoices ({invoices.length})
            </button>
            <button
              onClick={() => setActiveTab("payments")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "payments"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-md"
                  : "text-slate-400 hover:bg-slate-800"
              }`}
            >
              <Wallet className="w-4 h-4" /> Payments Received ({payments.length})
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
                                  setEditQuotationId(q.id);
                                  setEditProjectId(q.projectId || "");
                                  setEditStatus(q.status);
                                  setEditAmount(String(parsedAmount));
                                }}
                                className="px-2.5 py-1 bg-slate-800 text-amber-400 rounded-lg font-semibold hover:bg-slate-700 transition-all border border-slate-700 flex items-center gap-1 ml-auto"
                              >
                                <Edit className="w-3 h-3" /> Edit All Fields
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
                <h3 className="text-base font-bold text-white">Issued Database Invoices</h3>
                <span className="text-xs text-slate-400">Rule: Immutable; Corrections create Version N+1 (Constitution §2.7)</span>
              </div>

              {invoices.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 border-2 border-dashed border-slate-800 rounded-2xl">
                  <Receipt className="w-10 h-10 text-slate-600" />
                  <h4 className="text-sm font-bold text-slate-300">No Invoices Issued in Database Yet</h4>
                  <p className="text-xs text-slate-500">Click "+ Record Payment" above to create a payment or invoice directly.</p>
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Payments Received View */}
          {activeTab === "payments" && (
            <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-emerald-400" /> Database Payments Audit Trail
                </h3>
                <button
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-xl font-semibold border border-emerald-500/30 text-xs"
                >
                  + Record New Payment
                </button>
              </div>

              {payments.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 border-2 border-dashed border-slate-800 rounded-2xl">
                  <CreditCard className="w-10 h-10 text-slate-600" />
                  <h4 className="text-sm font-bold text-slate-300">No Payments Recorded in Database Yet</h4>
                  <p className="text-xs text-slate-500">Click "+ Record Payment" to record cash, bank wire, cheque, JazzCash, or EasyPaisa payments.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase">
                        <th className="py-3 px-4">Payment ID</th>
                        <th className="py-3 px-4">Method / Type</th>
                        <th className="py-3 px-4">Amount Received</th>
                        <th className="py-3 px-4">Cheque # / Receipt Ref</th>
                        <th className="py-3 px-4 text-right">Date Recorded</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {payments.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-semibold text-emerald-400">{p.id}</td>
                          <td className="py-3.5 px-4 font-semibold text-white">
                            {p.method === "CASH" && "💵 Naqad Cash"}
                            {p.method === "BANK" && "🏦 Bank Wire Transfer"}
                            {p.method === "CHEQUE" && "📜 Bank Cheque / Pay Order"}
                            {p.method === "JAZZCASH" && "📱 JazzCash Wallet"}
                            {p.method === "EASYPAISA" && "📱 EasyPaisa Wallet"}
                            {p.method === "STRIPE" && "💳 Credit Card (Stripe)"}
                            {!["CASH", "BANK", "CHEQUE", "JAZZCASH", "EASYPAISA", "STRIPE"].includes(p.method) && p.method}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-emerald-400 text-sm">${Number(p.amount).toLocaleString()}</td>
                          <td className="py-3.5 px-4 font-mono text-slate-300">{p.reference || "Receipt verified"}</td>
                          <td className="py-3.5 px-4 text-right text-slate-400">{new Date(p.createdAt).toLocaleDateString()}</td>
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

          {/* Record Direct Payment Modal */}
          {isPaymentModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-400" /> Record New Payment
                </h3>
                <form onSubmit={handleRecordPayment} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Client Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Acme Real Estate"
                      value={payClientName}
                      onChange={(e) => setPayClientName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Select Project (Optional)</label>
                    <select
                      value={payProjectId}
                      onChange={(e) => setPayProjectId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
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
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Payment Method / Type *</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
                    >
                      <option value="CASH">💵 Naqad Cash (Physical Cash Handover)</option>
                      <option value="BANK">🏦 Bank Wire / Direct Online Transfer</option>
                      <option value="CHEQUE">📜 Bank Cheque / Pay Order (Cheque #)</option>
                      <option value="JAZZCASH">📱 JazzCash Mobile Wallet</option>
                      <option value="EASYPAISA">📱 EasyPaisa Mobile Wallet</option>
                      <option value="STRIPE">💳 Credit / Debit Card (Stripe POS)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Payment Amount ($) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 50000"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Receipt Slip # / Cheque # / Screenshot Ref</label>
                    <input
                      type="text"
                      placeholder="e.g. Cheque #884920 / TRX-9988231 / Bank Slip"
                      value={receiptReference}
                      onChange={(e) => setReceiptReference(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsPaymentModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-xs font-semibold text-white shadow-lg hover:brightness-110"
                    >
                      Save Payment to Database
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
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Edit className="w-5 h-5 text-amber-400" /> Edit All Quotation Fields
                </h3>
                <form onSubmit={handleUpdateQuotation} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Quotation ID</label>
                    <input
                      type="text"
                      value={editQuotationId}
                      onChange={(e) => setEditQuotationId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Select Project</label>
                    <select
                      value={editProjectId}
                      onChange={(e) => setEditProjectId(e.target.value)}
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
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Quotation Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
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
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
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
        </main>
      </div>
    </div>
  );
}
