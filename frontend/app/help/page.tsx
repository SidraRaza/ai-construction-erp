"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserAuthModal } from "@/components/auth/user-auth-modal";
import { useToast } from "@/components/ui/toast-provider";
import { getValidSession } from "@/lib/session";
import {
  ArrowLeft,
  Search,
  HelpCircle,
  ShieldCheck,
  HardHat,
  SlidersHorizontal,
  Crown,
  Users,
  CheckCircle2,
  Mail,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BookOpen,
  Menu,
  X,
  LayoutDashboard,
  ArrowRight,
} from "lucide-react";

export default function HelpPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
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

  const faqs = [
    {
      q: "How do I access the Super Admin Owner Portal?",
      a: "Click on 'Owner Portal' from the navigation bar or visit /admin/super-admin. Enter owner name 'Sidra' and the 5-digit owner password '87626'. Session automatically expires after 1 hour.",
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
      q: "How do Client Accounts track project progress and invoices?",
      a: "Clients can log into /client/dashboard to view verified milestone progress, download official PDFs, and run AI cost estimations.",
    },
    {
      q: "Is user feedback monitored by the founder?",
      a: "Yes! All feedback submitted via the home page form is stored in the database and displayed live in the Super Admin Owner Portal for Sidra Raza.",
    },
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

          <Link href="/about" className="text-xs font-semibold text-slate-300 hover:text-white transition-colors">
            About Us
          </Link>

          <Link href="/docs" className="text-xs font-semibold text-slate-300 hover:text-white transition-colors">
            Docs
          </Link>

          <Link href="/help" className="text-xs font-bold text-amber-400 border-b-2 border-amber-500 pb-0.5 transition-colors flex items-center gap-1.5">
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
              className="w-full p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 text-sm font-bold flex items-center justify-between"
            >
              <span>About Us</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
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
              className="w-full p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-bold flex items-center justify-between"
            >
              <span className="flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4" /> Help & Support
              </span>
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
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

      {/* Hero Search Section */}
      <div className="bg-slate-900/60 border-b border-slate-800 py-12 sm:py-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-3xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4 text-orange-400" /> Help & Support Documentation
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            How can we help you today?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Search our platform guides, portal walkthroughs, and frequent answers for AI Construction ERP.
          </p>

          {/* Search Input */}
          <div className="pt-2 max-w-xl mx-auto relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search guides, portal passwords, or custom field instructions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* Main Documentation Body */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12 sm:space-y-16 w-full flex-1">
        {/* Quick Portal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          <div
            onClick={() => handlePortalNavigation("/admin/super-admin")}
            className="p-6 bg-slate-900/80 rounded-3xl border border-purple-500/30 hover:border-purple-500 cursor-pointer transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <Crown className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-purple-400 transition-colors">Super Admin Owner Guide</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Login to /admin/super-admin with password <strong className="text-purple-400 font-mono">87626</strong> to monitor user feedback and registration logs.
            </p>
          </div>

          <div
            onClick={() => handlePortalNavigation("/admin/custom-fields")}
            className="p-6 bg-slate-900/80 rounded-3xl border border-amber-500/30 hover:border-amber-500 cursor-pointer transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">Custom Production Fields</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Configure dynamic text, number, date, select, and checkbox schema definitions isolated to your company tenant.
            </p>
          </div>

          <div
            onClick={() => handlePortalNavigation("/engineer/dashboard")}
            className="p-6 bg-slate-900/80 rounded-3xl border border-emerald-500/30 hover:border-emerald-500 cursor-pointer transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <HardHat className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">Site Engineer Field Guide</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mobile-first QR worker check-ins, daily site reports, and capped field expense receipt logging.
            </p>
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <div className="text-center space-y-2 mb-6">
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">Frequently Asked Questions</h3>
            <p className="text-xs text-slate-400">Click any question below to reveal detailed instructions.</p>
          </div>

          {filteredFaqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="w-full p-4 sm:p-5 text-left text-xs sm:text-sm font-bold text-white flex items-center justify-between gap-4 hover:bg-slate-800/50"
              >
                <span>{faq.q}</span>
                {openFaqIndex === idx ? (
                  <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                )}
              </button>
              {openFaqIndex === idx && (
                <div className="px-4 sm:px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
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
            <Link href="/about" className="text-slate-300 hover:text-amber-400 font-bold transition-colors">
              About Us
            </Link>
            <span className="text-slate-700">•</span>
            <Link href="/help" className="text-amber-400 font-bold hover:underline">
              Help Center
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
