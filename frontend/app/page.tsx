"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserAuthModal } from "@/components/auth/user-auth-modal";
import { useToast } from "@/components/ui/toast-provider";
import { getValidSession } from "@/lib/session";
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
  CheckCircle2,
  Sparkles,
  Lock,
  MessageSquareHeart,
  Send,
  MessageCircle,
  Lightbulb,
  Bug,
  HelpCircle,
} from "lucide-react";

function HomeContent() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Standalone Feedback Form State
  const [feedbackCategory, setFeedbackCategory] = useState<"FEATURE" | "BUG" | "GENERAL">("FEATURE");
  const [feedbackEmail, setFeedbackEmail] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  // Intelligent Portal Navigation Handler
  const handlePortalNavigation = (targetPath: string) => {
    const session = getValidSession();
    if (session || targetPath === "/admin/super-admin") {
      router.push(targetPath);
    } else {
      showToast("Please log in or create an account first to enter private portals!", "warning");
      setIsAuthModalOpen(true);
    }
  };

  // Submit Feedback Handler with Strict Email Security Check
  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!feedbackMessage || feedbackMessage.trim() === "") {
      showToast("Please type a message before submitting!", "warning");
      return;
    }

    // Strict Email Security Validation (Must be valid format like user@gmail.com)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (feedbackEmail.trim() !== "" && !emailRegex.test(feedbackEmail.trim())) {
      showToast("Please enter a valid email address (e.g. name@gmail.com)!", "warning");
      return;
    }

    setIsSubmittingFeedback(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: feedbackCategory,
          email: feedbackEmail,
          message: feedbackMessage,
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast("Thank you! Platform Architect Sidra Raza will review your feedback in the Owner Portal.", "success");
        setFeedbackEmail("");
        setFeedbackMessage("");
      } else {
        showToast(json.error?.message || "Failed to submit feedback", "error");
      }
    } catch (err) {
      showToast("Failed to connect to feedback server", "error");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between overflow-x-hidden">
      {/* Premium Google Fonts Import */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      <style jsx global>{`
        :root {
          --blueprint-deep: #0f172a; /* Dark Slate Grey */
          --blueprint-mid: #1e293b;  /* Slate Mid Grey */
          --blueprint-line: #94a3b8;
          --cyan-white: #f8fafc;
          --amber: #f97316; /* Project Signature Warm Orange Accent (#f97316) */
          --off-white: #ffffff;
        }

        .hero-wrap {
          font-family: 'Inter', sans-serif;
          background: var(--blueprint-deep);
          color: var(--cyan-white);
          position: relative;
          overflow: hidden;
          padding: 0;
          width: 100%;
          min-height: 600px;
          isolation: isolate;
        }

        /* Blueprint grid */
        .grid-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(var(--blueprint-mid) 1px, transparent 1px),
            linear-gradient(90deg, var(--blueprint-mid) 1px, transparent 1px);
          background-size: 40px 40px;
          opacity: 0.35;
          z-index: 0;
        }
        .grid-bg::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(148,163,184,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148,163,184,0.3) 1px, transparent 1px);
          background-size: 200px 200px;
        }

        .vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 30% 40%, transparent 0%, var(--blueprint-deep) 78%);
          z-index: 1;
        }

        .hero-inner {
          position: relative;
          z-index: 2;
          max-width: 1240px;
          margin: 0 auto;
          padding: 72px 32px 64px;
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 48px;
          align-items: center;
        }

        .stamp {
          position: absolute;
          top: 48px;
          right: 48px;
          z-index: 3;
          width: 108px;
          height: 108px;
          border: 1.5px solid var(--amber);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: rotate(9deg);
          opacity: 0.9;
        }
        .stamp span {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10.5px;
          letter-spacing: 0.14em;
          color: var(--amber);
          text-align: center;
          line-height: 1.5;
          text-transform: uppercase;
        }

        .eyebrow {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12.5px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--amber);
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }
        .eyebrow::before {
          content: "";
          width: 28px;
          height: 1px;
          background: var(--amber);
          display: inline-block;
        }

        h1.headline {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 800;
          font-size: clamp(32px, 4.2vw, 52px);
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: var(--off-white);
          margin: 0 0 22px;
          max-width: 620px;
        }
        h1.headline .accent { color: var(--amber); }
        h1.headline .strike {
          text-decoration: line-through;
          text-decoration-color: rgba(226,232,240,0.45);
          text-decoration-thickness: 2px;
          color: rgba(226,232,240,0.55);
        }

        .subtext {
          font-family: 'Inter', sans-serif;
          font-size: 16px;
          line-height: 1.65;
          color: rgba(226,232,240,0.85);
          max-width: 520px;
          margin: 0 0 32px;
        }
        .subtext b { color: var(--off-white); font-weight: 600; }

        .cta-row {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          margin-bottom: 36px;
        }

        .btn-primary, .btn-secondary {
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 14.5px;
          padding: 13px 24px;
          border-radius: 4px;
          cursor: pointer;
          transition: transform 0.15s ease, background 0.15s ease, border-color 0.15s ease;
        }
        .btn-primary {
          background: var(--amber);
          color: #ffffff;
          border: 1px solid var(--amber);
        }
        .btn-primary:hover { transform: translateY(-1px); background: #ea580c; }
        .btn-primary:focus-visible, .btn-secondary:focus-visible {
          outline: 2px solid var(--cyan-white);
          outline-offset: 3px;
        }
        .btn-secondary {
          background: transparent;
          color: var(--cyan-white);
          border: 1px solid rgba(226,232,240,0.35);
        }
        .btn-secondary:hover { border-color: var(--cyan-white); transform: translateY(-1px); }

        .meta-line {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11.5px;
          letter-spacing: 0.06em;
          color: rgba(226,232,240,0.55);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .meta-line .dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--amber);
          display: inline-block;
        }

        /* Diagram side */
        .diagram-box {
          position: relative;
          height: 420px;
        }
        .diagram-box svg { width: 100%; height: 100%; overflow: visible; }

        .node-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          fill: var(--cyan-white);
          letter-spacing: 0.02em;
        }
        .dim-line { stroke: rgba(148,163,184,0.55); stroke-width: 1; }
        .dim-line.amber { stroke: var(--amber); stroke-width: 1.2; }

        /* Mobile Layout & Reduced Font Sizes */
        @media (max-width: 860px) {
          .hero-inner {
            grid-template-columns: 1fr;
            padding: 48px 18px 36px;
            gap: 28px;
          }
          h1.headline {
            font-size: clamp(24px, 6.5vw, 36px);
            line-height: 1.15;
            margin-bottom: 16px;
          }
          .subtext {
            font-size: 14px;
            line-height: 1.55;
            margin-bottom: 24px;
          }
          .eyebrow {
            font-size: 11px;
            margin-bottom: 14px;
          }
          .diagram-box {
            height: 250px;
            order: 2;
          }
          .cta-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            width: 100%;
            margin-bottom: 28px;
          }
          .btn-primary, .btn-secondary {
            width: 100%;
            text-align: center;
            padding: 11px 6px;
            font-size: 12.5px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .stamp { width: 72px; height: 72px; top: 14px; right: 14px; }
          .stamp span { font-size: 8px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .btn-primary, .btn-secondary { transition: none; }
        }
      `}</style>

      {/* Navigation Bar */}
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
          <Link
            href="/help"
            className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-xl transition-all flex items-center gap-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" /> Help Center
          </Link>

          <button
            onClick={() => handlePortalNavigation("/admin/custom-fields")}
            className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 px-3 py-2 rounded-xl transition-all flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" /> Custom Fields
          </button>

          <button
            onClick={() => handlePortalNavigation("/admin/super-admin")}
            className="text-xs font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 px-3 py-2 rounded-xl transition-all flex items-center gap-1.5"
          >
            <Crown className="w-3.5 h-3.5" /> Owner Portal
          </button>

          <button
            onClick={() => handlePortalNavigation("/admin/dashboard")}
            className="text-xs font-medium text-slate-300 hover:text-white px-3 py-2 rounded-xl transition-all"
          >
            Admin Portal
          </button>

          <button
            onClick={() => handlePortalNavigation("/engineer/dashboard")}
            className="text-xs font-medium text-slate-300 hover:text-white px-3 py-2 rounded-xl transition-all"
          >
            Engineer Portal
          </button>

          <button
            onClick={() => handlePortalNavigation("/client/dashboard")}
            className="text-xs font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/20 hover:brightness-110 transition-all flex items-center gap-1.5"
          >
            Client Portal <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/help"
            className="text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 rounded-lg flex items-center gap-1"
          >
            <HelpCircle className="w-3 h-3" /> Help
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
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Portal Navigation</p>

            <Link
              href="/help"
              onClick={() => setIsMobileNavOpen(false)}
              className="w-full p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-amber-400 text-sm font-bold flex items-center justify-between"
            >
              <span className="flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4" /> Help & Support Documentation
              </span>
              <ArrowRight className="w-4 h-4" />
            </Link>

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

      {/* Dark Grey Custom Blueprint Hero Section (Project Orange Signature Accent) */}
      <div className="hero-wrap">
        <div className="grid-bg"></div>
        <div className="vignette"></div>

        <div className="stamp"><span>AI<br />POWERED<br />SYSTEM</span></div>

        <div className="hero-inner">
          {/* Text Content Block */}
          <div>
            <div className="eyebrow">Construction ERP</div>

            <h1 className="headline">
              Replace <span className="strike">WhatsApp groups</span> &amp; <span className="strike">spreadsheets</span><br />
              with <span className="accent">AI intelligence.</span>
            </h1>

            <p className="subtext">
              Manage <b>projects</b>, <b>site labour</b>, <b>material inventory</b>, <b>expense tracking</b>, <b>client billing</b>, and <b>self-configurable custom production fields</b> — in one connected SaaS system.
            </p>

            {/* Buttons Row (2 Side-by-Side in 1 Line on Mobile!) */}
            <div className="cta-row">
              <button onClick={() => setIsAuthModalOpen(true)} className="btn-primary">Get early access</button>
              <a href="#system-overview" className="btn-secondary">See how it works</a>
            </div>

            <div className="meta-line">
              <span className="dot"></span> BUILT FOR REAL CONSTRUCTION COMPANIES — LAUNCHING NEXT WEEK
            </div>
          </div>

          {/* CAD Diagram Box */}
          <div className="diagram-box">
            <svg viewBox="0 0 420 420" xmlns="http://www.w3.org/2000/svg">
              {/* dimension tick frame */}
              <line x1="10" y1="10" x2="10" y2="410" className="dim-line" strokeDasharray="2 4"/>
              <line x1="10" y1="10" x2="20" y2="10" className="dim-line"/>
              <line x1="10" y1="410" x2="20" y2="410" className="dim-line"/>

              {/* central hub */}
              <circle cx="210" cy="210" r="46" fill="none" stroke="var(--amber)" strokeWidth="1.4"/>
              <text x="210" y="205" textAnchor="middle" className="node-label" fill="#f97316" fontSize="10.5">AI CONSTRUCTION</text>
              <text x="210" y="219" textAnchor="middle" className="node-label" fill="#f97316" fontSize="10.5">ERP</text>

              {/* module nodes */}
              {/* Projects */}
              <line x1="210" y1="164" x2="210" y2="70" className="dim-line"/>
              <circle cx="210" cy="70" r="4" fill="#E4F1F7"/>
              <text x="222" y="74" className="node-label">PROJECTS</text>

              {/* Labour */}
              <line x1="248" y1="185" x2="335" y2="120" className="dim-line"/>
              <circle cx="335" cy="120" r="4" fill="#E4F1F7"/>
              <text x="347" y="124" className="node-label">SITE LABOUR</text>

              {/* Materials */}
              <line x1="256" y1="210" x2="368" y2="210" className="dim-line"/>
              <circle cx="368" cy="210" r="4" fill="#E4F1F7"/>
              <text x="380" y="214" className="node-label">MATERIALS</text>

              {/* Expenses */}
              <line x1="248" y1="235" x2="335" y2="300" className="dim-line"/>
              <circle cx="335" cy="300" r="4" fill="#E4F1F7"/>
              <text x="347" y="304" className="node-label">EXPENSES</text>

              {/* Billing */}
              <line x1="210" y1="256" x2="210" y2="350" className="dim-line"/>
              <circle cx="210" cy="350" r="4" fill="#E4F1F7"/>
              <text x="222" y="354" className="node-label">CLIENT BILLING</text>

              {/* Custom fields */}
              <line x1="172" y1="235" x2="85" y2="300" className="dim-line amber"/>
              <circle cx="85" cy="300" r="4" fill="#f97316"/>
              <text x="20" y="304" className="node-label" fill="#f97316">CUSTOM FIELDS</text>

              {/* scale tag */}
              <text x="20" y="400" className="node-label" fill="rgba(226,232,240,0.4)" fontSize="9.5">SCALE — ONE SYSTEM : ALL SITES</text>
            </svg>
          </div>
        </div>
      </div>

      {/* Overview & Portal Routes Section */}
      <section id="system-overview" className="py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6 w-full space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Platform Architecture Overview
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Integrated Enterprise Portal Routes
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Click any portal below to enter its private dashboard or authenticate your company.
          </p>
        </div>

        {/* Portal Routes Showcase Grid with Interactive Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Enterprise Admin Portal */}
          <div className="p-6 bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800 space-y-4 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">Enterprise Admin Portal</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Central command for multi-project management, labour attendance tracking, materials inventory, supplier management, and invoice audit.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-300 font-medium pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Project Milestones & Labour Payroll
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Material Purchase Orders & Suppliers
                </li>
              </ul>
            </div>
            <button
              onClick={() => handlePortalNavigation("/admin/dashboard")}
              className="mt-5 py-3 px-4 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs font-bold text-slate-100 hover:text-amber-400 hover:bg-slate-800 hover:border-amber-500/40 flex items-center justify-between transition-all"
            >
              <span>Explore Admin Portal</span>
              <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Card 2: Site Engineer Command */}
          <div className="p-6 bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800 space-y-4 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
                <HardHat className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">Site Engineer Command</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Mobile-first field dashboard for site engineers to perform QR attendance check-ins, record daily site logs, and log expense receipts.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-300 font-medium pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> QR Attendance & Site Logs
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Capped Site Expense Logging
                </li>
              </ul>
            </div>
            <button
              onClick={() => handlePortalNavigation("/engineer/dashboard")}
              className="mt-5 py-3 px-4 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs font-bold text-slate-100 hover:text-emerald-400 hover:bg-slate-800 hover:border-emerald-500/40 flex items-center justify-between transition-all"
            >
              <span>Explore Engineer Portal</span>
              <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Card 3: Custom Production Fields */}
          <div className="p-6 bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-amber-500/30 space-y-4 hover:border-amber-500 hover:shadow-2xl hover:shadow-amber-500/15 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:bg-amber-500/30 transition-all">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">Custom Fields Engine</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase">Self-Configurable</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Define unique production schemas for your company. Create text, number, dropdown, date, and checkbox fields without touching core code.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-300 font-medium pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Dynamic Schema Definition
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Isolated Production Record Entry
                </li>
              </ul>
            </div>
            <button
              onClick={() => handlePortalNavigation("/admin/custom-fields")}
              className="mt-5 py-3 px-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-400 hover:bg-amber-500/20 flex items-center justify-between transition-all"
            >
              <span>Open Custom Fields</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Card 4: Client Project Portal */}
          <div className="p-6 bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800 space-y-4 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">Client Project Portal</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dedicated client view for transparent progress tracking, verified invoice downloads, AI project cost estimations, and document archives.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-300 font-medium pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Verified Invoice Audit & Payments
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Real-time Progress Tracking
                </li>
              </ul>
            </div>
            <button
              onClick={() => handlePortalNavigation("/client/dashboard")}
              className="mt-5 py-3 px-4 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs font-bold text-slate-100 hover:text-cyan-400 hover:bg-slate-800 hover:border-cyan-500/40 flex items-center justify-between transition-all"
            >
              <span>Explore Client Portal</span>
              <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Card 5: Super Admin Owner Portal */}
          <div className="p-6 bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-purple-500/30 space-y-4 hover:border-purple-500 hover:shadow-2xl hover:shadow-purple-500/15 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 group-hover:scale-110 group-hover:bg-purple-500/30 transition-all">
                <Crown className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">Super Admin Portal</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 uppercase flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> Gatekeeper
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Owner portal protected by security gatekeeper for platform governance, tenant isolation audits, and system configuration.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-300 font-medium pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Platform Governance & Audit Logs
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Tenant Company Management
                </li>
              </ul>
            </div>
            <button
              onClick={() => handlePortalNavigation("/admin/super-admin")}
              className="mt-5 py-3 px-4 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs font-bold text-purple-400 hover:bg-purple-500/20 flex items-center justify-between transition-all"
            >
              <span>Access Owner Portal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Card 6: AI Intelligence Engine */}
          <div className="p-6 bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800 space-y-4 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 group-hover:scale-110 group-hover:bg-orange-500/20 transition-all">
                <Bot className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">AI Intelligence Engine</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 uppercase flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-amber-400" /> AI Assistant
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Built-in AI assistant for drafting daily progress reports, estimating project costs, and drafting client quotations.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-300 font-medium pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-400" /> Automated Cost Estimations
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-400" /> Smart Daily Site Report Assistant
                </li>
              </ul>
            </div>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="mt-5 py-3 px-4 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs font-bold text-slate-100 hover:text-orange-400 hover:bg-slate-800 hover:border-orange-500/40 flex items-center justify-between transition-all"
            >
              <span>Launch AI Intelligence</span>
              <ArrowRight className="w-4 h-4 text-orange-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Standalone Polished User Feedback & Feature Request Section */}
      <section id="feedback-section" className="py-16 sm:py-20 bg-slate-900/50 border-t border-b border-slate-800/80 w-full relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Context & Branding */}
            <div className="lg:col-span-5 space-y-5 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <MessageSquareHeart className="w-4 h-4 text-orange-400" /> User Voice & Feedback
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Help Us Build the Next Generation ERP
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Send your suggestions, feature requests, or bug reports directly to Platform Founder & Lead Architect <strong className="text-amber-400 font-bold">Sidra Raza</strong>.
              </p>

              <div className="space-y-2.5 pt-2">
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Feature Suggestions</h4>
                    <p className="text-[11px] text-slate-400">Propose custom field types or workflow ideas.</p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                    <Bug className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Bug Reports</h4>
                    <p className="text-[11px] text-slate-400">Report any UI issue or site log glitch.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Form Card */}
            <div className="lg:col-span-7 bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-5 relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />

              {/* Category Selector Tabs */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">Select Feedback Type</label>
                <div className="grid grid-cols-3 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setFeedbackCategory("FEATURE")}
                    className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      feedbackCategory === "FEATURE"
                        ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Lightbulb className="w-3.5 h-3.5" /> Idea
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedbackCategory("BUG")}
                    className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      feedbackCategory === "BUG"
                        ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Bug className="w-3.5 h-3.5" /> Bug
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedbackCategory("GENERAL")}
                    className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      feedbackCategory === "GENERAL"
                        ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> Note
                  </button>
                </div>
              </div>

              <form onSubmit={handleFeedbackSubmit} autoComplete="off" className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Your Email Address (Optional, e.g. name@gmail.com)</label>
                  <input
                    type="email"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    placeholder="Enter valid email (e.g. name@gmail.com)"
                    value={feedbackEmail}
                    onChange={(e) => setFeedbackEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Your Message / Suggestion *</label>
                  <textarea
                    required
                    rows={4}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    placeholder="Describe your feedback, feature request, or suggestion for Sidra Raza..."
                    value={feedbackMessage}
                    onChange={(e) => setFeedbackMessage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingFeedback}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-extrabold text-xs shadow-lg hover:brightness-110 flex items-center justify-center gap-2 transition-all"
                >
                  <Send className="w-4 h-4" />
                  {isSubmittingFeedback ? "Submitting..." : "Send Feedback to Sidra Raza"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Register / Login Gatekeeper Modal */}
      <UserAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          showToast("Authenticated! You can now access all portal features.", "success");
        }}
      />

      {/* Footer with About Us & Help Center Links */}
      <footer className="border-t border-slate-800/80 px-6 py-5 bg-slate-950 text-xs text-slate-400 font-medium">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            Created & Built by <strong className="text-amber-400">Sidra Raza</strong> (Platform Founder & Lead Architect) • AI Construction ERP v1.0
          </div>
          <div className="flex items-center gap-3">
            <Link href="/about" className="text-slate-300 hover:text-amber-400 font-bold transition-colors bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl">
              About Us
            </Link>
            <Link href="/help" className="text-slate-300 hover:text-amber-400 font-bold transition-colors bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" /> Help Center
            </Link>
          </div>
        </div>
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
