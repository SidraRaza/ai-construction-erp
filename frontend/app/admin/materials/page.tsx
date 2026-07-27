"use client";

import { useState } from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { Header } from "@/components/navigation/header";
import { Package, AlertTriangle, Plus, ArrowUpRight, ArrowDownRight, RefreshCw } from "lucide-react";

const initialMaterials = [
  { id: "m1", name: "High Grade Portland Cement", unit: "bags", stockQty: 15, reorderLevel: 20, supplier: "National Cement Ltd" },
  { id: "m2", name: "Deformed Steel Rebar 12mm", unit: "tons", stockQty: 45, reorderLevel: 10, supplier: "Mughal Steel Corp" },
  { id: "m3", name: "Crushed Aggregate Sand", unit: "tons", stockQty: 120, reorderLevel: 30, supplier: "Margalla Quarries" },
  { id: "m4", name: "Red Clay Bricks", unit: "thousand", stockQty: 5, reorderLevel: 10, supplier: "Standard Brick Kiln" },
  { id: "m5", name: "PVC Electrical Conduit Pipes", unit: "meters", stockQty: 300, reorderLevel: 50, supplier: "Popular Pipes Ltd" },
];

export default function MaterialsPage() {
  const [materials, setMaterials] = useState(initialMaterials);
  const [selectedMaterial, setSelectedMaterial] = useState<typeof initialMaterials[0] | null>(null);
  const [adjustmentQty, setAdjustmentQty] = useState("");
  const [reason, setReason] = useState("");

  const handleAdjustStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMaterial || !adjustmentQty) return;

    const qty = Number(adjustmentQty);
    setMaterials(
      materials.map((m) => {
        if (m.id === selectedMaterial.id) {
          const newQty = Math.max(0, m.stockQty + qty);
          return { ...m, stockQty: newQty };
        }
        return m;
      })
    );

    setSelectedMaterial(null);
    setAdjustmentQty("");
    setReason("");
  };

  const lowStockItems = materials.filter((m) => m.stockQty <= m.reorderLevel);

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
                <Package className="w-7 h-7 text-amber-400" /> Material Inventory Control
              </h2>
              <p className="text-sm text-slate-400 mt-1">Real-time stock quantities, supplier tracking, and automated low-stock alerts.</p>
            </div>
            <button className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold text-xs shadow-lg shadow-orange-500/25 hover:brightness-110 transition-all flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add New Material
            </button>
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
              <h3 className="text-base font-bold text-white">Current Stock Levels</h3>
              <span className="text-xs text-slate-400">Total Types: {materials.length}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase">
                    <th className="py-3 px-4">Material Name</th>
                    <th className="py-3 px-4">Supplier</th>
                    <th className="py-3 px-4">Unit</th>
                    <th className="py-3 px-4">Current Stock</th>
                    <th className="py-3 px-4">Reorder Threshold</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {materials.map((m) => {
                    const isLow = m.stockQty <= m.reorderLevel;
                    return (
                      <tr key={m.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-slate-100">{m.name}</td>
                        <td className="py-3.5 px-4 text-slate-400">{m.supplier}</td>
                        <td className="py-3.5 px-4 font-mono text-slate-300">{m.unit}</td>
                        <td className="py-3.5 px-4 font-bold text-white">{m.stockQty.toLocaleString()}</td>
                        <td className="py-3.5 px-4 text-slate-400">{m.reorderLevel.toLocaleString()}</td>
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
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setSelectedMaterial(m)}
                            className="px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold hover:border-amber-500 transition-all flex items-center gap-1.5 ml-auto"
                          >
                            <RefreshCw className="w-3.5 h-3.5 text-amber-400" /> Adjust Stock
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Adjust Stock Modal */}
          {selectedMaterial && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
                <h3 className="text-lg font-bold text-white">Adjust Stock: {selectedMaterial.name}</h3>
                <p className="text-xs text-slate-400">Current Quantity: {selectedMaterial.stockQty} {selectedMaterial.unit}</p>

                <form onSubmit={handleAdjustStock} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Adjustment Quantity (Positive to add, Negative to consume)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 50 or -20"
                      value={adjustmentQty}
                      onChange={(e) => setAdjustmentQty(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Reason / Notes</label>
                    <input
                      type="text"
                      placeholder="e.g. New supplier batch delivery"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setSelectedMaterial(null)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-xs font-semibold text-white shadow-lg hover:brightness-110"
                    >
                      Save Stock Adjustment
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
