"use client";

import { useEffect, useState } from "react";
import { ShieldAlert, AlertTriangle, CheckCircle2, Clock, Plus, RefreshCw, MapPin, X, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/toast-provider";

export function SiteSafetyIncidents() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState("ALL");
  const { showToast } = useToast();

  // Form State
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [severity, setSeverity] = useState("MEDIUM");
  const [category, setCategory] = useState("PPE_VIOLATION");
  const [description, setDescription] = useState("");

  const fetchIncidents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/incidents");
      const json = await res.json();
      if (json.success) {
        setIncidents(json.data || []);
      }
    } catch (err) {
      showToast("Failed to fetch safety incidents", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const handleCreateIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      showToast("Logging site safety incident...", "info");
      const res = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          location,
          severity,
          category,
          description,
        }),
      });

      const json = await res.json();
      if (json.success) {
        showToast("Safety Hazard Incident logged successfully!", "success");
        setIsModalOpen(false);
        setTitle("");
        setLocation("");
        setDescription("");
        fetchIncidents();
      } else {
        showToast(json.error || "Failed to log incident", "error");
      }
    } catch (err) {
      showToast("Error creating safety incident report", "error");
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "RESOLVED" ? "OPEN" : "RESOLVED";
    try {
      const res = await fetch("/api/incidents", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: nextStatus }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Incident marked as ${nextStatus}`, "success");
        fetchIncidents();
      }
    } catch (err) {
      showToast("Failed to update status", "error");
    }
  };

  const filteredIncidents = incidents.filter(
    (inc) => filterSeverity === "ALL" || inc.severity === filterSeverity
  );

  return (
    <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Site Safety & Hazard Incident Engine</h3>
            <p className="text-xs text-slate-400">Real-time civil safety compliance & hazard tracking</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Report Incident</span>
          </button>
        </div>
      </div>

      {/* Severity Filter Pills */}
      <div className="flex flex-wrap gap-2 text-xs font-medium">
        {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((sev) => (
          <button
            key={sev}
            onClick={() => setFilterSeverity(sev)}
            className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
              filterSeverity === sev
                ? "bg-slate-800 border-rose-500/50 text-rose-300 shadow-lg"
                : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            {sev}
          </button>
        ))}
      </div>

      {/* Incidents List Feed */}
      {isLoading ? (
        <div className="p-8 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 text-rose-400 animate-spin" />
          <span>Fetching safety hazard logs from Neon PostgreSQL...</span>
        </div>
      ) : filteredIncidents.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl text-xs text-slate-400">
          No safety incidents recorded for severity: <span className="font-semibold text-white">{filterSeverity}</span>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredIncidents.map((inc) => (
            <div
              key={inc.id}
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition-all space-y-2 text-xs"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                        inc.severity === "CRITICAL"
                          ? "bg-rose-950 border border-rose-500/40 text-rose-300 animate-pulse"
                          : inc.severity === "HIGH"
                          ? "bg-orange-950 border border-orange-500/40 text-orange-300"
                          : inc.severity === "MEDIUM"
                          ? "bg-amber-950 border border-amber-500/40 text-amber-300"
                          : "bg-emerald-950 border border-emerald-500/40 text-emerald-300"
                      }`}
                    >
                      {inc.severity}
                    </span>
                    <h4 className="font-semibold text-slate-100 text-sm">{inc.title}</h4>
                  </div>
                  <p className="text-slate-400 leading-relaxed">{inc.description}</p>
                </div>

                <button
                  onClick={() => handleToggleStatus(inc.id, inc.status)}
                  className={`px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition-all cursor-pointer shrink-0 ${
                    inc.status === "RESOLVED"
                      ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
                      : "bg-amber-950/60 border-amber-500/40 text-amber-300 hover:bg-emerald-950/60 hover:text-emerald-300"
                  }`}
                >
                  {inc.status === "RESOLVED" ? "RESOLVED ✓" : "MARK RESOLVED"}
                </button>
              </div>

              <div className="pt-2 border-t border-slate-900 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>{inc.location}</span>
                </div>
                <div className="flex items-center gap-3 font-mono text-[10px]">
                  <span>Project: {inc.project?.name || "Skyline Towers"}</span>
                  <span>Reported By: {inc.reportedBy}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Report Incident Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Report Safety Hazard Incident</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateIncident} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-medium">Incident Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Missing Scaffold Guardrails"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-rose-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Severity Level</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-rose-500/50"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-rose-500/50"
                  >
                    <option value="PPE_VIOLATION">PPE VIOLATION</option>
                    <option value="EQUIPMENT_HAZARD">EQUIPMENT HAZARD</option>
                    <option value="STRUCTURAL_RISK">STRUCTURAL RISK</option>
                    <option value="NEAR_MISS">NEAR MISS</option>
                    <option value="ACCIDENT">ACCIDENT</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-medium">Site Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tower B - 14th Floor Perimeter"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-rose-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-medium">Detailed Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the hazard risk, workers involved, and recommended corrective action..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-rose-500/50 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-medium hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-lg shadow-rose-500/20"
                >
                  Submit Incident Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
