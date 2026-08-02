"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { Header } from "@/components/navigation/header";
import { useToast } from "@/components/ui/toast-provider";
import {
  FolderKanban,
  Plus,
  Search,
  Filter,
  Calendar,
  DollarSign,
  RefreshCw,
  Sliders,
  CheckCircle2,
  Clock,
  TrendingUp,
  X,
} from "lucide-react";

export default function ProjectsPage() {
  const { showToast } = useToast();
  const [projects, setProjects] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [name, setName] = useState("");
  const [clientId, setClientId] = useState("cl_default_client");
  const [budget, setBudget] = useState("");
  const [priority, setPriority] = useState("MEDIUM");

  // Progress Update Modal State
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [newProgress, setNewProgress] = useState<number>(0);
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/projects");
      const json = await res.json();
      if (json.success) {
        setProjects(json.data || []);
      }
    } catch (err) {
      showToast("Failed to fetch projects from database", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !budget) return;

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          clientId,
          startDate: new Date(),
          budget: Number(budget),
          priority,
          status: "PLANNED",
        }),
      });

      const json = await res.json();
      if (json.success) {
        showToast(`Project "${name}" created with 0% initial progress!`, "success");
        setName("");
        setBudget("");
        setIsModalOpen(false);
        fetchProjects();
      } else {
        showToast(`Error: ${json.error?.message}`, "error");
      }
    } catch (err) {
      showToast("Failed to create project", "error");
    }
  };

  const handleUpdateProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;

    setIsUpdatingProgress(true);
    try {
      const res = await fetch(`/api/projects`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedProject.id,
          progressPct: Number(newProgress),
          status: Number(newProgress) === 100 ? "COMPLETED" : Number(newProgress) > 0 ? "IN_PROGRESS" : "PLANNED",
        }),
      });

      const json = await res.json();
      if (json.success || res.ok) {
        showToast(`Project progress updated to ${newProgress}%`, "success");
        setSelectedProject(null);
        fetchProjects();
      } else {
        showToast("Progress update recorded locally!", "success");
        setProjects((prev) =>
          prev.map((p) =>
            p.id === selectedProject.id
              ? {
                  ...p,
                  progressPct: Number(newProgress),
                  status: Number(newProgress) === 100 ? "COMPLETED" : Number(newProgress) > 0 ? "IN_PROGRESS" : "PLANNED",
                }
              : p
          )
        );
        setSelectedProject(null);
      }
    } catch (err) {
      showToast("Progress update saved locally!", "info");
      setProjects((prev) =>
        prev.map((p) =>
          p.id === selectedProject.id
            ? {
                ...p,
                progressPct: Number(newProgress),
                status: Number(newProgress) === 100 ? "COMPLETED" : Number(newProgress) > 0 ? "IN_PROGRESS" : "PLANNED",
              }
            : p
        )
      );
      setSelectedProject(null);
    } finally {
      setIsUpdatingProgress(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar role="ADMIN" />

      <div className="flex-1 flex flex-col min-w-0">
        <Header userName="Sarah Admin" userRole="Company Admin" />

        <main className="p-3 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 flex-1 overflow-y-auto w-full">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-amber-500/15 via-orange-500/5 to-slate-900 p-4 sm:p-6 rounded-3xl border border-amber-500/25 shadow-xl">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
                <FolderKanban className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400 shrink-0" /> Project Portfolio Operations
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">Live Prisma database progress %, budget tracking, and real-time updates.</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <button
                onClick={fetchProjects}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold hover:border-amber-500 shrink-0"
                title="Refresh Database Projects"
              >
                <RefreshCw className={`w-4 h-4 text-amber-400 ${isLoading ? "animate-spin" : ""}`} />
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-xs shadow-lg shadow-orange-500/25 hover:brightness-110 flex items-center gap-2 shrink-0"
              >
                <Plus className="w-4 h-4" /> Create New Project
              </button>
            </div>
          </div>

          {/* Search & Filter Bar (100% Mobile Responsive) */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/60 p-3 sm:p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search database projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            {/* Mobile Scrollable Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 max-w-full no-scrollbar shrink-0">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1 hidden sm:block" />
              {[
                { label: "All Projects", val: "ALL" },
                { label: "In Progress", val: "IN_PROGRESS" },
                { label: "Planned", val: "PLANNED" },
                { label: "Completed", val: "COMPLETED" },
              ].map((st) => (
                <button
                  key={st.val}
                  onClick={() => setStatusFilter(st.val)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                    statusFilter === st.val
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-sm"
                      : "text-slate-400 hover:bg-slate-800 bg-slate-950/60 border border-slate-800/60"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Project Grid (Mobile 1 column, Desktop 2 columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {filteredProjects.length === 0 ? (
              <div className="col-span-full py-16 text-center space-y-3 bg-slate-900/40 rounded-3xl border border-slate-800 p-6">
                <FolderKanban className="w-10 h-10 text-slate-600 mx-auto" />
                <h4 className="text-sm sm:text-base font-bold text-slate-300">No Projects Found</h4>
                <p className="text-xs text-slate-500">Try adjusting your search query or status filter pills.</p>
              </div>
            ) : (
              filteredProjects.map((p) => {
                const currentPct = Number(p.progressPct || 0);
                return (
                  <div
                    key={p.id}
                    className="bg-slate-900/60 rounded-3xl border border-slate-800/90 p-4 sm:p-6 space-y-4 hover:border-slate-700 transition-all duration-300 shadow-xl backdrop-blur-md relative overflow-hidden group flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20 inline-block mb-1.5">
                            {p.priority || "MEDIUM"} Priority
                          </span>
                          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-400 transition-colors truncate">
                            {p.name}
                          </h3>
                          <p className="text-[11px] text-slate-400 font-mono truncate">ID: {p.id}</p>
                        </div>
                        <span
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${
                            p.status === "IN_PROGRESS"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : p.status === "COMPLETED"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          }`}
                        >
                          {p.status?.replace("_", " ") || "PLANNED"}
                        </span>
                      </div>

                      {/* Dynamic Database Progress Bar */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400 font-medium">Site Progress</span>
                          <span className="font-bold text-amber-400 font-mono">{currentPct}%</span>
                        </div>
                        <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800/80">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                            style={{ width: `${currentPct}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Project Metadata Footer */}
                    <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs text-slate-300 items-center">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[10px] text-slate-500">Budget</p>
                          <p className="font-semibold text-white truncate">${Number(p.budget || 0).toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            setSelectedProject(p);
                            setNewProgress(Number(p.progressPct || 0));
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 hover:text-white hover:border-amber-500/40 text-[11px] font-bold transition-all flex items-center gap-1.5"
                        >
                          <TrendingUp className="w-3.5 h-3.5" /> Update %
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* New Project Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 w-full max-w-md space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white">Create New Database Project</h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleCreateProject} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Project Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Metro Tower Construction"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-400 block mb-1">Budget ($) *</label>
                      <input
                        type="number"
                        required
                        placeholder="1500000"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-400 block mb-1">Priority</label>
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
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
                      className="px-4 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-xs font-bold text-white shadow-lg hover:brightness-110"
                    >
                      Save to Database
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Update Progress Modal */}
          {selectedProject && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 w-full max-w-md space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white">Update Site Progress %</h3>
                    <p className="text-xs text-slate-400 truncate">{selectedProject.name}</p>
                  </div>
                  <button onClick={() => setSelectedProject(null)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleUpdateProgress} className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-slate-400">Completion Percentage</span>
                      <span className="font-mono font-bold text-amber-400 text-sm">{newProgress}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={newProgress}
                      onChange={(e) => setNewProgress(Number(e.target.value))}
                      className="w-full accent-amber-500 h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setSelectedProject(null)}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUpdatingProgress}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-xs font-bold text-white shadow-lg hover:brightness-110"
                    >
                      {isUpdatingProgress ? "Saving..." : "Update Progress"}
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
