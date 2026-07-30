"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { Header } from "@/components/navigation/header";
import { useToast } from "@/components/ui/toast-provider";
import {
  Sliders,
  Plus,
  Trash2,
  Save,
  Layers,
  FileSpreadsheet,
  CheckCircle2,
  RefreshCw,
  SlidersHorizontal,
  Building2,
  Lock,
  Calendar,
  Hash,
  Type,
  ListFilter,
  CheckSquare,
} from "lucide-react";

export default function CustomFieldsPage() {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<"SCHEMA" | "ENTRIES">("SCHEMA");
  const [customFields, setCustomFields] = useState<any[]>([]);
  const [entries, setEntries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New Custom Field Form State
  const [fieldName, setFieldName] = useState("");
  const [fieldType, setFieldType] = useState("TEXT");
  const [optionsStr, setOptionsStr] = useState("");
  const [isRequired, setIsRequired] = useState(false);

  // New Entry Form State
  const [recordTitle, setRecordTitle] = useState("");
  const [entryValues, setEntryValues] = useState<Record<string, any>>({});

  const fetchCustomData = async () => {
    setIsLoading(true);
    try {
      const [fRes, eRes] = await Promise.all([
        fetch("/api/custom-fields"),
        fetch("/api/custom-fields/entries"),
      ]);

      const [fJson, eJson] = await Promise.all([fRes.json(), eRes.json()]);

      if (fJson.success && Array.isArray(fJson.data)) {
        setCustomFields(fJson.data);
      }
      if (eJson.success && Array.isArray(eJson.data)) {
        setEntries(eJson.data);
      }
    } catch (err) {
      showToast("Failed to fetch company custom fields", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomData();
  }, []);

  const handleCreateField = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldName) {
      showToast("Field Name is required!", "warning");
      return;
    }

    const parsedOptions =
      fieldType === "SELECT" && optionsStr
        ? optionsStr.split(",").map((o) => o.trim()).filter(Boolean)
        : undefined;

    try {
      const res = await fetch("/api/custom-fields", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fieldName,
          fieldType,
          options: parsedOptions,
          isRequired,
        }),
      });

      const json = await res.json();
      if (json.success) {
        showToast(`Custom Field "${fieldName}" added!`, "success");
        setFieldName("");
        setOptionsStr("");
        setIsRequired(false);
        fetchCustomData();
      } else {
        showToast(json.error?.message || "Failed to add custom field", "error");
      }
    } catch (err) {
      showToast("Error adding field", "error");
    }
  };

  const handleDeleteField = async (id: string, name: string) => {
    try {
      const res = await fetch(`/api/custom-fields?id=${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Field "${name}" deleted`, "info");
        fetchCustomData();
      }
    } catch (err) {
      showToast("Error deleting field", "error");
    }
  };

  const handleCreateEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordTitle) {
      showToast("Record Title is required!", "warning");
      return;
    }

    try {
      const res = await fetch("/api/custom-fields/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recordTitle,
          fieldValues: entryValues,
        }),
      });

      const json = await res.json();
      if (json.success) {
        showToast(`Custom Production Record "${recordTitle}" saved!`, "success");
        setRecordTitle("");
        setEntryValues({});
        fetchCustomData();
      } else {
        showToast(json.error?.message || "Failed to save record", "error");
      }
    } catch (err) {
      showToast("Error saving production entry", "error");
    }
  };

  const getFieldIcon = (type: string) => {
    switch (type) {
      case "NUMBER":
        return <Hash className="w-3.5 h-3.5 text-blue-400" />;
      case "DATE":
        return <Calendar className="w-3.5 h-3.5 text-purple-400" />;
      case "SELECT":
        return <ListFilter className="w-3.5 h-3.5 text-amber-400" />;
      case "CHECKBOX":
        return <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Type className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar role="ADMIN" />

      <div className="flex-1 flex flex-col min-w-0">
        <Header userName="Sarah Admin" userRole="Company Admin" />

        <main className="p-8 space-y-6 flex-1 overflow-y-auto">
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-amber-500/15 via-orange-500/5 to-slate-900 p-6 rounded-3xl border border-amber-500/25 shadow-2xl backdrop-blur-xl">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-3">
                <SlidersHorizontal className="w-8 h-8 text-amber-400 p-1.5 bg-amber-500/10 rounded-2xl border border-amber-500/20 shadow-inner" />
                Custom Production & Self-Configurable Fields Engine
              </h2>
              <p className="text-xs text-slate-400 font-medium flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-emerald-400" /> 100% Tenant Isolated • Define your company's own custom fields & production data without hardcoded restrictions.
              </p>
            </div>

            <button
              onClick={fetchCustomData}
              className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/40 hover:bg-slate-800 transition-all duration-200 shadow-md active:scale-95 flex items-center gap-2 text-xs font-bold"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-amber-400" : ""}`} /> Refresh Custom Data
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 max-w-md">
            <button
              type="button"
              onClick={() => setActiveTab("SCHEMA")}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === "SCHEMA"
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Sliders className="w-4 h-4" /> 1. Configure Fields Schema ({customFields.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("ENTRIES")}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === "ENTRIES"
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" /> 2. Production Entry & Ledger ({entries.length})
            </button>
          </div>

          {/* TAB 1: FIELD SCHEMA BUILDER */}
          {activeTab === "SCHEMA" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Add Custom Field Form */}
              <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800/90 space-y-4 shadow-xl backdrop-blur-md h-fit">
                <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Plus className="w-5 h-5 text-amber-400" /> Define New Custom Field
                </h3>

                <form onSubmit={handleCreateField} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Field Label / Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Concrete Pouring Depth (Meters)"
                      value={fieldName}
                      onChange={(e) => setFieldName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Field Data Type *</label>
                    <select
                      value={fieldType}
                      onChange={(e) => setFieldType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
                    >
                      <option value="TEXT">Text String</option>
                      <option value="NUMBER">Numeric Value</option>
                      <option value="DATE">Calendar Date</option>
                      <option value="SELECT">Dropdown Select Options</option>
                      <option value="CHECKBOX">Checkbox (Yes / No)</option>
                    </select>
                  </div>

                  {fieldType === "SELECT" && (
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Dropdown Options (Comma-Separated)</label>
                      <input
                        type="text"
                        placeholder="e.g. Grade A, Grade B, Grade C"
                        value={optionsStr}
                        onChange={(e) => setOptionsStr(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="reqCheck"
                      checked={isRequired}
                      onChange={(e) => setIsRequired(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-amber-500 focus:ring-amber-500"
                    />
                    <label htmlFor="reqCheck" className="text-xs text-slate-300 font-semibold cursor-pointer">
                      Mark Field as Mandatory / Required
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-xs shadow-lg hover:brightness-110 flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" /> Save Field to Company Schema
                  </button>
                </form>
              </div>

              {/* Configured Fields List */}
              <div className="lg:col-span-2 bg-slate-900/60 p-6 rounded-3xl border border-slate-800/90 space-y-4 shadow-xl backdrop-blur-md">
                <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Sliders className="w-5 h-5 text-amber-400" /> Configured Custom Fields ({customFields.length})
                </h3>

                {customFields.length === 0 ? (
                  <div className="py-16 flex flex-col items-center justify-center text-center space-y-3 border-2 border-dashed border-slate-800/80 rounded-3xl bg-slate-950/40">
                    <Sliders className="w-10 h-10 text-slate-600" />
                    <h4 className="text-base font-bold text-slate-300">No Custom Fields Defined Yet</h4>
                    <p className="text-xs text-slate-500 max-w-sm">Use the form on the left to add your company's own custom fields like equipment numbers, concrete pour depths, or quality check grades.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {customFields.map((f) => {
                      const opts = f.options ? JSON.parse(f.options) : [];
                      return (
                        <div key={f.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-2 relative group">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                                {getFieldIcon(f.fieldType)}
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-white">{f.fieldName}</h4>
                                <span className="text-[10px] font-mono text-amber-400 uppercase bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                                  {f.fieldType}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteField(f.id, f.fieldName)}
                              title="Delete Field"
                              className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {opts.length > 0 && (
                            <div className="pt-2 border-t border-slate-900 flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] text-slate-500">Options:</span>
                              {opts.map((o: string, idx: number) => (
                                <span key={idx} className="text-[10px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded-md border border-slate-800 font-medium">
                                  {o}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: DYNAMIC PRODUCTION FORM & ENTRY LEDGER */}
          {activeTab === "ENTRIES" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Dynamic Production Entry Form */}
              <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800/90 space-y-4 shadow-xl backdrop-blur-md h-fit">
                <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <FileSpreadsheet className="w-5 h-5 text-amber-400" /> Log Production Record
                </h3>

                {customFields.length === 0 ? (
                  <p className="text-xs text-amber-400 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                    ⚠️ Please define at least one custom field in Tab 1 first!
                  </p>
                ) : (
                  <form onSubmit={handleCreateEntry} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Production Record Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Concrete Pour Batch #104"
                        value={recordTitle}
                        onChange={(e) => setRecordTitle(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-semibold"
                      />
                    </div>

                    {/* Dynamically Generated Custom Fields Form Inputs */}
                    <div className="space-y-3 pt-2 border-t border-slate-800">
                      <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Company Dynamic Fields</h4>

                      {customFields.map((f) => {
                        const opts = f.options ? JSON.parse(f.options) : [];
                        return (
                          <div key={f.id}>
                            <label className="text-xs font-semibold text-slate-300 block mb-1">
                              {f.fieldName} {f.isRequired && <span className="text-rose-400">*</span>}
                            </label>

                            {f.fieldType === "TEXT" && (
                              <input
                                type="text"
                                required={f.isRequired}
                                value={entryValues[f.fieldName] || ""}
                                onChange={(e) => setEntryValues({ ...entryValues, [f.fieldName]: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                              />
                            )}

                            {f.fieldType === "NUMBER" && (
                              <input
                                type="number"
                                required={f.isRequired}
                                value={entryValues[f.fieldName] || ""}
                                onChange={(e) => setEntryValues({ ...entryValues, [f.fieldName]: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                              />
                            )}

                            {f.fieldType === "DATE" && (
                              <input
                                type="date"
                                required={f.isRequired}
                                value={entryValues[f.fieldName] || ""}
                                onChange={(e) => setEntryValues({ ...entryValues, [f.fieldName]: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                              />
                            )}

                            {f.fieldType === "SELECT" && (
                              <select
                                required={f.isRequired}
                                value={entryValues[f.fieldName] || ""}
                                onChange={(e) => setEntryValues({ ...entryValues, [f.fieldName]: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-semibold"
                              >
                                <option value="">-- Select Option --</option>
                                {opts.map((o: string, idx: number) => (
                                  <option key={idx} value={o}>
                                    {o}
                                  </option>
                                ))}
                              </select>
                            )}

                            {f.fieldType === "CHECKBOX" && (
                              <div className="flex items-center gap-2 pt-1">
                                <input
                                  type="checkbox"
                                  id={`chk_${f.id}`}
                                  checked={Boolean(entryValues[f.fieldName])}
                                  onChange={(e) => setEntryValues({ ...entryValues, [f.fieldName]: e.target.checked })}
                                  className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-amber-500 focus:ring-amber-500"
                                />
                                <label htmlFor={`chk_${f.id}`} className="text-xs text-slate-300 font-medium">
                                  Checked / Verified
                                </label>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-xs shadow-lg hover:brightness-110 flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" /> Save Production Record
                    </button>
                  </form>
                )}
              </div>

              {/* Dynamic Production Ledger Table */}
              <div className="lg:col-span-2 bg-slate-900/60 p-6 rounded-3xl border border-slate-800/90 space-y-4 shadow-xl backdrop-blur-md">
                <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <FileSpreadsheet className="w-5 h-5 text-amber-400" /> Production Activity Ledger ({entries.length})
                </h3>

                {entries.length === 0 ? (
                  <div className="py-16 flex flex-col items-center justify-center text-center space-y-3 border-2 border-dashed border-slate-800/80 rounded-3xl bg-slate-950/40">
                    <FileSpreadsheet className="w-10 h-10 text-slate-600" />
                    <h4 className="text-base font-bold text-slate-300">No Production Records Logged Yet</h4>
                    <p className="text-xs text-slate-500 max-w-sm">Log production entries using your company's custom dynamic fields on the left.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                          <th className="py-3.5 px-4">Record Title</th>
                          <th className="py-3.5 px-4">Custom Dynamic Fields Data</th>
                          <th className="py-3.5 px-4 text-right">Logged At</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {entries.map((e: any) => (
                          <tr key={e.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-4 px-4 font-bold text-white text-sm">{e.recordTitle}</td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2 flex-wrap">
                                {Object.entries(e.fieldValues || {}).map(([key, val]: any, idx) => (
                                  <span key={idx} className="bg-slate-950 border border-slate-800 text-xs px-2.5 py-1 rounded-xl text-slate-300 font-medium">
                                    <strong className="text-amber-400">{key}:</strong> {String(val)}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="py-4 px-4 text-right text-slate-400 font-medium">
                              {new Date(e.createdAt).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
