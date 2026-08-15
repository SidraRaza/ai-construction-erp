"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { Header } from "@/components/navigation/header";
import { useToast } from "@/components/ui/toast-provider";
import {
  Receipt,
  Download,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  DollarSign,
  FileText,
  ShieldCheck,
  Bot,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

export default function ClientInvoicesPage() {
  const { showToast } = useToast();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/invoices");
      const json = await res.json();
      if (json.success && json.data) {
        setInvoices(json.data);
      }
    } catch (err) {
      showToast("Error loading live invoices", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inv.project?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inv.notes || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalInvoiced = invoices.reduce((acc, inv) => acc + Number(inv.amount || 0), 0);
  const paidAmount = invoices
    .filter((inv) => inv.status === "PAID")
    .reduce((acc, inv) => acc + Number(inv.amount || 0), 0);
  const pendingAmount = invoices
    .filter((inv) => inv.status === "PENDING" || inv.status === "SENT")
    .reduce((acc, inv) => acc + Number(inv.amount || 0), 0);


  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar role="CLIENT" />

      <div className="flex-1 flex flex-col min-w-0">
        <Header userName="Acme Representative" userRole="Client Portal User" />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1 overflow-y-auto">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-amber-500/15 via-orange-500/5 to-slate-900 p-6 rounded-3xl border border-amber-500/25 shadow-xl">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                Client Financial Portal
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-white mt-2 flex items-center gap-3">
                <Receipt className="w-7 h-7 text-amber-400" /> Invoices & Billing Receipts
              </h2>
              <p className="text-sm text-slate-400 mt-1">Review versioned immutable invoices, payment receipts, and download PDF statements.</p>
            </div>

            <button
              onClick={() => showToast("AI Assistant: All issued invoices are immutable and audited.", "info")}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold hover:border-slate-700 transition-all flex items-center gap-2"
            >
              <Bot className="w-4 h-4 text-amber-400" /> AI Billing Assistant
            </button>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 backdrop-blur-md">
              <span className="text-xs font-bold text-slate-400 uppercase">Total Invoiced</span>
              <p className="text-2xl font-bold text-white mt-2">${totalInvoiced.toLocaleString()}</p>
            </div>
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 backdrop-blur-md">
              <span className="text-xs font-bold text-emerald-400 uppercase">Paid Total</span>
              <p className="text-2xl font-bold text-emerald-400 mt-2">${paidAmount.toLocaleString()}</p>
            </div>
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 backdrop-blur-md">
              <span className="text-xs font-bold text-amber-400 uppercase">Pending Due</span>
              <p className="text-2xl font-bold text-amber-400 mt-2">${pendingAmount.toLocaleString()}</p>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search invoice # or milestone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              {["ALL", "PAID", "PENDING", "VOIDED"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    statusFilter === st
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : "text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Invoices List Table */}
          <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Issued Invoices Directory</h3>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Audit Logged & Immutable
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase">
                    <th className="py-3 px-4">Invoice #</th>
                    <th className="py-3 px-4">Version</th>
                    <th className="py-3 px-4">Milestone Scope</th>
                    <th className="py-3 px-4">Issue Date</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-500 text-xs">
                        No invoices found in database
                      </td>
                    </tr>
                  ) : (
                    filteredInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-semibold text-amber-400">{inv.id}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-300">v{inv.version || 1}.0</td>
                        <td className="py-3.5 px-4 text-slate-300 max-w-xs truncate">{inv.notes || inv.project?.name || "Site Milestone Billing"}</td>
                        <td className="py-3.5 px-4 text-slate-400">{new Date(inv.createdAt).toLocaleDateString()}</td>
                        <td className="py-3.5 px-4 text-slate-400">{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : "—"}</td>
                        <td className="py-3.5 px-4 font-bold text-white">${Number(inv.amount || 0).toLocaleString()}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                              inv.status === "PAID"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : inv.status === "PENDING" || inv.status === "SENT"
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                : "bg-rose-500/10 text-rose-400 border-rose-500/20 line-through"
                            }`}
                          >
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setSelectedInvoice(inv)}
                            className="px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold hover:border-amber-500 transition-all flex items-center gap-1.5 ml-auto"
                          >
                            <Download className="w-3.5 h-3.5 text-amber-400" /> Preview PDF
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Invoice PDF Preview Modal */}
          {selectedInvoice && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Invoice Statement Preview</h3>
                  <span className="font-mono text-xs font-bold text-amber-400">v{selectedInvoice.version || 1}.0</span>
                </div>

                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 text-xs">
                  <div className="flex justify-between"><span>Invoice ID:</span> <strong className="font-mono text-white">{selectedInvoice.id}</strong></div>
                  <div className="flex justify-between"><span>Milestone Scope:</span> <strong className="text-slate-200">{selectedInvoice.notes || selectedInvoice.project?.name || "Construction Milestone"}</strong></div>
                  <div className="flex justify-between"><span>Issue Date:</span> <span className="text-slate-400">{new Date(selectedInvoice.createdAt).toLocaleDateString()}</span></div>
                  <div className="flex justify-between"><span>Due Date:</span> <span className="text-slate-400">{selectedInvoice.dueDate ? new Date(selectedInvoice.dueDate).toLocaleDateString() : "—"}</span></div>
                  <div className="flex justify-between border-t border-slate-800 pt-2"><span>Total Amount:</span> <strong className="text-amber-400 font-bold">${Number(selectedInvoice.amount || 0).toLocaleString()}</strong></div>
                  <div className="flex justify-between"><span>Status:</span> <strong className="text-emerald-400">{selectedInvoice.status}</strong></div>
                </div>


                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => setSelectedInvoice(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      showToast(`Downloading PDF Statement for Invoice ${selectedInvoice.id}`, "success");
                      setSelectedInvoice(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-xs font-semibold text-white shadow-lg hover:brightness-110 flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4" /> Download PDF
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
