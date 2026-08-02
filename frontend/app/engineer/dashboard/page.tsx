"use client";

import { useState } from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { Header } from "@/components/navigation/header";
import { useToast } from "@/components/ui/toast-provider";
import {
  FolderKanban,
  QrCode,
  Camera,
  Bot,
  DollarSign,
  Send,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Upload,
} from "lucide-react";

export default function EngineerDashboardPage() {
  const { showToast } = useToast();
  const [siteNote, setSiteNote] = useState("Finished 2nd floor column reinforcement, poured 45 cubic meters concrete.");
  const [aiReport, setAiReport] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Expense Modal State
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseNote, setExpenseNote] = useState("");

  const handleGenerateAiReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAiLoading(true);
    setTimeout(() => {
      setAiReport(`
# 🚧 Official Site Daily Progress Report

**Project:** Skyline Luxury Towers - Phase 1
**Lead Engineer:** Alex Engineer
**Date:** ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}

---

### Executed Milestones:
1. **Column Reinforcement & Concrete Pouring:** ${siteNote}.
2. **Quality Check:** Passed slump test and steel spacing inspection.
3. **Labour Utilization:** Allocated 28 workers across masonry and formwork zones.

### Action Plan for Tomorrow:
- Initiate 7-day wet curing cycle on column pour.
- Prepare beam bottom shuttering for Phase 2 inspection.
      `.trim());
      setIsAiLoading(false);
      showToast("AI Daily Site Report Synthesized!", "success");
    }, 1200);
  };

  const handleLogExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(expenseAmount);
    if (amt > 10000) {
      showToast("Forbidden: Engineer expense entries capped at $10,000. Admin approval required.", "error");
      return;
    }

    showToast(`Site Expense $${amt.toLocaleString()} recorded under assigned site!`, "success");
    setExpenseAmount("");
    setExpenseNote("");
    setIsExpenseModalOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar role="ENGINEER" />

      <div className="flex-1 flex flex-col min-w-0">
        <Header userName="Alex Engineer" userRole="Site Lead Engineer" />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1 overflow-y-auto">
          {/* Site Lead Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-amber-500/15 via-orange-500/5 to-slate-900 p-6 rounded-3xl border border-amber-500/25 shadow-xl">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                Assigned Site: Skyline Towers Phase 1
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-white mt-2">Field Operations Command</h2>
              <p className="text-sm text-slate-400 mt-1">Record site progress, scan labour QR codes, log capped expenses ($10k max).</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => showToast("Labour QR Badge Scanner Ready!", "info")}
                className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold hover:border-slate-700 transition-all flex items-center gap-2"
              >
                <QrCode className="w-4 h-4 text-amber-400" />
                Scan Worker QR
              </button>
              <button
                onClick={() => setIsExpenseModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold text-xs shadow-lg shadow-orange-500/20 hover:brightness-110 transition-all flex items-center gap-2"
              >
                <DollarSign className="w-4 h-4" />
                Log Site Expense
              </button>
            </div>
          </div>

          {/* Daily Progress Reporter & AI Synthesizer */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl backdrop-blur-md">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-amber-400" /> Raw Site Daily Entry
              </h3>

              <form onSubmit={handleGenerateAiReport} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Today's Site Notes</label>
                  <textarea
                    rows={4}
                    value={siteNote}
                    onChange={(e) => setSiteNote(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Photo Upload Simulator */}
                <div
                  onClick={() => showToast("Site Progress Photo attached successfully!", "success")}
                  className="border-2 border-dashed border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 text-center cursor-pointer transition-all bg-slate-950/50 space-y-1"
                >
                  <Upload className="w-6 h-6 text-amber-400 mx-auto" />
                  <p className="text-xs font-semibold text-slate-300">Attach Site Progress Photo</p>
                  <p className="text-[10px] text-slate-500">Supports JPG, PNG up to 10MB</p>
                </div>

                <button
                  type="submit"
                  disabled={isAiLoading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-xs font-bold text-white shadow-lg hover:brightness-110 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> {isAiLoading ? "Synthesizing AI Report..." : "Synthesize AI Daily Site Report"}
                </button>
              </form>
            </div>

            {/* AI Synthesized Output */}
            <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl backdrop-blur-md">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-amber-400" /> Polished Executive Report
              </h3>
              {aiReport ? (
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                  {aiReport}
                </div>
              ) : (
                <div className="h-64 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-500 text-xs space-y-2">
                  <Bot className="w-8 h-8 text-slate-600" />
                  <p>AI Synthesized report output will appear here</p>
                </div>
              )}
            </div>
          </div>

          {/* Capped Expense Modal */}
          {isExpenseModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
                <h3 className="text-lg font-bold text-white">Log Site Expense (Max $10,000)</h3>
                <p className="text-xs text-slate-400">Assigned Site: Skyline Luxury Towers - Phase 1</p>

                <form onSubmit={handleLogExpense} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Expense Amount ($)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 4500"
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Category & Note</label>
                    <input
                      type="text"
                      placeholder="e.g. Concrete vibrator repair & fuel"
                      value={expenseNote}
                      onChange={(e) => setExpenseNote(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsExpenseModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-xs font-semibold text-white shadow-lg hover:brightness-110"
                    >
                      Record Expense
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
