"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { Header } from "@/components/navigation/header";
import { useToast } from "@/components/ui/toast-provider";
import { Users, DollarSign, Calendar, Calculator, CheckCircle2, Clock, UserPlus, RefreshCw, Mail, Phone, ShieldCheck } from "lucide-react";

export default function EmployeesPage() {
  const { showToast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State for Registering New Staff / User
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("CLIENT"); // CLIENT | ENGINEER | LABOUR | ADMIN

  // Payroll Calculation Modal
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [monthlySalary, setMonthlySalary] = useState("100000");
  const [presentDays, setPresentDays] = useState(26);
  const [lateDays, setLateDays] = useState(2);
  const [calculatedPayroll, setCalculatedPayroll] = useState<{
    baseSalary: number;
    dailyRate: number;
    deductions: number;
    netSalary: number;
  } | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/users");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setUsers(json.data);
      }
    } catch (err) {
      showToast("Failed to fetch registered users from database", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRegisterUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      showToast("Name and Email are required!", "warning");
      return;
    }

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, role }),
      });

      const json = await res.json();
      if (json.success) {
        showToast(`User "${name}" registered in Database!`, "success");
        setName("");
        setEmail("");
        setPhone("");
        setRole("CLIENT");
        setIsAddUserModalOpen(false);
        fetchUsers();
      } else {
        showToast(`Error: ${json.error?.message}`, "error");
      }
    } catch (err) {
      showToast("Failed to register user", "error");
    }
  };

  const handleCalculatePayroll = (u: any) => {
    setSelectedUser(u);
    const sal = Number(monthlySalary) || 100000;
    const dailyRate = Math.round(sal / 30);
    const absentDays = 30 - presentDays;
    const deductions = Math.round(absentDays * dailyRate + lateDays * (dailyRate * 0.25));
    const netSalary = Math.max(0, sal - deductions);

    setCalculatedPayroll({
      baseSalary: sal,
      dailyRate,
      deductions,
      netSalary,
    });
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar role="ADMIN" />

      <div className="flex-1 flex flex-col min-w-0">
        <Header userName="Sarah Admin" userRole="Company Admin" />

        <main className="p-8 space-y-6 flex-1 overflow-y-auto">
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 p-6 rounded-3xl border border-amber-500/20 shadow-2xl backdrop-blur-xl">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-3">
                <Users className="w-8 h-8 text-amber-400 p-1.5 bg-amber-500/10 rounded-2xl border border-amber-500/20 shadow-inner" />
                Registered Users & Staff Directory
              </h2>
              <p className="text-xs text-slate-400 font-medium">Real-time database directory of all visitors, clients, engineers, and workers.</p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={fetchUsers}
                title="Refresh Directory"
                className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/40 hover:bg-slate-800 transition-all duration-200 shadow-md active:scale-95"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-amber-400" : ""}`} />
              </button>

              <button
                onClick={() => setIsAddUserModalOpen(true)}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-bold text-xs tracking-wide shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 hover:brightness-110 active:scale-95 transition-all duration-200 flex items-center gap-2 border border-amber-400/30"
              >
                <UserPlus className="w-4 h-4 stroke-[2.5]" /> + Onboard New User / Staff
              </button>
            </div>
          </div>

          {/* Users & Staff Directory Table */}
          <div className="bg-slate-900/60 rounded-3xl border border-slate-800/80 p-6 space-y-4 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" /> Prisma DB Registered Users
              </h3>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                Total Registered: {users.length}
              </span>
            </div>

            {users.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center text-center space-y-4 border-2 border-dashed border-slate-800/80 rounded-3xl bg-slate-950/40">
                <div className="p-4 bg-amber-500/10 rounded-full border border-amber-500/20">
                  <Users className="w-10 h-10 text-amber-400" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-slate-200">No Registered Users in Database Yet</h4>
                  <p className="text-xs text-slate-500 max-w-sm">Click "+ Onboard New User / Staff" above or register basic details from the header onboarding button.</p>
                </div>
                <button
                  onClick={() => setIsAddUserModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-400 font-bold text-xs border border-amber-500/30 hover:bg-amber-500/30 transition-all"
                >
                  + Register First User Profile
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="py-3.5 px-4">User ID</th>
                      <th className="py-3.5 px-4">Full Name</th>
                      <th className="py-3.5 px-4">Email</th>
                      <th className="py-3.5 px-4">Role</th>
                      <th className="py-3.5 px-4">Contact Phone</th>
                      <th className="py-3.5 px-4">Registered Date</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-4 text-right">Payroll & Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-4 px-4 font-bold font-mono text-amber-400">{u.id}</td>
                        <td className="py-4 px-4 font-bold text-white text-sm">{u.name}</td>
                        <td className="py-4 px-4 text-slate-300 font-medium flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-500" /> {u.email}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-extrabold border ${
                              u.role === "ADMIN" || u.role === "SUPER_ADMIN"
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                : u.role === "ENGINEER"
                                ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                : u.role === "LABOUR"
                                ? "bg-teal-500/10 text-teal-400 border-teal-500/20"
                                : "bg-purple-500/10 text-purple-400 border-purple-500/20"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-300 font-mono">
                          {u.phone ? (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-500" /> {u.phone}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="py-4 px-4 text-slate-400 font-medium">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-extrabold px-3 py-1 rounded-full">
                            {u.status || "ACTIVE"}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => handleCalculatePayroll(u)}
                            className="px-3.5 py-1.5 bg-slate-800/90 text-amber-400 rounded-xl font-bold hover:bg-amber-500/20 hover:border-amber-500/40 transition-all border border-slate-700/80 inline-flex items-center gap-1.5 shadow-sm active:scale-95"
                          >
                            <Calculator className="w-3.5 h-3.5 text-amber-400" /> Compute Payroll
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Onboard / Register New User Modal */}
          {isAddUserModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-5 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-amber-400" /> Onboard New User / Staff
                  </h3>
                  <button onClick={() => setIsAddUserModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                </div>
                <form onSubmit={handleRegisterUser} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tariq Mahmood"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. tariq@buildcorp.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Contact Phone Number</label>
                    <input
                      type="text"
                      placeholder="e.g. +92 300 1234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">User Role *</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
                    >
                      <option value="CLIENT">CLIENT (External Project Owner / Client)</option>
                      <option value="ENGINEER">ENGINEER (Site Civil Engineer)</option>
                      <option value="LABOUR">LABOUR (Skilled Workforce / Mason / Fixer)</option>
                      <option value="ADMIN">ADMIN (Company Operations Administrator)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsAddUserModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-xs font-bold text-white shadow-lg hover:brightness-110"
                    >
                      Register User in Database
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Payroll Slip Modal */}
          {selectedUser && calculatedPayroll && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
                <h3 className="text-lg font-bold text-white">Payroll Computation: {selectedUser.name}</h3>
                <p className="text-xs text-slate-400">Email: {selectedUser.email} ({selectedUser.role})</p>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Monthly Base Salary ($)</label>
                    <input
                      type="number"
                      value={monthlySalary}
                      onChange={(e) => {
                        setMonthlySalary(e.target.value);
                        handleCalculatePayroll(selectedUser);
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
                    />
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-400"><span>Daily Rate (30 days):</span> <strong className="text-slate-200">${calculatedPayroll.dailyRate.toLocaleString()} / day</strong></div>
                    <div className="flex justify-between text-slate-400"><span>Present Days:</span> <strong className="text-emerald-400">{presentDays} / 30 Days</strong></div>
                    <div className="flex justify-between text-slate-400"><span>Late Days:</span> <strong className="text-amber-400">{lateDays} Days</strong></div>
                    <div className="flex justify-between text-slate-400 border-t border-slate-800 pt-2"><span>Deductions:</span> <strong className="text-rose-400">-${calculatedPayroll.deductions.toLocaleString()}</strong></div>
                    <div className="flex justify-between text-base font-bold text-amber-400 border-t border-slate-800 pt-2"><span>Net Payable Salary:</span> <span>${calculatedPayroll.netSalary.toLocaleString()}</span></div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      showToast(`Payroll calculated for ${selectedUser.name}: $${calculatedPayroll.netSalary.toLocaleString()}`, "success");
                      setSelectedUser(null);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-xs font-bold text-white shadow-lg hover:brightness-110 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Confirm Payroll Slip
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
