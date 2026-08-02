"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  ArrowLeft,
  Search,
  HelpCircle,
  ShieldCheck,
  HardHat,
  SlidersHorizontal,
  Crown,
  Users,
  Bot,
  CheckCircle2,
  Mail,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BookOpen,
} from "lucide-react";

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "How do I access the Super Admin Owner Portal?",
      a: "Click on 'Owner Portal' from the home page navigation bar or visit /admin/super-admin. Enter owner name 'Sidra' and the 5-digit owner password '87626'. Session automatically expires after 1 hour.",
    },
    {
      q: "How do Custom Production Fields work?",
      a: "Admins can navigate to /admin/custom-fields to create dynamic input fields (Text, Number, Select Dropdown, Date, Checkbox) isolated to their company. Production logs can then be saved using these fields.",
    },
    {
      q: "How do Site Engineers log daily QR attendance and site expenses?",
      a: "Site Engineers log into /engineer/dashboard where they can perform 1-click QR attendance check-ins, submit capped site expenses, and upload daily progress logs.",
    },
    {
      q: "Can clients view project progress and download invoices?",
      a: "Yes! Clients log into /client/dashboard to track real-time project progress bars, audit verified invoices, and download PDF cost breakdown reports.",
    },
    {
      q: "How is company multi-tenant data kept private?",
      a: "All tenant records are strictly isolated by unique company IDs (x-company-id). Data cannot leak across different construction companies.",
    },
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between overflow-x-hidden">
      {/* Navigation Header */}
      <header className="border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between backdrop-blur-md bg-slate-950/90 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link href="/">
            <img src="/logo-128px.png" alt="AI Construction ERP Logo" className="w-8 h-8 sm:w-9 sm:h-9 object-contain shrink-0" />
          </Link>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              AI Construction ERP <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 uppercase">Help Center</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">Platform Documentation & Support</p>
          </div>
        </div>

        <Link
          href="/"
          className="text-xs font-bold text-slate-300 hover:text-white px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1.5 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-amber-400" /> Back to Home
        </Link>
      </header>

      {/* Hero Search Section */}
      <div className="bg-slate-900/60 border-b border-slate-800 py-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-3xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4 text-orange-400" /> Help & Support Documentation
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            How can we help you today?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Search our user guides, portal walkthroughs, and FAQs architected by <strong className="text-amber-400">Sidra Raza</strong>.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto pt-2">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search help guides, custom fields, QR attendance..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-16 space-y-16 w-full flex-1">
        {/* Help Topic Cards */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" /> Portal Guides & Documentation
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-6 bg-slate-900/80 rounded-3xl border border-slate-800 space-y-3 hover:border-amber-500/40 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Custom Fields Engine</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Self-configurable production field definitions for concrete logs, site surveys, and specialized labor records.
              </p>
              <Link href="/admin/custom-fields" className="text-xs font-bold text-amber-400 flex items-center gap-1 pt-1">
                Open Custom Fields <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
              </Link>
            </div>

            {/* Card 2 */}
            <div className="p-6 bg-slate-900/80 rounded-3xl border border-slate-800 space-y-3 hover:border-emerald-500/40 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <HardHat className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Site Engineer Command</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Mobile-first QR worker attendance check-in system, daily site report logging, and capped expense management.
              </p>
              <Link href="/engineer/dashboard" className="text-xs font-bold text-emerald-400 flex items-center gap-1 pt-1">
                Open Engineer Dashboard <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
              </Link>
            </div>

            {/* Card 3 */}
            <div className="p-6 bg-slate-900/80 rounded-3xl border border-purple-500/30 space-y-3 hover:border-purple-500 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                <Crown className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Super Admin Owner Portal</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Protected gatekeeper workspace for platform owner Sidra Raza to view real-time user registrations and user feedback.
              </p>
              <Link href="/admin/super-admin" className="text-xs font-bold text-purple-400 flex items-center gap-1 pt-1">
                Open Owner Portal <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
              </Link>
            </div>
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-extrabold text-white">Frequently Asked Questions</h3>
            <p className="text-xs text-slate-400">Quick answers to common questions about platform features.</p>
          </div>

          <div className="space-y-3">
            {filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-white hover:text-amber-400 transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" /> {faq.q}
                  </span>
                  {openFaqIndex === index ? <ChevronUp className="w-4 h-4 text-amber-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>

                {openFaqIndex === index && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 bg-slate-950/40">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Direct Contact Founder Box */}
        <div className="bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 p-8 rounded-3xl border border-amber-500/30 text-center space-y-3 max-w-2xl mx-auto shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
            <Mail className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-bold text-white">Need Additional Assistance?</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Have custom requirements or need technical support? Contact Platform Architect <strong className="text-amber-400">Sidra Raza</strong> directly via the website feedback form.
          </p>
          <Link
            href="/#feedback-section"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold shadow-md hover:brightness-110 transition-all"
          >
            Submit Feedback Note <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
          </Link>
        </div>
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-800/80 px-6 py-5 text-center text-xs text-slate-400 font-medium bg-slate-950">
        Created & Built by <strong className="text-amber-400">Sidra Raza</strong> (Platform Founder & Lead Architect) • AI Construction ERP v1.0
      </footer>
    </div>
  );
}
