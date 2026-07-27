"use client";

import { useState } from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { Header } from "@/components/navigation/header";
import { Bot, Sparkles, FileText, Calculator, Receipt, MessageSquare, Send, CheckCircle2 } from "lucide-react";

export default function AiStudioPage() {
  const [activeTab, setActiveTab] = useState<"report" | "estimate" | "chat">("report");

  // Tab 1 State
  const [rawNote, setRawNote] = useState("Finished 2nd floor column reinforcement, poured 45 cubic meters concrete.");
  const [generatedReport, setGeneratedReport] = useState("");
  const [isReportLoading, setIsReportLoading] = useState(false);

  // Tab 2 State
  const [scopeDesc, setScopeDesc] = useState("5 Marla Residential House Construction");
  const [costEstimate, setCostEstimate] = useState<{
    materialCost: number;
    labourCost: number;
    estimatedDays: number;
    totalCost: number;
    breakdown: Array<{ category: string; estimatedCost: number }>;
  } | null>(null);
  const [isEstLoading, setIsEstLoading] = useState(false);

  // Tab 3 State
  const [chatQuestion, setChatQuestion] = useState("Project kab complete hoga?");
  const [chatHistory, setChatHistory] = useState<Array<{ q: string; a: string; groundedOn: string[] }>>([
    {
      q: "Project kab complete hoga?",
      a: 'Project "Skyline Luxury Towers - Phase 1" is currently at 68% completion. Scheduled target completion date is Dec 30, 2026.',
      groundedOn: ["Project.name", "Project.progressPct", "Project.endDate"],
    },
  ]);

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsReportLoading(true);
    setTimeout(() => {
      setGeneratedReport(`
# 🚧 Official Site Daily Progress Report

**Project Name:** Skyline Luxury Towers - Phase 1
**Date:** ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
**Engineer Input Summary:** "${rawNote}"

---

### Key Construction Milestones Executed Today:
1. **Work Completion:** ${rawNote}.
2. **Quality Inspection:** Conducted slump tests and steel tie spacing inspections per engineering standards.
3. **Labour Utilization:** Allocated 42 site workers across masonry, formwork, and concrete pouring zones.

### Recommended Next Steps for Tomorrow:
- Initiate 7-day wet curing cycle for column pour.
- Strip beam bottom shuttering after strength test verification.

*Report automatically synthesized via AI Construction ERP Engine.*
      `.trim());
      setIsReportLoading(false);
    }, 1000);
  };

  const handleEstimateCost = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEstLoading(true);
    setTimeout(() => {
      setCostEstimate({
        materialCost: 2800000,
        labourCost: 1200000,
        estimatedDays: 90,
        totalCost: 4000000,
        breakdown: [
          { category: "Cement & Concrete", estimatedCost: 980000 },
          { category: "Steel Structure Reinforcement", estimatedCost: 840000 },
          { category: "Bricks, Sand & Aggregate", estimatedCost: 560000 },
          { category: "Plumbing & Electrical Conduit", estimatedCost: 420000 },
          { category: "Site Labour & Operations", estimatedCost: 1200000 },
        ],
      });
      setIsEstLoading(false);
    }, 1000);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatQuestion.trim()) return;

    const newAnswer = {
      q: chatQuestion,
      a: `Project "Skyline Luxury Towers - Phase 1" is currently at 68% progress with active status IN_PROGRESS. Target completion date: Dec 30, 2026. Total budget allocated is $1,500,000.`,
      groundedOn: ["Project.name", "Project.progressPct", "Project.budget"],
    };

    setChatHistory([...chatHistory, newAnswer]);
    setChatQuestion("");
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
                <Bot className="w-7 h-7 text-amber-400" /> AI Engineering & Intelligence Studio
              </h2>
              <p className="text-sm text-slate-400 mt-1">Automated daily site reports, cost estimators, and grounded project Q&A chat assistant.</p>
            </div>
            <span className="px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> AI Engine Active
            </span>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <button
              onClick={() => setActiveTab("report")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "report"
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-md"
                  : "text-slate-400 hover:bg-slate-800"
              }`}
            >
              <FileText className="w-4 h-4" /> Daily Progress Report AI
            </button>
            <button
              onClick={() => setActiveTab("estimate")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "estimate"
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-md"
                  : "text-slate-400 hover:bg-slate-800"
              }`}
            >
              <Calculator className="w-4 h-4" /> Cost & Timeline Estimator AI
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "chat"
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-md"
                  : "text-slate-400 hover:bg-slate-800"
              }`}
            >
              <MessageSquare className="w-4 h-4" /> Grounded Q&A Assistant
            </button>
          </div>

          {/* Tab 1: AI Daily Report */}
          {activeTab === "report" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl backdrop-blur-md">
                <h3 className="text-base font-bold text-white">Engineer Field Input Note</h3>
                <form onSubmit={handleGenerateReport} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Raw Engineer Input ("Today completed slab work")</label>
                    <textarea
                      rows={5}
                      value={rawNote}
                      onChange={(e) => setRawNote(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isReportLoading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-xs font-bold text-white shadow-lg hover:brightness-110 flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" /> {isReportLoading ? "Synthesizing Report..." : "Synthesize AI Daily Report"}
                  </button>
                </form>
              </div>

              <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl backdrop-blur-md">
                <h3 className="text-base font-bold text-white">Polished AI Construction Report Output</h3>
                {generatedReport ? (
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                    {generatedReport}
                  </div>
                ) : (
                  <div className="h-64 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-500 text-xs space-y-2">
                    <FileText className="w-8 h-8 text-slate-600" />
                    <p>Generated report will appear here</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: AI Cost Estimator */}
          {activeTab === "estimate" && (
            <div className="space-y-6">
              <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl backdrop-blur-md">
                <h3 className="text-base font-bold text-white">Project Scope Description</h3>
                <form onSubmit={handleEstimateCost} className="flex gap-4">
                  <input
                    type="text"
                    required
                    value={scopeDesc}
                    onChange={(e) => setScopeDesc(e.target.value)}
                    placeholder="e.g. 5 Marla Residential House Construction"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    disabled={isEstLoading}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-xs font-bold text-white shadow-lg hover:brightness-110 flex items-center gap-2 shrink-0"
                  >
                    <Calculator className="w-4 h-4" /> {isEstLoading ? "Calculating..." : "Estimate Cost"}
                  </button>
                </form>
              </div>

              {costEstimate && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-4">
                    <h4 className="text-xs font-bold uppercase text-slate-400">Total Cost Estimate</h4>
                    <p className="text-3xl font-extrabold text-amber-400">${costEstimate.totalCost.toLocaleString()}</p>
                    <div className="pt-3 border-t border-slate-800 space-y-2 text-xs text-slate-300">
                      <div className="flex justify-between"><span>Material Cost:</span> <span className="font-bold">${costEstimate.materialCost.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span>Labour Cost:</span> <span className="font-bold">${costEstimate.labourCost.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span>Estimated Days:</span> <span className="font-bold">{costEstimate.estimatedDays} Days</span></div>
                    </div>
                  </div>

                  <div className="lg:col-span-2 bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-4">
                    <h4 className="text-xs font-bold uppercase text-slate-400">Itemized Cost Breakdown</h4>
                    <div className="space-y-3">
                      {costEstimate.breakdown.map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800 text-xs">
                          <span className="font-medium text-slate-200">{item.category}</span>
                          <span className="font-bold text-amber-400">${item.estimatedCost.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Grounded AI Q&A Assistant */}
          {activeTab === "chat" && (
            <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl backdrop-blur-md flex flex-col h-[500px]">
              <h3 className="text-base font-bold text-white">Grounded Project Q&A Assistant</h3>

              {/* Chat Message Thread */}
              <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-slate-950/80 rounded-2xl border border-slate-800">
                {chatHistory.map((c, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-end">
                      <div className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-4 py-2 rounded-2xl text-xs max-w-md">
                        {c.q}
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-xs text-slate-200 max-w-lg space-y-2">
                        <p>{c.a}</p>
                        <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 pt-1 border-t border-slate-800">
                          <CheckCircle2 className="w-3 h-3" /> Grounded on: {c.groundedOn.join(", ")}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendChat} className="flex gap-3">
                <input
                  type="text"
                  value={chatQuestion}
                  onChange={(e) => setChatQuestion(e.target.value)}
                  placeholder="Ask any question about project progress, budget, or completion date..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl text-xs font-bold shadow-lg hover:brightness-110 flex items-center gap-2 shrink-0"
                >
                  <Send className="w-4 h-4" /> Send
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
