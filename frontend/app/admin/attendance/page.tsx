"use client";

import { useState } from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { Header } from "@/components/navigation/header";
import { UserCheck, QrCode, CheckCircle2, XCircle, Clock, AlertCircle, Users, Check } from "lucide-react";

const initialLabourList = [
  { id: "l1", name: "John Labour", role: "Mason Lead", site: "Skyline Towers Phase 1", status: "PRESENT", method: "QR" },
  { id: "l2", name: "Tariq Mahmood", role: "Steel Fixer", site: "Skyline Towers Phase 1", status: "PRESENT", method: "QR" },
  { id: "l3", name: "Rashid Ali", role: "Concrete Pourer", site: "Skyline Towers Phase 1", status: "LATE", method: "MANUAL" },
  { id: "l4", name: "Kamran Khan", role: "Carpenter", site: "Skyline Towers Phase 1", status: "ABSENT", method: "MANUAL" },
  { id: "l5", name: "Muhammad Usman", role: "Electrician", site: "Skyline Towers Phase 1", status: "PRESENT", method: "QR" },
];

export default function AttendancePage() {
  const [labourList, setLabourList] = useState(initialLabourList);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrMessage, setQrMessage] = useState("");

  const handleToggleStatus = (id: string, newStatus: string) => {
    setLabourList(
      labourList.map((item) =>
        item.id === id ? { ...item, status: newStatus, method: "MANUAL" } : item
      )
    );
  };

  const handleSimulateQrScan = () => {
    setQrMessage("Scanning QR Code...");
    setTimeout(() => {
      setQrMessage("✅ Worker #l4 (Kamran Khan) verified via QR scan!");
      setLabourList(
        labourList.map((item) =>
          item.id === "l4" ? { ...item, status: "PRESENT", method: "QR" } : item
        )
      );
    }, 1500);
  };

  const presentCount = labourList.filter((l) => l.status === "PRESENT").length;
  const lateCount = labourList.filter((l) => l.status === "LATE").length;
  const absentCount = labourList.filter((l) => l.status === "ABSENT").length;

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
                <UserCheck className="w-7 h-7 text-amber-400" /> Labour Attendance Operations
              </h2>
              <p className="text-sm text-slate-400 mt-1">QR check-ins, bulk attendance entries, and daily site workforce tracking.</p>
            </div>
            <button
              onClick={() => setIsQrModalOpen(true)}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold text-xs shadow-lg shadow-orange-500/25 hover:brightness-110 transition-all flex items-center gap-2"
            >
              <QrCode className="w-4 h-4" /> Simulate QR Check-in
            </button>
          </div>

          {/* Daily Attendance Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 backdrop-blur-md">
              <span className="text-xs font-bold text-slate-400 uppercase">Total Workforce</span>
              <p className="text-2xl font-bold text-white mt-2">{labourList.length} Workers</p>
            </div>
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 backdrop-blur-md">
              <span className="text-xs font-bold text-emerald-400 uppercase">Present Today</span>
              <p className="text-2xl font-bold text-emerald-400 mt-2">{presentCount}</p>
            </div>
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 backdrop-blur-md">
              <span className="text-xs font-bold text-amber-400 uppercase">Late Entry</span>
              <p className="text-2xl font-bold text-amber-400 mt-2">{lateCount}</p>
            </div>
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 backdrop-blur-md">
              <span className="text-xs font-bold text-rose-400 uppercase">Absent</span>
              <p className="text-2xl font-bold text-rose-400 mt-2">{absentCount}</p>
            </div>
          </div>

          {/* Labour Attendance Table */}
          <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Daily Site Roster & Status</h3>
              <span className="text-xs text-slate-400">Date: {new Date().toLocaleDateString()}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase">
                    <th className="py-3 px-4">Worker Name</th>
                    <th className="py-3 px-4">Trade / Role</th>
                    <th className="py-3 px-4">Site Location</th>
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {labourList.map((worker) => (
                    <tr key={worker.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-100">{worker.name}</td>
                      <td className="py-3.5 px-4 text-slate-400">{worker.role}</td>
                      <td className="py-3.5 px-4 text-slate-300">{worker.site}</td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-amber-400">{worker.method}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                            worker.status === "PRESENT"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : worker.status === "LATE"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          }`}
                        >
                          {worker.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1">
                        <button
                          onClick={() => handleToggleStatus(worker.id, "PRESENT")}
                          className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg font-semibold hover:bg-emerald-500/30 transition-all"
                        >
                          Present
                        </button>
                        <button
                          onClick={() => handleToggleStatus(worker.id, "LATE")}
                          className="px-2.5 py-1 bg-amber-500/20 text-amber-400 rounded-lg font-semibold hover:bg-amber-500/30 transition-all"
                        >
                          Late
                        </button>
                        <button
                          onClick={() => handleToggleStatus(worker.id, "ABSENT")}
                          className="px-2.5 py-1 bg-rose-500/20 text-rose-400 rounded-lg font-semibold hover:bg-rose-500/30 transition-all"
                        >
                          Absent
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* QR Scanner Modal Simulation */}
          {isQrModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-sm text-center space-y-4 shadow-2xl">
                <h3 className="text-lg font-bold text-white">QR Code Site Check-in Scanner</h3>
                <div className="w-48 h-48 mx-auto bg-slate-950 rounded-2xl border-2 border-dashed border-amber-500/50 flex flex-col items-center justify-center p-4 space-y-2">
                  <QrCode className="w-16 h-16 text-amber-400 animate-pulse" />
                  <p className="text-[11px] text-slate-400">Position worker QR badge in frame</p>
                </div>
                {qrMessage && <p className="text-xs font-semibold text-emerald-400">{qrMessage}</p>}
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleSimulateQrScan}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-xs font-bold text-slate-950 shadow-lg hover:brightness-110"
                  >
                    Scan Badge
                  </button>
                  <button
                    onClick={() => {
                      setIsQrModalOpen(false);
                      setQrMessage("");
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
