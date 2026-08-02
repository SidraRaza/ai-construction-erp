"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { Header } from "@/components/navigation/header";
import { useToast } from "@/components/ui/toast-provider";
import { Package, AlertTriangle, Plus, RefreshCw } from "lucide-react";

export default function MaterialsPage() {
  const { showToast } = useToast();
  const [materials, setMaterials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("bags");
  const [stockQty, setStockQty] = useState("");
  const [reorderLevel, setReorderLevel] = useState("");

  const fetchMaterials = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/materials");
      const json = await res.json();
      if (json.success) {
        setMaterials(json.data || []);
      }
    } catch (err) {
      showToast("Failed to fetch materials from database", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleCreateMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !stockQty) return;

    try {
      const res = await fetch("/api/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          unit,
          stockQty: Number(stockQty),
          reorderLevel: Number(reorderLevel || 10),
        }),
      });

      const json = await res.json();
      if (json.success) {
        showToast(`Material "${name}" created in Database!`, "success");
        setName("");
        setStockQty("");
        setReorderLevel("");
        setIsModalOpen(false);
        fetchMaterials();
      } else {
        showToast(`Error: ${json.error?.message}`, "error");
      }
    } catch (err) {
      showToast("Failed to add material", "error");
    }
  };

  const lowStockItems = materials.filter(
    (m) => Number(m.stockQty) <= Number(m.reorderLevel)
  );

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar role="ADMIN" />

      <div className="flex-1 flex flex-col min-w-0">
        <Header userName="Sarah Admin" userRole="Company Admin" />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1 overflow-y-auto">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-amber-500/15 via-orange-500/5 to-slate-900 p-6 rounded-3xl border border-amber-500/25 shadow-xl">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                <Package className="w-7 h-7 text-amber-400" /> Material Inventory Control
              </h2>
              <p className="text-sm text-slate-400 mt-1">Live Prisma database stock levels and reorder alerts.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchMaterials}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold hover:border-amber-500"
              >
                <RefreshCw className={`w-4 h-4 text-amber-400 ${isLoading ? "animate-spin" : ""}`} />
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold text-xs shadow-lg shadow-orange-500/25 hover:brightness-110 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Material
              </button>
            </div>
          </div>

          {/* Low Stock Warning Banner if any item low */}
          {lowStockItems.length > 0 && (
            <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-2xl flex items-center gap-3 text-rose-300 text-xs">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              <div>
                <span className="font-bold">Attention Required:</span> {lowStockItems.length} material(s) have dropped below their reorder threshold ({lowStockItems.map((m) => m.name).join(", ")}).
              </div>
            </div>
          )}

          {/* Materials Table */}
          <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Prisma DB Inventory Levels</h3>
              <span className="text-xs text-slate-400">Total Material Types: {materials.length}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase">
                    <th className="py-3 px-4">Material Name</th>
                    <th className="py-3 px-4">Unit</th>
                    <th className="py-3 px-4">Stock Quantity</th>
                    <th className="py-3 px-4">Reorder Threshold</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {materials.map((m) => {
                    const isLow = Number(m.stockQty) <= Number(m.reorderLevel);
                    return (
                      <tr key={m.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-slate-100">{m.name}</td>
                        <td className="py-3.5 px-4 font-mono text-slate-300">{m.unit}</td>
                        <td className="py-3.5 px-4 font-bold text-white">{Number(m.stockQty).toLocaleString()}</td>
                        <td className="py-3.5 px-4 text-slate-400">{Number(m.reorderLevel).toLocaleString()}</td>
                        <td className="py-3.5 px-4 text-center">
                          {isLow ? (
                            <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                              LOW STOCK
                            </span>
                          ) : (
                            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                              IN STOCK
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Material Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
                <h3 className="text-lg font-bold text-white">Add New Material to Database</h3>

                <form onSubmit={handleCreateMaterial} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Material Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Portland Cement Bags"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-400 block mb-1">Unit</label>
                      <input
                        type="text"
                        required
                        placeholder="bags"
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-400 block mb-1">Stock Qty</label>
                      <input
                        type="number"
                        required
                        placeholder="100"
                        value={stockQty}
                        onChange={(e) => setStockQty(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-400 block mb-1">Reorder Point</label>
                      <input
                        type="number"
                        placeholder="20"
                        value={reorderLevel}
                        onChange={(e) => setReorderLevel(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
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
                      Save Material
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
