"use client";

import { useState } from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { Header } from "@/components/navigation/header";
import { Truck, Plus, AlertCircle, ShoppingCart, CheckCircle, Phone, Mail } from "lucide-react";

const initialSuppliers = [
  { id: "s1", name: "National Cement Corporation", contact: "+1 555-4433", email: "orders@nationalcement.com", category: "Cement & Aggregates", activeOrders: 2 },
  { id: "s2", name: "Mughal Steel Rebar Ltd", contact: "+1 555-8822", email: "sales@mughalsteel.com", category: "Structural Steel", activeOrders: 1 },
  { id: "s3", name: "Margalla Sand & Stone Quarries", contact: "+1 555-1199", email: "dispatch@margallaquarry.com", category: "Sand & Gravel", activeOrders: 3 },
  { id: "s4", name: "Popular PVC Pipe Industries", contact: "+1 555-6677", email: "info@popularpipes.com", category: "Plumbing & Electrical", activeOrders: 0 },
];

const autoPoSuggestions = [
  { material: "High Grade Portland Cement", currentStock: 15, reorderLevel: 20, suggestedQty: 60, unit: "bags", supplier: "National Cement Corporation" },
  { material: "Red Clay Bricks", currentStock: 5, reorderLevel: 10, suggestedQty: 25, unit: "thousand", supplier: "Standard Brick Kiln" },
];

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("General Materials");

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contact) return;

    const newSup = {
      id: `s_${Date.now()}`,
      name,
      contact,
      email: email || "N/A",
      category,
      activeOrders: 0,
    };

    setSuppliers([...suppliers, newSup]);
    setName("");
    setContact("");
    setEmail("");
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
                <Truck className="w-7 h-7 text-amber-400" /> Supplier Procurement & Purchase Orders
              </h2>
              <p className="text-sm text-slate-400 mt-1">Vendor contacts, purchase order tracking, and automated stock reorder suggestions.</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold text-xs shadow-lg shadow-orange-500/25 hover:brightness-110 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Vendor / Supplier
            </button>
          </div>

          {/* Automated Reorder Suggestions Section */}
          <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-amber-400" /> AI Auto Purchase Order Suggestions
              </h3>
              <span className="text-xs text-amber-400 font-semibold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                Triggered by Stock Thresholds
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {autoPoSuggestions.map((po, i) => (
                <div key={i} className="p-4 bg-slate-950/80 rounded-2xl border border-amber-500/30 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold text-white">{po.material}</h4>
                      <p className="text-xs text-slate-400">Vendor: {po.supplier}</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                      Reorder +{po.suggestedQty} {po.unit}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2">
                    <span>Current: <strong className="text-rose-400">{po.currentStock} {po.unit}</strong></span>
                    <span>Reorder Point: <strong className="text-slate-200">{po.reorderLevel} {po.unit}</strong></span>
                  </div>
                  <button className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl text-xs font-bold hover:brightness-110 transition-all flex items-center justify-center gap-1.5">
                    <CheckCircle className="w-4 h-4" /> Issue Draft Purchase Order
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Supplier Directory Table */}
          <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl backdrop-blur-md">
            <h3 className="text-base font-bold text-white">Vendor Directory</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase">
                    <th className="py-3 px-4">Supplier Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Phone Contact</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4 text-center">Active Orders</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {suppliers.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-100">{s.name}</td>
                      <td className="py-3.5 px-4 text-amber-400 font-medium">{s.category}</td>
                      <td className="py-3.5 px-4 text-slate-300 font-mono flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-500" /> {s.contact}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono">{s.email}</td>
                      <td className="py-3.5 px-4 text-center font-bold text-slate-200">{s.activeOrders}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button className="px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl hover:border-amber-500 transition-all text-xs">
                          Create Order
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* New Supplier Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
                <h3 className="text-lg font-bold text-white">Add New Supplier / Vendor</h3>
                <form onSubmit={handleCreateSupplier} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Company / Vendor Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. National Cement Corporation"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Phone Contact</label>
                    <input
                      type="text"
                      required
                      placeholder="+1 555-0000"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Category</label>
                    <input
                      type="text"
                      placeholder="e.g. Cement & Concrete"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
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
                      Save Vendor
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
