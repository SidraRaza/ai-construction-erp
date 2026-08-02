"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { UserAuthModal } from "@/components/auth/user-auth-modal";
import { useToast } from "@/components/ui/toast-provider";
import {
  Building2,
  ArrowRight,
  ShieldCheck,
  HardHat,
  Receipt,
  Bot,
  SlidersHorizontal,
  Crown,
  Menu,
  X,
  LayoutDashboard,
  Users,
  KeyRound,
  UserPlus,
  Lock,
} from "lucide-react";

function HomeContent() {
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const authParam = searchParams.get("auth");
    if (authParam === "required" || authParam === "login") {
      setIsAuthModalOpen(true);
      if (authParam === "required") {
        showToast("Please log in or create an account to access private portals!", "warning");
      }
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between overflow-x-hidden">
      {/* Navigation Bar (100% Responsive) */}
      <nav className="border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between backdrop-blur-md bg-slate-950/90 sticky top-0 z-50">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/20 shrink-0">
            <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <span className="text-base sm:text-lg font-bold text-white tracking-tight truncate">AI Construction ERP</span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3">
          {/* Register / Login Main CTA Button */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="text-xs font-extrabold px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-orange-500/20 hover:brightness-110 transition-all flex items-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" /> Register / Login
          </button>

          <div className="h-5 w-px bg-slate-800" />

          <Link
            href="/admin/custom-fields"
            className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 px-3 py-2 rounded-xl transition-all flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" /> Custom Fields
          </Link>

          <Link
            href="/admin/super-admin"
            className="text-xs font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 px-3 py-2 rounded-xl transition-all flex items-center gap-1.5"
          >
            <Crown className="w-3.5 h-3.5" /> Owner Portal
          </Link>

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
            className="text-xs font-semibold px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white transition-all flex items-center gap-1.5"
          >
            Client Portal <ArrowRight className="w-4 h-4 text-amber-400" />
          </Link>
        </div>

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="text-[11px] font-bold px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-sm flex items-center gap-1"
          >
            <UserPlus className="w-3 h-3" /> Account
          </button>

          <button
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 hover:text-white transition-all"
            aria-label="Toggle Mobile Navigation"
          >
            {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {isMobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-slate-950/95 backdrop-blur-xl p-6 pt-20 flex flex-col justify-between animate-in fade-in duration-200">
          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Portal Navigation</p>

            <button
              onClick={() => {
                setIsMobileNavOpen(false);
                setIsAuthModalOpen(true);
              }}
              className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-bold flex items-center justify-between shadow-lg shadow-orange-500/20"
            >
              <span className="flex items-center gap-2.5">
                <UserPlus className="w-4 h-4" /> Create Account / Login
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              href="/admin/custom-fields"
              onClick={() => setIsMobileNavOpen(false)}
              className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-bold flex items-center justify-between"
            >
              <span className="flex items-center gap-2.5">
                <SlidersHorizontal className="w-4 h-4" /> Custom Production Fields
              </span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/admin/super-admin"
              onClick={() => setIsMobileNavOpen(false)}
              className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-bold flex items-center justify-between"
            >
              <span className="flex items-center gap-2.5">
                <Crown className="w-4 h-4" /> Super Admin Owner Portal
              </span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/admin/dashboard"
              onClick={() => setIsMobileNavOpen(false)}
              className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 text-sm font-bold flex items-center justify-between"
            >
              <span className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4 text-slate-400" /> Enterprise Admin Portal
              </span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/engineer/dashboard"
              onClick={() => setIsMobileNavOpen(false)}
              className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 text-sm font-bold flex items-center justify-between"
            >
              <span className="flex items-center gap-2.5">
                <HardHat className="w-4 h-4 text-slate-400" /> Site Engineer Command
              </span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/client/dashboard"
              onClick={() => setIsMobileNavOpen(false)}
              className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 text-sm font-bold flex items-center justify-between"
            >
              <span className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-slate-400" /> Client Project Portal
              </span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-400 font-medium">
            Created & Designed by <strong className="text-amber-400">Sidra Raza</strong> • AI Construction ERP
          </div>
        </div>
      )}

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center space-y-6 sm:space-y-8 flex-1 flex flex-col justify-center items-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> Enterprise Multi-Tenant SaaS Platform by Sidra Raza
        </div>

        <h1 className="text-3xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl">
          Replace WhatsApp Groups & Spreadsheets with <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 bg-clip-text text-transparent">AI Intelligence</span>
        </h1>

        <p className="text-sm sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
          Manage projects, site labour, material inventory, expense tracking, client billing, and self-configurable custom production fields in one connected SaaS system powered by Next.js and Prisma.
        </p>

        {/* Hero CTA Button Group */}
        <div className="flex items-center gap-4 pt-2 flex-wrap justify-center">
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-orange-500/25 hover:brightness-110 flex items-center gap-2 transition-all"
          >
            <UserPlus className="w-4 h-4" /> Create Account / Register Company <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-6 py-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 font-bold text-xs sm:text-sm hover:bg-slate-800 transition-all flex items-center gap-2"
          >
            <KeyRound className="w-4 h-4 text-amber-400" /> Login to Dashboard
          </button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-8 sm:pt-12 text-left w-full">
          <div className="p-5 sm:p-6 bg-slate-900/60 rounded-3xl border border-slate-800 space-y-3 hover:border-amber-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <HardHat className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Mobile-First Site Command</h3>
            <p className="text-xs text-slate-400 leading-relaxed">QR attendance check-ins, daily site reports, and capped expense logging for engineers in the field.</p>
          </div>

          <div className="p-5 sm:p-6 bg-slate-900/60 rounded-3xl border border-slate-800 space-y-3 hover:border-amber-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Receipt className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Immutable Financial Audit</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Versioned quotations and invoices with void-and-reissue audit trail ensuring full legal compliance.</p>
          </div>

          <div className="p-5 sm:p-6 bg-slate-900/60 rounded-3xl border border-slate-800 space-y-3 hover:border-amber-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">AI-Drafted Intelligence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Instant daily progress reports, cost estimators, and draft quotations requiring human admin sign-off.</p>
          </div>
        </div>
      </main>

      {/* Register / Login Gatekeeper Modal */}
      <UserAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          showToast("Authenticated! You can now access all portal features.", "success");
        }}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 px-6 py-5 text-center text-xs text-slate-400 font-medium">
        Created & Built by <strong className="text-amber-400">Sidra Raza</strong> (Platform Founder & Lead Architect) • AI Construction ERP v1.0
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">Loading AI Construction ERP...</div>}>
      <HomeContent />
    </Suspense>
  );
}
