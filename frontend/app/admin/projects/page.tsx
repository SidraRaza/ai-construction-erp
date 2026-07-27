"use client";

import { useState } from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { Header } from "@/components/navigation/header";
import { FolderKanban, Plus, Search, Filter, Calendar, DollarSign, Users, CheckCircle2, Clock } from "lucide-react";

const initialProjects = [
  {
    id: "p1",
    name: "Skyline Luxury Towers - Phase 1",
    client: "Acme Real Estate",
    budget: "$1,500,000",
    startDate: "Jan 15, 2026",
    endDate: "Dec 30, 2026",
    progressPct: 68,
    status: "IN_PROGRESS",
    priority: "HIGH",
    teamCount: 14,
  },
  {
    id: "p2",
    name: "Grand City Commercial Mall",
    client: "Urban Properties Group",
    budget: "$3,200,000",
    startDate: "Feb 01, 2026",
    endDate: "Mar 15, 2027",
    progressPct: 34,
    status: "IN_PROGRESS",
    priority: "MEDIUM",
    teamCount: 22,
  },
  {
    id: "p3",
    name: "Villa Residency 5 Marla Community",
    client: "Crestview Housing",
    budget: "$750,000",
    startDate: "Mar 10, 2026",
    endDate: "Sep 20, 2026",
    progressPct: 90,
    status: "IN_PROGRESS",
    priority: "URGENT",
    teamCount: 8,
  },
  {
    id: "p4",
    name: "Metro Highway Overpass Expansion",
    client: "State Infrastructure Dept",
    budget: "$5,000,000",
    startDate: "May 01, 2026",
    endDate: "Nov 30, 2027",
    progressPct: 15,
    status: "PLANNED",
    priority: "HIGH",
    teamCount: 30,
  },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState(initialProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [client, setClient] = useState("");
  const [budget, setBudget] = useState("");
  const [priority, setPriority] = useState("MEDIUM");

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !client || !budget) return;

    const newP = {
      id: `p_${Date.now()}`,
      name,
      client,
      budget: `$${Number(budget).toLocaleString()}`,
      startDate: new Date().toLocaleDateString(),
      endDate: "TBD",
      progressPct: 0,
      status: "PLANNED",
      priority,
      teamCount: 1,
    };

    setProjects([newP, ...projects]);
    setName("");
    setClient("");
    setBudget("");
    setIsModalOpen(false);
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
                <FolderKanban className="w-7 h-7 text-amber-400" /> Project Portfolio Operations
              </h2>
              <p className="text-sm text-slate-400 mt-1">Manage sites, budgets, milestones, and assigned engineering teams.</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold text-xs shadow-lg shadow-orange-500/25 hover:brightness-110 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Create New Project
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search projects or clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              {["ALL", "IN_PROGRESS", "PLANNED", "COMPLETED"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    statusFilter === st
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : "text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  {st.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.map((p) => (
              <div
                key={p.id}
                className="bg-slate-900/60 rounded-3xl border border-slate-800/90 p-6 space-y-4 hover:border-slate-700 transition-all duration-300 shadow-xl backdrop-blur-md relative overflow-hidden group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                      {p.priority} Priority
                    </span>
                    <h3 className="text-lg font-bold text-white mt-2 group-hover:text-amber-400 transition-colors">{p.name}</h3>
                    <p className="text-xs text-slate-400">Client: {p.client}</p>
                  </div>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full border ${
                      p.status === "IN_PROGRESS"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    }`}
                  >
                    {p.status.replace("_", " ")}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Site Progress</span>
                    <span className="font-bold text-amber-400">{p.progressPct}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800/80">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-700"
                      style={{ width: `${p.progressPct}%` }}
                    />
                  </div>
                </div>

                {/* Project Metadata */}
                <div className="pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-500">Budget</p>
                      <p className="font-semibold">{p.budget}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-500">End Target</p>
                      <p className="font-semibold truncate">{p.endDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-500">Site Team</p>
                      <p className="font-semibold">{p.teamCount} Active</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* New Project Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
                <h3 className="text-lg font-bold text-white">Create New Construction Project</h3>
                <form onSubmit={handleCreateProject} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Project Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Skyline Towers Phase 2"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Client Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Acme Real Estate"
                      value={client}
                      onChange={(e) => setClient(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-400 block mb-1">Budget ($)</label>
                      <input
                        type="number"
                        required
                        placeholder="500000"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-400 block mb-1">Priority</label>
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="LOW">LOW</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="HIGH">HIGH</option>
                        <option value="URGENT">URGENT</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-xs font-semibold text-white shadow-lg hover:brightness-110"
                    >
                      Create Project
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
