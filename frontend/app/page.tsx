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
      {/* Import Custom Google Fonts for Blueprint Hero */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500&display=swap"
        rel="stylesheet"
      />

      <style jsx global>{`
        :root {
          --blueprint-deep: #0F2D4A;
          --blueprint-mid: #1E4A70;
          --blueprint-line: #7FB8D6;
          --cyan-white: #E4F1F7;
          --amber: #F2A93B;
          --off-white: #F5F1E8;
        }

        .hero-wrap {
          font-family: 'Inter', sans-serif;
          background: var(--blueprint-deep);
          color: var(--cyan-white);
          position: relative;
          overflow: hidden;
          padding: 0;
          width: 100%;
          min-height: 640px;
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
            linear-gradient(rgba(127,184,214,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(127,184,214,0.5) 1px, transparent 1px);
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
          padding: 88px 32px 72px;
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
          margin-bottom: 22px;
        }
        .eyebrow::before {
          content: "";
          width: 28px;
          height: 1px;
          background: var(--amber);
          display: inline-block;
        }

        h1.headline {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 600;
          font-size: clamp(34px, 4.4vw, 54px);
          line-height: 1.08;
          letter-spacing: -0.015em;
          color: var(--off-white);
          margin: 0 0 24px;
          max-width: 620px;
        }
        h1.headline .accent { color: var(--amber); }
        h1.headline .strike {
          text-decoration: line-through;
          text-decoration-color: rgba(228,241,247,0.45);
          text-decoration-thickness: 2px;
          color: rgba(228,241,247,0.55);
        }

        .subtext {
          font-size: 16.5px;
          line-height: 1.65;
          color: rgba(228,241,247,0.82);
          max-width: 500px;
          margin: 0 0 34px;
        }
        .subtext b { color: var(--off-white); font-weight: 500; }

        .cta-row { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 40px; }

        .btn-primary, .btn-secondary {
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          font-size: 14.5px;
          padding: 13px 24px;
          border-radius: 3px;
          cursor: pointer;
          transition: transform 0.15s ease, background 0.15s ease, border-color 0.15s ease;
        }
        .btn-primary {
          background: var(--amber);
          color: var(--blueprint-deep);
          border: 1px solid var(--amber);
        }
        .btn-primary:hover { transform: translateY(-1px); background: #ffb84f; }
        .btn-primary:focus-visible, .btn-secondary:focus-visible {
          outline: 2px solid var(--cyan-white);
          outline-offset: 3px;
        }
        .btn-secondary {
          background: transparent;
          color: var(--cyan-white);
          border: 1px solid rgba(228,241,247,0.35);
        }
        .btn-secondary:hover { border-color: var(--cyan-white); transform: translateY(-1px); }

        .meta-line {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11.5px;
          letter-spacing: 0.06em;
          color: rgba(228,241,247,0.5);
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
        .dim-line { stroke: rgba(127,184,214,0.55); stroke-width: 1; }
        .dim-line.amber { stroke: var(--amber); stroke-width: 1.2; }

        @media (max-width: 860px) {
          .hero-inner { grid-template-columns: 1fr; padding: 96px 22px 48px; }
          .diagram-box { height: 300px; order: -1; }
          .stamp { width: 84px; height: 84px; top: 24px; right: 24px; }
          .stamp span { font-size: 9px; }
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
            className="text-xs font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/20 hover:brightness-110 transition-all flex items-center gap-1.5"
          >
            Client Portal <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/admin/custom-fields"
            className="text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 rounded-lg flex items-center gap-1"
          >
            <SlidersHorizontal className="w-3 h-3" /> Fields
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
              className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-bold flex items-center justify-between shadow-lg shadow-orange-500/20"
            >
              <span className="flex items-center gap-2.5">
                <Users className="w-4 h-4" /> Client Project Portal
              </span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-400 font-medium">
            Created & Designed by <strong className="text-amber-400">Sidra Raza</strong> • AI Construction ERP
          </div>
        </div>
      )}

      {/* Exact Custom Blueprint Hero Section */}
      <div className="hero-wrap">
        <div className="grid-bg"></div>
        <div className="vignette"></div>

        <div className="stamp"><span>AI<br />POWERED<br />SYSTEM</span></div>

        <div className="hero-inner">
          <div>
            <div className="eyebrow">Construction ERP</div>

            <h1 className="headline">
              Replace <span className="strike">WhatsApp groups</span> &amp; <span className="strike">spreadsheets</span><br />
              with <span className="accent">AI intelligence.</span>
            </h1>

            <p className="subtext">
              Manage <b>projects</b>, <b>site labour</b>, <b>material inventory</b>, <b>expense tracking</b>, <b>client billing</b>, and <b>self-configurable custom production fields</b> — in one connected SaaS system powered by Next.js and Prisma.
            </p>

            <div className="cta-row">
              <button onClick={() => setIsAuthModalOpen(true)} className="btn-primary">Get early access</button>
              <Link href="/admin/dashboard" className="btn-secondary">See how it works</Link>
            </div>

            <div className="meta-line">
              <span className="dot"></span> BUILT FOR REAL CONSTRUCTION COMPANIES — LAUNCHING NEXT WEEK
            </div>
          </div>

          <div className="diagram-box">
            <svg viewBox="0 0 420 420" xmlns="http://www.w3.org/2000/svg">
              {/* dimension tick frame */}
              <line x1="10" y1="10" x2="10" y2="410" className="dim-line" strokeDasharray="2 4"/>
              <line x1="10" y1="10" x2="20" y2="10" className="dim-line"/>
              <line x1="10" y1="410" x2="20" y2="410" className="dim-line"/>

              {/* central hub */}
              <circle cx="210" cy="210" r="46" fill="none" stroke="var(--amber)" strokeWidth="1.4"/>
              <text x="210" y="205" textAnchor="middle" className="node-label" fill="#F2A93B" fontSize="10.5">AI CONSTRUCTION</text>
              <text x="210" y="219" textAnchor="middle" className="node-label" fill="#F2A93B" fontSize="10.5">ERP</text>

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
              <circle cx="85" cy="300" r="4" fill="#F2A93B"/>
              <text x="20" y="304" className="node-label" fill="#F2A93B">CUSTOM FIELDS</text>

              {/* scale tag */}
              <text x="20" y="400" className="node-label" fill="rgba(228,241,247,0.4)" fontSize="9.5">SCALE — ONE SYSTEM : ALL SITES</text>
            </svg>
          </div>
        </div>
      </div>

      {/* Register / Login Gatekeeper Modal */}
      <UserAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          showToast("Authenticated! You can now access all portal features.", "success");
        }}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 px-6 py-5 text-center text-xs text-slate-400 font-medium bg-slate-950">
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
