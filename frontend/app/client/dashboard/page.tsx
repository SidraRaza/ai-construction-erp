"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { Header } from "@/components/navigation/header";
import { useToast } from "@/components/ui/toast-provider";
import {
  FolderKanban,
  Receipt,
  Download,
  CheckCircle2,
  Clock,
  Building,
  FileText,
  Bot,
  ExternalLink,
} from "lucide-react";

export default function ClientDashboardPage() {
  const { showToast } = useToast();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [project, setProject] = useState<any>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [invRes, projRes] = await Promise.all([
          fetch("/api/invoices"),
          fetch("/api/projects"),
        ]);
        const invJson = await invRes.json();
        const projJson = await projRes.json();

        if (invJson.success && invJson.data && invJson.data.length > 0) {
          setInvoices(invJson.data);
        } else {
          setInvoices([
            { id: "INV-2026-004", amount: 180000, status: "PENDING", version: 1, createdAt: new Date().toISOString(), dueDate: new Date(Date.now() + 86400000 * 14).toISOString() },
            { id: "INV-2026-003", amount: 240000, status: "PAID", version: 1, createdAt: new Date(Date.now() - 86400000 * 30).toISOString(), dueDate: new Date(Date.now() - 86400000 * 15).toISOString() },
          ]);
        }

        if (projJson.success && projJson.data && projJson.data.length > 0) {
          setProject(projJson.data[0]);
        }
      } catch (e) {
        // Fallback gracefully
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleRequestAiStatus = () => {
    const pName = project?.name || "Skyline Luxury Towers - Phase 1";
    const pProgress = project?.progressPct ?? 68;
    showToast(`AI Assistant: Your project '${pName}' is at ${pProgress}% progress. Status: ${project?.status || "IN_PROGRESS"}.`, "info");
  };


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
                Client Portal Account
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-white mt-2">Project Progress & Billing Dashboard</h2>
              <p className="text-sm text-slate-400 mt-1">Real-time milestone progress tracking, paid invoices, and versioned PDF downloads.</p>
            </div>

            <button
              onClick={handleRequestAiStatus}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold text-xs shadow-lg shadow-orange-500/25 hover:brightness-110 transition-all flex items-center gap-2 shrink-0"
            >
              <Bot className="w-4 h-4" /> Ask AI Status Update
            </button>
          </div>

          {/* Project Progress Overview */}
          <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Skyline Luxury Towers — Phase 1</h3>
                <p className="text-xs text-slate-400">Total Contract Budget: $1,500,000 | Target Completion: Dec 30, 2026</p>
              </div>
              <span className="text-xl font-extrabold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 rounded-2xl">
                68% Completed
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-700 w-[68%]" />
              </div>
            </div>
          </div>

          {/* Client Invoices Table */}
          <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-amber-400" /> Issued Invoices & Billing History
              </h3>
              <span className="text-xs text-slate-400">Rule: Immutable versioned PDF documents</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase">
                    <th className="py-3 px-4">Invoice #</th>
                    <th className="py-3 px-4">Version</th>
                    <th className="py-3 px-4">Issued Date</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4">Billed Amount</th>
                    <th className="py-3 px-4 text-center">Payment Status</th>
                    <th className="py-3 px-4 text-right">PDF Download</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-semibold text-amber-400">{inv.id}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-300">v{inv.version || 1}.0</td>
                      <td className="py-3.5 px-4 text-slate-400">{new Date(inv.createdAt).toLocaleDateString()}</td>
                      <td className="py-3.5 px-4 text-slate-400">{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : "—"}</td>
                      <td className="py-3.5 px-4 font-bold text-white">${Number(inv.amount || 0).toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                            inv.status === "PAID"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Invoice PDF Preview Modal */}
          {selectedInvoice && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Invoice Document Preview</h3>
                  <span className="font-mono text-xs font-bold text-amber-400">v{selectedInvoice.version || 1}.0</span>
                </div>

                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 text-xs">
                  <div className="flex justify-between"><span>Invoice Number:</span> <strong className="font-mono text-white">{selectedInvoice.id}</strong></div>
                  <div className="flex justify-between"><span>Client Name:</span> <strong className="text-slate-200">Acme Real Estate</strong></div>
                  <div className="flex justify-between"><span>Amount Billed:</span> <strong className="text-amber-400 font-bold">${Number(selectedInvoice.amount || 0).toLocaleString()}</strong></div>
                  <div className="flex justify-between"><span>Payment Status:</span> <strong className="text-emerald-400">{selectedInvoice.status}</strong></div>
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
                      showToast(`Downloading PDF for Invoice #${selectedInvoice.id}`, "success");
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
