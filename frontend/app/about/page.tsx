"use client";

import Link from "next/link";
import {
  Building2,
  ArrowLeft,
  ShieldCheck,
  HardHat,
  SlidersHorizontal,
  Crown,
  Users,
  Bot,
  CheckCircle2,
  Sparkles,
  Award,
  Layers,
  Zap,
  Target,
  ArrowRight,
  MessageSquareHeart,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between overflow-x-hidden">
      {/* Navigation Header */}
      <header className="border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between backdrop-blur-md bg-slate-950/90 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link href="/" className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-lg shadow-orange-500/20 border border-amber-500/40 shrink-0">
            <img src="/logo.jpg" alt="AI Construction ERP Logo" className="w-full h-full object-cover" />
          </Link>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              AI Construction ERP <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 uppercase">About Us</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">Platform Vision & Leadership</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/help"
            className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-xl transition-all hidden sm:block"
          >
            Help Center
          </Link>

          <Link
            href="/"
            className="text-xs font-bold text-slate-300 hover:text-white px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1.5 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-amber-400" /> Back to Home
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-slate-900/60 border-b border-slate-800 py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
        {/* Background Decorative Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Award className="w-4 h-4 text-orange-400" /> Executive Leadership & Architectural Vision
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Reimagining Construction Site Operations with <span className="text-amber-400">AI Intelligence</span>
          </h2>
          <p className="text-xs sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Architected and founded by <strong className="text-amber-400 font-bold">Sidra Raza</strong>, AI Construction ERP is built to eliminate WhatsApp group chaos, unverified site logs, and fragmented spreadsheets.
          </p>
        </div>
      </div>

      {/* Main Content Body */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-16 space-y-16 w-full flex-1">
        {/* Leadership Profile Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />

          <div className="md:col-span-4 flex flex-col items-center text-center space-y-3">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 p-1 shadow-2xl shadow-orange-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-3xl font-extrabold text-amber-400">
                SR
              </div>
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white">Sidra Raza</h3>
              <p className="text-xs text-amber-400 font-mono font-bold">Founder & Lead Architect</p>
            </div>
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider">
              AI Construction ERP Author
            </span>
          </div>

          <div className="md:col-span-8 space-y-4">
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" /> The Architect's Message
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              "Traditional construction management relies heavily on disconnected messaging channels, paper attendance registers, and manual expense receipts. AI Construction ERP was engineered to bring complete digital clarity, real-time multi-tenant data isolation, capped expense controls, and self-configurable custom fields into a single unified platform."
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Multi-Tenant Isolation</span>
              <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-400" /> Real-time Analytics</span>
            </div>
          </div>
        </div>

        {/* Core Pillars Grid */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-extrabold text-white">Core Platform Pillars</h3>
            <p className="text-xs text-slate-400">Key architectural guarantees built into every tenant instance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        <div className="bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 p-8 sm:p-10 rounded-3xl border border-amber-500/30 text-center space-y-4 shadow-2xl">
          <h4 className="text-2xl font-extrabold text-white">Have Feedback or Questions for Sidra Raza?</h4>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Send your suggestions, feature requests, or notes directly to the founder via our website feedback form.
          </p>
          <div className="pt-2 flex items-center justify-center gap-4 flex-wrap">
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
