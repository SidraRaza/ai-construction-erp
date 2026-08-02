"use client";

import { useState } from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { Header } from "@/components/navigation/header";
import { useToast } from "@/components/ui/toast-provider";
import { Bot, Send, CheckCircle2, Sparkles } from "lucide-react";

export default function ClientAiPage() {
  const { showToast } = useToast();
  const [question, setQuestion] = useState("Agle mahine project par kya kaam hoga?");
  const [chatHistory, setChatHistory] = useState([
    {
      q: "Agle mahine project par kya kaam hoga?",
      a: "Next month (August 2026), the engineering team will begin 3rd floor slab shuttering, steel rebar placement, and electrical conduit piping for Skyline Luxury Towers - Phase 1.",
      groundedOn: ["Project.schedule", "Project.milestones"],
    },
  ]);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    const newAnswer = {
      q: question,
      a: `Project "Skyline Luxury Towers - Phase 1" is on schedule at 68% progress. Scheduled target completion date is Dec 30, 2026. Next billing milestone is upon 3rd floor completion ($180,000).`,
      groundedOn: ["Project.progressPct", "Project.endDate", "Invoice.nextMilestone"],
    };

    setChatHistory([...chatHistory, newAnswer]);
    setQuestion("");
    showToast("AI response synthesized!", "success");
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar role="CLIENT" />

      <div className="flex-1 flex flex-col min-w-0">
        <Header userName="Acme Representative" userRole="Client Portal User" />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1 overflow-y-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-amber-500/15 via-orange-500/5 to-slate-900 p-6 rounded-3xl border border-amber-500/25 shadow-xl">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                AI Client Support
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-white mt-2 flex items-center gap-3">
                <Bot className="w-7 h-7 text-amber-400" /> AI Grounded Client Project Assistant
              </h2>
              <p className="text-sm text-slate-400 mt-1">Ask any question about your project's completion timeline, milestones, or billing statements.</p>
            </div>
          </div>

          <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl backdrop-blur-md flex flex-col h-[500px]">
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

            <form onSubmit={handleSendChat} className="flex gap-3">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask any question about your project progress, budget, or completion date..."
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
        </main>
      </div>
    </div>
  );
}
