"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserAuthModal } from "@/components/auth/user-auth-modal";
import { useToast } from "@/components/ui/toast-provider";
import { getValidSession } from "@/lib/session";
import {
  BookOpen,
  Search,
  CheckCircle2,
  ShieldCheck,
  HardHat,
  SlidersHorizontal,
  Crown,
  Users,
  ChevronDown,
  Sparkles,
  Menu,
  X,
  LayoutDashboard,
  ArrowRight,
  Receipt,
  FileCode2,
  Database,
  Lock,
  HelpCircle,
  Copy,
  Check,
  Server,
  Zap,
  Bot,
  Building2,
  Terminal,
  ExternalLink,
} from "lucide-react";

export default function DocsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTopic, setActiveTopic] = useState<string>("getting-started");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
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

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    showToast("Command copied to clipboard!", "success");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const topics = [
    { id: "getting-started", name: "Quickstart & Setup", icon: Zap, badge: "Start Here" },
    { id: "admin-guide", name: "Company Admin Guide", icon: Building2, badge: "Core" },
    { id: "engineer-guide", name: "Site Engineer Field Guide", icon: HardHat, badge: "Mobile" },
    { id: "client-guide", name: "Client Transparency Portal", icon: Users, badge: "Client" },
    { id: "super-admin", name: "Super Admin Command Center", icon: Crown, badge: "Owner" },
    { id: "custom-fields", name: "Custom Production Fields", icon: SlidersHorizontal, badge: "Flexible" },
    { id: "ai-studio", name: "AI Intelligence Studio", icon: Bot, badge: "AI" },
    { id: "api-reference", name: "REST API Reference", icon: Server, badge: "25+ APIs" },
    { id: "database-schema", name: "Database & Prisma Schema", icon: Database, badge: "PostgreSQL" },
    { id: "security-rbac", name: "Security & RBAC Matrix", icon: Lock, badge: "Zero Leakage" },
    { id: "faq", name: "FAQs & Troubleshooting", icon: HelpCircle, badge: "Support" },
  ];

  const filteredTopics = topics.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between overflow-x-hidden">
      {/* Navigation Header */}
      <nav className="border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between backdrop-blur-md bg-slate-950/90 sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/logo-128px.png" alt="AI Construction ERP Logo" className="w-8 h-8 sm:w-9 sm:h-9 object-contain shrink-0" />
          <span className="text-base sm:text-lg font-bold text-white tracking-tight truncate">AI Construction ERP</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-xs font-semibold text-slate-300 hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/about" className="text-xs font-semibold text-slate-300 hover:text-white transition-colors">
            About Us
          </Link>
          <Link href="/help" className="text-xs font-semibold text-slate-300 hover:text-white transition-colors">
            Help Center
          </Link>
          <Link href="/docs" className="text-xs font-bold text-amber-400 border-b-2 border-amber-400 pb-0.5">
            Documentation
          </Link>

          {/* Portals Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsPortalsDropdownOpen(!isPortalsDropdownOpen)}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors py-1.5"
            >
              <span>Explore Portals</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isPortalsDropdownOpen ? "rotate-180 text-amber-400" : ""}`} />
            </button>

            {isPortalsDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl space-y-1 z-50 animate-in fade-in slide-in-from-top-2">
                <button
                  onClick={() => { setIsPortalsDropdownOpen(false); handlePortalNavigation("/admin/super-admin"); }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800 text-xs font-bold text-slate-200 flex items-center gap-2.5 transition-colors group"
                >
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-white transition-all">
                    <Crown className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-slate-100 flex items-center gap-1">Super Admin <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.2 rounded font-mono">Owner</span></p>
                    <p className="text-[10px] text-slate-400 font-normal">Global multi-tenant metrics</p>
                  </div>
                </button>

                <button
                  onClick={() => { setIsPortalsDropdownOpen(false); handlePortalNavigation("/admin/dashboard"); }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800 text-xs font-bold text-slate-200 flex items-center gap-2.5 transition-colors group"
                >
                  <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white transition-all">
                    <LayoutDashboard className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-slate-100">Admin Dashboard</p>
                    <p className="text-[10px] text-slate-400 font-normal">Projects, payroll, materials & billing</p>
                  </div>
                </button>

                <button
                  onClick={() => { setIsPortalsDropdownOpen(false); handlePortalNavigation("/engineer/dashboard"); }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800 text-xs font-bold text-slate-200 flex items-center gap-2.5 transition-colors group"
                >
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                    <HardHat className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-slate-100">Engineer Field Portal</p>
                    <p className="text-[10px] text-slate-400 font-normal">QR attendance & AI site reports</p>
                  </div>
                </button>

                <button
                  onClick={() => { setIsPortalsDropdownOpen(false); handlePortalNavigation("/client/dashboard"); }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800 text-xs font-bold text-slate-200 flex items-center gap-2.5 transition-colors group"
                >
                  <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:bg-purple-500 group-hover:text-white transition-all">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-slate-100">Client Transparency</p>
                    <p className="text-[10px] text-slate-400 font-normal">Milestones, PDF invoices & AI chat</p>
                  </div>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            Register / Login
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-amber-400"
          aria-label="Toggle Mobile Menu"
        >
          {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Nav Drawer */}
      {isMobileNavOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 space-y-3">
          <Link href="/" onClick={() => setIsMobileNavOpen(false)} className="block text-sm font-semibold text-slate-200 py-1">Home</Link>
          <Link href="/about" onClick={() => setIsMobileNavOpen(false)} className="block text-sm font-semibold text-slate-200 py-1">About Us</Link>
          <Link href="/help" onClick={() => setIsMobileNavOpen(false)} className="block text-sm font-semibold text-slate-200 py-1">Help Center</Link>
          <Link href="/docs" onClick={() => setIsMobileNavOpen(false)} className="block text-sm font-bold text-amber-400 py-1">Documentation</Link>
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <button
              onClick={() => { setIsMobileNavOpen(false); handlePortalNavigation("/admin/dashboard"); }}
              className="w-full text-left py-2 px-3 bg-slate-800/60 rounded-xl text-xs font-bold text-slate-200 flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4 text-blue-400" /> Admin Dashboard
            </button>
            <button
              onClick={() => { setIsMobileNavOpen(false); setIsAuthModalOpen(true); }}
              className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs text-center"
            >
              Register / Login Account
            </button>
          </div>
        </div>
      )}

      {/* Main Documentation Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold font-mono">
            <BookOpen className="w-3.5 h-3.5" /> SYSTEM & USER MANUAL v1.0
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            AI Construction ERP Documentation
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Everything you need to master multi-tenant construction management, field operations, AI daily reporting, automated billing, and REST APIs.
          </p>

          {/* Quick Search */}
          <div className="relative max-w-xl mx-auto pt-2">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documentation (e.g., QR attendance, invoices, API, custom fields)..."
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Documentation Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Left Sidebar Topic Navigation */}
          <div className="lg:col-span-1 bg-slate-900/80 border border-slate-800 rounded-3xl p-4 space-y-2 sticky top-20 shadow-xl overflow-x-auto">
            <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              Documentation Topics
            </div>
            <div className="flex lg:flex-col gap-1.5 overflow-x-auto pb-2 lg:pb-0">
              {filteredTopics.map((topic) => {
                const Icon = topic.icon;
                const isActive = activeTopic === topic.id;
                return (
                  <button
                    key={topic.id}
                    onClick={() => setActiveTopic(topic.id)}
                    className={`flex items-center justify-between p-3 rounded-2xl text-xs font-semibold transition-all shrink-0 lg:shrink text-left ${
                      isActive
                        ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? "text-slate-950" : "text-amber-400"}`} />
                      <span className="truncate">{topic.name}</span>
                    </div>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono hidden sm:inline ${
                        isActive ? "bg-slate-950/20 text-slate-950" : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {topic.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Topic Content Body */}
          <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl">
            {/* 1. Quickstart & Setup */}
            {activeTopic === "getting-started" && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Quickstart & Local Installation</h2>
                    <p className="text-xs text-slate-400">Get AI Construction ERP running locally in under 3 minutes.</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-amber-400" /> Step 1: Clone Repository & Install Dependencies
                  </h3>
                  <div className="relative bg-slate-950 rounded-2xl p-4 border border-slate-800 font-mono text-xs text-emerald-400">
                    <code>
                      git clone https://github.com/SidraRaza/ai-construction-erp.git<br />
                      cd ai-construction-erp/frontend<br />
                      npm install
                    </code>
                    <button
                      onClick={() => copyToClipboard("git clone https://github.com/SidraRaza/ai-construction-erp.git\ncd ai-construction-erp/frontend\nnpm install", "c1")}
                      className="absolute right-3 top-3 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      {copiedCode === "c1" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-white flex items-center gap-2 pt-2">
                    <Database className="w-4 h-4 text-amber-400" /> Step 2: Configure Environment Variables
                  </h3>
                  <p className="text-xs text-slate-400">Create a <code>frontend/.env</code> file with your PostgreSQL URL:</p>
                  <div className="relative bg-slate-950 rounded-2xl p-4 border border-slate-800 font-mono text-xs text-slate-200">
                    <code>
                      DATABASE_URL=&quot;postgresql://user:pass@ep-cool-db.neon.tech/neondb?sslmode=require&quot;<br />
                      NEXT_PUBLIC_SITE_URL=&quot;http://localhost:3000&quot;
                    </code>
                  </div>

                  <h3 className="text-base font-bold text-white flex items-center gap-2 pt-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Step 3: Seed Database & Run Dev Server
                  </h3>
                  <div className="relative bg-slate-950 rounded-2xl p-4 border border-slate-800 font-mono text-xs text-emerald-400">
                    <code>
                      npx prisma db push<br />
                      npx tsx prisma/seed.ts<br />
                      npm run dev
                    </code>
                    <button
                      onClick={() => copyToClipboard("npx prisma db push\nnpx tsx prisma/seed.ts\nnpm run dev", "c2")}
                      className="absolute right-3 top-3 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      {copiedCode === "c2" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Company Admin Guide */}
            {activeTopic === "admin-guide" && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Company Admin & Contractor Guide</h2>
                    <p className="text-xs text-slate-400">Manage construction projects, materials, procurement, quotations, and staff.</p>
                  </div>
                </div>

                <div className="space-y-5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
                    <h4 className="font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400" /> 1. Creating and Managing Projects
                    </h4>
                    <p className="text-xs text-slate-400">
                      Navigate to <code>/admin/projects</code> and click <strong>&quot;+ Create New Project&quot;</strong>. Enter project title, capital budget ($), target completion dates, and priority level. You can assign site engineers and workforce leads directly to project teams.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
                    <h4 className="font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400" /> 2. Material Inventory & Reorder Thresholds
                    </h4>
                    <p className="text-xs text-slate-400">
                      Monitor Cement, Steel, Sand, and Aggregates in <code>/admin/materials</code>. When stock level reaches or drops below the defined reorder threshold, the system automatically triggers an amber <strong>Low Stock Alert</strong>.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
                    <h4 className="font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400" /> 3. Quotations, Invoices & Multi-Channel Payments
                    </h4>
                    <p className="text-xs text-slate-400">
                      Generate itemized quotations with custom IDs and initial statuses. When approved, generate immutable versioned invoices (<code>v1.0</code>, <code>v2.0</code>). Record payments with multi-channel support (Cash, Wire Transfer, Bank Cheque, JazzCash, EasyPaisa, Stripe).
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Site Engineer Field Guide */}
            {activeTopic === "engineer-guide" && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <HardHat className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Civil Site Engineer Field Guide</h2>
                    <p className="text-xs text-slate-400">High-speed field tools optimized for mobile phones and tablet devices.</p>
                  </div>
                </div>

                <div className="space-y-5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
                    <h4 className="font-bold text-white flex items-center gap-2">
                      <Bot className="w-4 h-4 text-amber-400" /> 1. AI Daily Site Report Synthesis
                    </h4>
                    <p className="text-xs text-slate-400">
                      Log into <code>/engineer/dashboard</code>. In <strong>Today&apos;s Site Notes</strong>, type rough notes (e.g. <em>&quot;Poured 45m³ concrete on 2nd floor, 28 workers, passed slump test&quot;</em>). Click <strong>&quot;Synthesize AI Daily Site Report&quot;</strong> to generate an executive progress report instantly.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
                    <h4 className="font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" /> 2. Worker QR Attendance & Duplicate Guards
                    </h4>
                    <p className="text-xs text-slate-400">
                      Click <strong>&quot;Scan Worker QR&quot;</strong> to record worker attendance. If a worker has already marked attendance today, the system triggers a duplicate guard error to eliminate accidental double scans.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
                    <h4 className="font-bold text-white flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-purple-400" /> 3. Capped Field Expense Logging ($10,000 Cap)
                    </h4>
                    <p className="text-xs text-slate-400">
                      Site engineers can log urgent field expenses up to <strong>$10,000</strong> with category and receipt upload. Amounts exceeding $10,000 are blocked and require Company Admin authorization.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Client Guide */}
            {activeTopic === "client-guide" && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Client & Property Investor Guide</h2>
                    <p className="text-xs text-slate-400">Live milestone transparency, verified PDF statements, and AI project support.</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
                    <h4 className="font-bold text-white">1. Live Progress Dashboard</h4>
                    <p className="text-xs text-slate-400">Visit <code>/client/dashboard</code> to view dynamic project completion progress percentages and target completion dates.</p>
                  </div>
                  <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
                    <h4 className="font-bold text-white">2. Invoices & PDF Statements</h4>
                    <p className="text-xs text-slate-400">Visit <code>/client/invoices</code> to preview and download tamper-proof PDF billing statements.</p>
                  </div>
                  <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
                    <h4 className="font-bold text-white">3. Grounded AI Support Assistant</h4>
                    <p className="text-xs text-slate-400">Visit <code>/client/ai</code> to ask real-time questions regarding site milestones, timelines, and progress.</p>
                  </div>
                </div>
              </div>
            )}

            {/* 5. Super Admin */}
            {activeTopic === "super-admin" && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Crown className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Super Admin Command Center</h2>
                    <p className="text-xs text-slate-400">Exclusive platform owner dashboard overseeing all tenant accounts globally.</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-950/80 rounded-2xl border border-amber-500/30 text-xs text-slate-300 space-y-2">
                  <p className="font-bold text-amber-400 flex items-center gap-2">
                    <Lock className="w-4 h-4" /> Accessing the Super Admin Vault:
                  </p>
                  <p className="text-slate-400 leading-relaxed">
                    Navigate to <code>/admin/super-admin</code>. Enter the Super Admin password to unlock global tenant monitoring, subscription plan tiers, user counts, and feedback inbox logs.
                  </p>
                </div>
              </div>
            )}

            {/* 6. Custom Production Fields */}
            {activeTopic === "custom-fields" && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <SlidersHorizontal className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Self-Configurable Custom Production Fields</h2>
                    <p className="text-xs text-slate-400">Create bespoke data capture schemas without writing custom code.</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-slate-300">
                  <p>Companies can define custom attributes in <code>/admin/custom-fields</code>:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="font-bold text-white">TEXT / NUMBER</span>
                      <p className="text-[11px] text-slate-400">Batch Truck IDs, Slump tests, concrete temperature (°C)</p>
                    </div>
                    <div className="grid grid-cols-1 gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="font-bold text-white">SELECT / CHECKBOX</span>
                      <p className="text-[11px] text-slate-400">Dropdown options and engineer quality sign-off flags</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 7. AI Studio */}
            {activeTopic === "ai-studio" && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">AI Intelligence Studio</h2>
                    <p className="text-xs text-slate-400">Grounded LLM intelligence pipelines built for construction workflows.</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-slate-300">
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                    <h4 className="font-bold text-white mb-1">🤖 1. AI Daily Site Report Formatter</h4>
                    <p className="text-xs text-slate-400">Synthesizes unstructured engineer field notes into formal progress reports with completed tasks and quality inspections.</p>
                  </div>
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                    <h4 className="font-bold text-white mb-1">📐 2. Project Cost & Timeline Estimator</h4>
                    <p className="text-xs text-slate-400">Calculates estimated materials, labour requirements, and duration for 5 Marla, 10 Marla, 1 Kanal, or commercial projects.</p>
                  </div>
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                    <h4 className="font-bold text-white mb-1">💬 3. Grounded Q&A Assistant</h4>
                    <p className="text-xs text-slate-400">Queries live project database tables to provide accurate answers to client and management inquiries.</p>
                  </div>
                </div>
              </div>
            )}

            {/* 8. REST API Reference */}
            {activeTopic === "api-reference" && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Server className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">REST API Reference Manual</h2>
                    <p className="text-xs text-slate-400">Complete endpoint catalog with authentication requirements.</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-800 rounded-2xl overflow-hidden">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono">
                      <tr>
                        <th className="p-3">Method</th>
                        <th className="p-3">Endpoint</th>
                        <th className="p-3">Description</th>
                        <th className="p-3">Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      <tr>
                        <td className="p-3"><span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">POST</span></td>
                        <td className="p-3 font-mono text-slate-200">/api/auth/register</td>
                        <td className="p-3 text-slate-400">Create company & admin account</td>
                        <td className="p-3 text-slate-400">Public</td>
                      </tr>
                      <tr>
                        <td className="p-3"><span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">POST</span></td>
                        <td className="p-3 font-mono text-slate-200">/api/auth/login</td>
                        <td className="p-3 text-slate-400">Authenticate credentials & set cookies</td>
                        <td className="p-3 text-slate-400">Public</td>
                      </tr>
                      <tr>
                        <td className="p-3"><span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded font-mono font-bold">GET</span></td>
                        <td className="p-3 font-mono text-slate-200">/api/projects</td>
                        <td className="p-3 text-slate-400">Fetch tenant construction projects</td>
                        <td className="p-3 text-slate-400">All Authenticated</td>
                      </tr>
                      <tr>
                        <td className="p-3"><span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">POST</span></td>
                        <td className="p-3 font-mono text-slate-200">/api/attendance/mark</td>
                        <td className="p-3 text-slate-400">QR attendance with duplicate guard</td>
                        <td className="p-3 text-slate-400">Admin, Engineer, Labour</td>
                      </tr>
                      <tr>
                        <td className="p-3"><span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded font-mono font-bold">GET</span></td>
                        <td className="p-3 font-mono text-slate-200">/api/invoices</td>
                        <td className="p-3 text-slate-400">Fetch versioned immutable invoices</td>
                        <td className="p-3 text-slate-400">Admin, Client</td>
                      </tr>
                      <tr>
                        <td className="p-3"><span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">POST</span></td>
                        <td className="p-3 font-mono text-slate-200">/api/expenses</td>
                        <td className="p-3 text-slate-400">Log site expense ($10k cap for engineers)</td>
                        <td className="p-3 text-slate-400">Admin, Engineer</td>
                      </tr>
                      <tr>
                        <td className="p-3"><span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">POST</span></td>
                        <td className="p-3 font-mono text-slate-200">/api/ai/report</td>
                        <td className="p-3 text-slate-400">Synthesize raw notes into daily report</td>
                        <td className="p-3 text-slate-400">Admin, Engineer</td>
                      </tr>
                      <tr>
                        <td className="p-3"><span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">POST</span></td>
                        <td className="p-3 font-mono text-slate-200">/api/ai/chat</td>
                        <td className="p-3 text-slate-400">Grounded Q&A over database records</td>
                        <td className="p-3 text-slate-400">All Authenticated</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 9. Database Schema */}
            {activeTopic === "database-schema" && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Database className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Database & Prisma Schema Models</h2>
                    <p className="text-xs text-slate-400">PostgreSQL relational models configured with Prisma ORM v5.22.</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-slate-300">
                  <p>Key models defined in <code>prisma/schema.prisma</code>:</p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-400">
                    <li><strong className="text-white">Company:</strong> Root tenant organization entity.</li>
                    <li><strong className="text-white">User:</strong> Scoped users with roles (<code>SUPER_ADMIN</code>, <code>ADMIN</code>, <code>ENGINEER</code>, <code>LABOUR</code>, <code>CLIENT</code>).</li>
                    <li><strong className="text-white">Project:</strong> Projects with budget, priority, and progress percentage.</li>
                    <li><strong className="text-white">Invoice & Payment:</strong> Versioned immutable documents with transaction ledgers.</li>
                    <li><strong className="text-white">Material & Supplier:</strong> Inventory tracking and verified supplier directories.</li>
                    <li><strong className="text-white">SiteIncident:</strong> OSHA & site safety compliance records.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* 10. Security & RBAC */}
            {activeTopic === "security-rbac" && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Security & 5-Tier RBAC Matrix</h2>
                    <p className="text-xs text-slate-400">Strict multi-tenant cryptographic query isolation.</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs text-slate-300">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Multi-Tenant Isolation Guarantee
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    All API routes extract authenticated session context using <code>getAuthContext(req)</code>. Database operations are strictly constrained to <code>{`{ where: { companyId } }`}</code>, preventing cross-tenant leakage.
                  </p>
                </div>
              </div>
            )}

            {/* 11. FAQ & Troubleshooting */}
            {activeTopic === "faq" && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Frequently Asked Questions</h2>
                    <p className="text-xs text-slate-400">Common questions regarding system features and usage.</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-slate-300">
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                    <p className="font-bold text-white">How do I switch between different company accounts?</p>
                    <p className="text-slate-400">Click your profile badge in the top header, select &quot;Sign Out / Switch Account&quot;, and log in with your other company credentials.</p>
                  </div>
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                    <p className="font-bold text-white">Can an engineer log an expense higher than $10,000?</p>
                    <p className="text-slate-400">No. The system enforces an engineer expense cap of $10,000. Expenses exceeding $10,000 require Company Admin approval.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 px-4 sm:px-8 text-center text-xs text-slate-500 space-y-2">
        <p className="font-medium text-slate-400">
          AI Construction ERP — Built & Authored by <strong className="text-slate-200">Sidra Raza</strong>
        </p>
        <p>© 2026 Sidra Raza. All Rights Reserved.</p>
      </footer>

      {/* Auth Modal */}
      <UserAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
