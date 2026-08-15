"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserAuthModal } from "@/components/auth/user-auth-modal";
import { useToast } from "@/components/ui/toast-provider";
import { getValidSession } from "@/lib/session";
import {
  ArrowLeft,
  ShieldCheck,
  HardHat,
  SlidersHorizontal,
  Crown,
  Users,
  CheckCircle2,
  Sparkles,
  Award,
  Zap,
  ArrowRight,
  MessageSquareHeart,
  HelpCircle,
  BookOpen,
  ChevronDown,
  Menu,
  X,
  LayoutDashboard,
} from "lucide-react";


export default function AboutPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPortalsDropdownOpen, setIsPortalsDropdownOpen] = useState(false);

  const handlePortalNavigation = (targetPath: string) => {
    const session = getValidSession();
    if (session || targetPath === "/admin/super-admin") {
      router.push(targetPath);
    } else {
      showToast("Please log in or create an account first to enter private portals!", "warning");
      setIsAuthModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between overflow-x-hidden">
      {/* Clean & Responsive Navigation Header */}
      <nav className="border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between backdrop-blur-md bg-slate-950/90 sticky top-0 z-50">
        {/* Brand Logo & Title */}
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/logo-128px.png" alt="AI Construction ERP Logo" className="w-8 h-8 sm:w-9 sm:h-9 object-contain shrink-0" />
          <span className="text-base sm:text-lg font-bold text-white tracking-tight truncate">AI Construction ERP</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-xs font-semibold text-slate-300 hover:text-white transition-colors">
            Home
          </Link>

          <Link href="/about" className="text-xs font-bold text-amber-400 border-b-2 border-amber-500 pb-0.5 transition-colors">
            About Us
          </Link>

          <Link href="/docs" className="text-xs font-semibold text-slate-300 hover:text-white transition-colors">
            Docs
          </Link>

          <Link href="/help" className="text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" /> Help Center
          </Link>


          {/* Portals Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsPortalsDropdownOpen(!isPortalsDropdownOpen)}
              className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 py-1.5 transition-colors"
            >
              Enterprise Portals <ChevronDown className={`w-3.5 h-3.5 text-amber-400 transition-transform ${isPortalsDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {isPortalsDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 backdrop-blur-xl animate-in fade-in duration-150 space-y-1">
                <button
                  onClick={() => {
                    setIsPortalsDropdownOpen(false);
                    handlePortalNavigation("/admin/dashboard");
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors flex items-center gap-2.5 text-xs text-slate-200 font-medium"
                >
                  <LayoutDashboard className="w-4 h-4 text-amber-400" /> Admin Portal
                </button>
                <button
                  onClick={() => {
                    setIsPortalsDropdownOpen(false);
                    handlePortalNavigation("/engineer/dashboard");
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors flex items-center gap-2.5 text-xs text-slate-200 font-medium"
                >
                  <HardHat className="w-4 h-4 text-emerald-400" /> Engineer Portal
                </button>
                <button
                  onClick={() => {
                    setIsPortalsDropdownOpen(false);
                    handlePortalNavigation("/admin/custom-fields");
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors flex items-center gap-2.5 text-xs text-slate-200 font-medium"
                >
                  <SlidersHorizontal className="w-4 h-4 text-amber-400" /> Custom Fields Engine
                </button>
                <button
                  onClick={() => {
                    setIsPortalsDropdownOpen(false);
                    handlePortalNavigation("/client/dashboard");
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors flex items-center gap-2.5 text-xs text-slate-200 font-medium"
                >
                  <Users className="w-4 h-4 text-cyan-400" /> Client Portal
                </button>
                <div className="my-1 border-t border-slate-800" />
                <button
                  onClick={() => {
                    setIsPortalsDropdownOpen(false);
                    handlePortalNavigation("/admin/super-admin");
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-purple-500/10 transition-colors flex items-center gap-2.5 text-xs text-purple-400 font-bold"
                >
                  <Crown className="w-4 h-4" /> Super Admin Owner Portal
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/"
            className="text-xs font-bold text-slate-300 hover:text-white px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1.5 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-amber-400" /> Back to Home
          </Link>
        </div>

        {/* Mobile Screen Controls */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/"
            className="text-[11px] font-bold text-slate-300 bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-lg flex items-center gap-1"
          >
            <ArrowLeft className="w-3 h-3 text-amber-400" /> Home
          </Link>

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
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Navigation Menu</p>

            <Link
              href="/"
              onClick={() => setIsMobileNavOpen(false)}
              className="w-full p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 text-sm font-bold flex items-center justify-between"
            >
              <span>Home</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </Link>

            <Link
              href="/about"
              onClick={() => setIsMobileNavOpen(false)}
              className="w-full p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-bold flex items-center justify-between"
            >
              <span>About Us</span>
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
            </Link>

            <Link
              href="/docs"
              onClick={() => setIsMobileNavOpen(false)}
              className="w-full p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 text-sm font-bold flex items-center justify-between"
            >
              <span className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-amber-400" /> Documentation
              </span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </Link>

            <Link
              href="/help"
              onClick={() => setIsMobileNavOpen(false)}
              className="w-full p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 text-sm font-bold flex items-center justify-between"
            >
              <span className="flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4 text-amber-400" /> Help & Support
              </span>
              <ArrowRight className="w-4 h-4" />
            </Link>


            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider pt-2 mb-1">Enterprise Portals</p>

            <button
              onClick={() => {
                setIsMobileNavOpen(false);
                handlePortalNavigation("/admin/custom-fields");
              }}
              className="w-full p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-bold flex items-center justify-between"
            >
              <span className="flex items-center gap-2.5">
                <SlidersHorizontal className="w-4 h-4" /> Custom Production Fields
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setIsMobileNavOpen(false);
                handlePortalNavigation("/admin/super-admin");
              }}
              className="w-full p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-bold flex items-center justify-between"
            >
              <span className="flex items-center gap-2.5">
                <Crown className="w-4 h-4" /> Super Admin Owner Portal
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setIsMobileNavOpen(false);
                handlePortalNavigation("/admin/dashboard");
              }}
              className="w-full p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 text-sm font-bold flex items-center justify-between"
            >
              <span className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4 text-slate-400" /> Enterprise Admin Portal
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setIsMobileNavOpen(false);
                handlePortalNavigation("/engineer/dashboard");
              }}
              className="w-full p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 text-sm font-bold flex items-center justify-between"
            >
              <span className="flex items-center gap-2.5">
                <HardHat className="w-4 h-4 text-slate-400" /> Site Engineer Command
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setIsMobileNavOpen(false);
                handlePortalNavigation("/client/dashboard");
              }}
              className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-bold flex items-center justify-between shadow-lg shadow-orange-500/20"
            >
              <span className="flex items-center gap-2.5">
                <Users className="w-4 h-4" /> Client Project Portal
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-400 font-medium">
            Created & Designed by <strong className="text-amber-400">Sidra Raza</strong> • AI Construction ERP
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-slate-900/60 border-b border-slate-800 py-12 sm:py-20 px-4 sm:px-6 relative overflow-hidden">
        {/* Background Decorative Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Award className="w-4 h-4 text-orange-400" /> Executive Leadership & Architectural Vision
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Reimagining Construction Site Operations with <span className="text-amber-400">AI Intelligence</span>
          </h2>
          <p className="text-xs sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Architected and founded by <strong className="text-amber-400 font-bold">Sidra Raza</strong>, AI Construction ERP is built to eliminate WhatsApp group chaos, unverified site logs, and fragmented spreadsheets.
          </p>
        </div>
      </div>

      {/* Main Content Body */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12 sm:space-y-16 w-full flex-1">
        {/* Leadership Profile Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl p-6 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />

          <div className="md:col-span-4 flex flex-col items-center text-center space-y-3">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 p-1 shadow-2xl shadow-orange-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-2xl sm:text-3xl font-extrabold text-amber-400">
                SR
              </div>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white">Sidra Raza</h3>
              <p className="text-xs text-amber-400 font-mono font-bold">Founder & Lead Architect</p>
            </div>
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider">
              AI Construction ERP Author
            </span>
          </div>

          <div className="md:col-span-8 space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" /> The Architect's Message
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              "Traditional construction management relies heavily on disconnected messaging channels, paper attendance registers, and manual expense receipts. AI Construction ERP was engineered to bring complete digital clarity, real-time multi-tenant data isolation, capped expense controls, and self-configurable custom fields into a single unified platform."
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs text-slate-400 font-medium flex-wrap">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Multi-Tenant Isolation</span>
              <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-400" /> Real-time Analytics</span>
            </div>
          </div>
        </div>

        {/* Core Pillars Grid */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">Core Platform Pillars</h3>
            <p className="text-xs text-slate-400">Key architectural guarantees built into every tenant instance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {/* Pillar 1 */}
            <div className="p-6 bg-slate-900/60 rounded-3xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Dynamic Production Fields</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Self-configurable custom schema definitions allowing companies to define text, select, date, and checkbox fields without code changes.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 bg-slate-900/60 rounded-3xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <HardHat className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Mobile Site Command</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Mobile-first QR worker attendance check-ins, daily site report logging, capped expense submission, and instant site engineer sync.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 bg-slate-900/60 rounded-3xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Crown className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Super Admin Governance</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Owner portal protected by security gatekeeper for platform governance, user registration ledgers, and user feedback monitoring.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 p-6 sm:p-10 rounded-3xl border border-amber-500/30 text-center space-y-4 shadow-2xl">
          <h4 className="text-xl sm:text-2xl font-extrabold text-white">Have Feedback or Questions for Sidra Raza?</h4>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Send your suggestions, feature requests, or notes directly to the founder via our website feedback form.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
            <Link
              href="/#feedback-section"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold shadow-lg hover:brightness-110 flex items-center gap-2 transition-all"
            >
              <MessageSquareHeart className="w-4 h-4" /> Send Note to Sidra Raza
            </Link>

            <Link
              href="/help"
              className="px-5 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold hover:text-white flex items-center gap-2 transition-all"
            >
              Visit Help Center <ArrowRight className="w-4 h-4 text-amber-400" />
            </Link>
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
      <footer className="border-t border-slate-800/80 px-6 py-5 bg-slate-950 text-xs text-slate-400 font-medium">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            Created & Built by <strong className="text-amber-400">Sidra Raza</strong> (Platform Founder & Lead Architect) • AI Construction ERP v1.0
          </div>
          <div className="flex items-center gap-4">
            <Link href="/about" className="text-amber-400 font-bold hover:underline">
              About Us
            </Link>
            <span className="text-slate-700">•</span>
            <Link href="/help" className="text-slate-300 hover:text-amber-400 font-bold transition-colors">
              Help Center
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
