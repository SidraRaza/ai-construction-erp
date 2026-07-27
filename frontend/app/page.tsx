import Link from "next/link";
import { Building2, ArrowRight, ShieldCheck, HardHat, Receipt, Bot } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between">
      {/* Navigation Bar */}
      <nav className="border-b border-slate-800/80 px-8 py-5 flex items-center justify-between backdrop-blur-md bg-slate-950/80 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/20">
            <Building2 className="w-6 h-6" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">AI Construction ERP</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/admin/dashboard"
            className="text-xs font-medium text-slate-300 hover:text-white px-3 py-2 rounded-xl transition-all"
          >
            Admin Portal
          </Link>
          <Link
            href="/engineer/dashboard"
            className="text-xs font-medium text-slate-300 hover:text-white px-3 py-2 rounded-xl transition-all"
          >
            Engineer Portal
          </Link>
          <Link
            href="/client/dashboard"
            className="text-xs font-semibold px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/20 hover:brightness-110 transition-all flex items-center gap-1.5"
          >
            Client Portal <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-20 text-center space-y-8 flex-1 flex flex-col justify-center items-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> Enterprise Multi-Tenant AI ERP Platform
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl">
          Replace WhatsApp Groups & Spreadsheets with <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 bg-clip-text text-transparent">AI Intelligence</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
          Manage projects, site labour, material inventory, expense tracking, and client billing in one connected SaaS system powered by Next.js and Prisma.
        </p>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 text-left w-full">
          <div className="p-6 bg-slate-900/60 rounded-3xl border border-slate-800 space-y-3 hover:border-amber-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <HardHat className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Mobile-First Site Command</h3>
            <p className="text-xs text-slate-400 leading-relaxed">QR attendance check-ins, daily site reports, and capped expense logging for engineers in the field.</p>
          </div>

          <div className="p-6 bg-slate-900/60 rounded-3xl border border-slate-800 space-y-3 hover:border-amber-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Receipt className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Immutable Financial Audit</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Versioned quotations and invoices with void-and-reissue audit trail ensuring full legal compliance.</p>
          </div>

          <div className="p-6 bg-slate-900/60 rounded-3xl border border-slate-800 space-y-3 hover:border-amber-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">AI-Drafted Intelligence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Instant daily progress reports, cost estimators, and draft quotations requiring human admin sign-off.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 px-8 py-6 text-center text-xs text-slate-500">
        AI Construction ERP v1.0 • Built to Enterprise Standards • Powered by Next.js & Prisma
      </footer>
    </div>
  );
}
