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
  FileText,
  Lock,
  HelpCircle,
  Zap,
  Bot,
  Building2,
  Truck,
  Package,
  Calendar,
  CreditCard,
  QrCode,
  DollarSign,
  UserCheck,
  Download,
  Share2,
  Sun,
  Moon,
  MessageCircle,
  Eye,
  PlusCircle,
  Sliders,
  Compass,
} from "lucide-react";

export default function DocsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTopic, setActiveTopic] = useState<string>("user-onboarding");
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

  const topics = [
    { id: "user-onboarding", name: "1. Account & Login Guide", icon: UserCheck, badge: "Start Here" },
    { id: "admin-dashboard", name: "2. Admin Dashboard & Projects", icon: Building2, badge: "Admin" },
    { id: "materials-suppliers", name: "3. Materials & Suppliers", icon: Package, badge: "Inventory" },
    { id: "quotations-invoices", name: "4. Quotations, Invoices & Payments", icon: Receipt, badge: "Billing" },
    { id: "payroll-attendance", name: "5. Attendance & Staff Payroll", icon: Calendar, badge: "Payroll" },
    { id: "engineer-portal", name: "6. Site Engineer Field Portal", icon: HardHat, badge: "Site Field" },
    { id: "client-portal", name: "7. Client Transparency Portal", icon: Users, badge: "Client" },
    { id: "custom-fields", name: "8. Custom Production Fields", icon: SlidersHorizontal, badge: "Settings" },
    { id: "ai-studio", name: "9. AI Studio & Estimations", icon: Bot, badge: "AI Tools" },
    { id: "super-admin", name: "10. Owner Portal (Super Admin)", icon: Crown, badge: "Owner" },
    { id: "tips-tricks", name: "11. PDF, WhatsApp & Tips", icon: Share2, badge: "Helpful" },
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
            User Guide (Docs)
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
                    <p className="text-[10px] text-slate-400 font-normal">Global platform overview</p>
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
                    <p className="text-[10px] text-slate-400 font-normal">Projects, payroll, inventory & billing</p>
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
                    <p className="text-[10px] text-slate-400 font-normal">QR attendance & AI daily reports</p>
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
                    <p className="text-slate-100">Client Portal</p>
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
          <Link href="/docs" onClick={() => setIsMobileNavOpen(false)} className="block text-sm font-bold text-amber-400 py-1">User Guide (Docs)</Link>
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

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Title & Live Search */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold font-mono">
            <BookOpen className="w-3.5 h-3.5" /> COMPLETE USER & WEBSITE GUIDE
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            How to Use AI Construction ERP
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Step-by-step visual instructions on how to navigate the website, manage construction projects, track inventory, issue invoices, run AI daily reports, and calculate payroll.
          </p>

          {/* Quick Search */}
          <div className="relative max-w-xl mx-auto pt-2">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search website guides (e.g., how to create invoice, QR scan, add materials)..."
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Documentation Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Left Sidebar Topic Navigation */}
          <div className="lg:col-span-1 bg-slate-900/80 border border-slate-800 rounded-3xl p-4 space-y-2 sticky top-20 shadow-xl overflow-x-auto">
            <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              User Guide Modules
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
            {/* 1. Account & Login Guide */}
            {activeTopic === "user-onboarding" && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">1. Account Creation, Login & Profile Management</h2>
                    <p className="text-xs text-slate-400">How to register your construction business and manage your secure account.</p>
                  </div>
                </div>

                <div className="space-y-5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <PlusCircle className="w-4 h-4 text-amber-400" /> How to Register a New Company Account
                    </h4>
                    <ol className="list-decimal pl-5 space-y-2 text-slate-300">
                      <li>Click the amber <strong>&quot;Register / Login&quot;</strong> button in the top-right corner of the website.</li>
                      <li>In the popup modal, select the <strong>&quot;Register Company&quot;</strong> tab.</li>
                      <li>Type your <strong>Company Name</strong> (e.g. <em>Vertex Construction Corp</em>).</li>
                      <li>Enter your <strong>Full Name</strong>, your <strong>Email</strong>, and create a secure <strong>Password</strong>.</li>
                      <li>Click <strong>&quot;Create Company Account&quot;</strong>.</li>
                      <li>You will instantly be logged in to your private company dashboard with full Admin capabilities!</li>
                    </ol>
                  </div>

                  <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <Lock className="w-4 h-4 text-emerald-400" /> Auto-Safety 1-Hour Session Timer
                    </h4>
                    <p className="text-xs text-slate-400">
                      For site safety and financial security, your session remains active for 1 hour. If inactive, the system securely locks to prevent unauthorized changes on open site laptops or phones. You can easily re-enter your password to continue working.
                    </p>
                  </div>

                  <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-blue-400" /> How to Edit Your Profile & Company Information
                    </h4>
                    <ol className="list-decimal pl-5 space-y-2 text-slate-300">
                      <li>Click your profile avatar/name in the top header.</li>
                      <li>Select <strong>&quot;Edit Profile & Company&quot;</strong> from the dropdown menu.</li>
                      <li>Update your phone number, official company tax number, office address, or country.</li>
                      <li>Click <strong>&quot;Save Changes&quot;</strong>.</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Admin Dashboard & Projects */}
            {activeTopic === "admin-dashboard" && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">2. Admin Dashboard & Project Management</h2>
                    <p className="text-xs text-slate-400">How to create construction projects, allocate budgets, and assign site teams.</p>
                  </div>
                </div>

                <div className="space-y-5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4 text-amber-400" /> Reading the Executive Overview
                    </h4>
                    <p className="text-xs text-slate-400">
                      Navigate to <code>/admin/dashboard</code>. The top KPI cards summarize your <strong>Active Projects</strong>, <strong>Workers On Site Today</strong>, <strong>Material Alerts</strong>, and <strong>Total Invoiced Revenue</strong>. The interactive charts show monthly cashflow and project burn rates in real-time.
                    </p>
                  </div>

                  <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <PlusCircle className="w-4 h-4 text-emerald-400" /> How to Create a New Construction Project
                    </h4>
                    <ol className="list-decimal pl-5 space-y-2 text-slate-300">
                      <li>Click <strong>&quot;Projects&quot;</strong> in the left sidebar menu (or visit <code>/admin/projects</code>).</li>
                      <li>Click the top-right amber button <strong>&quot;+ Create New Project&quot;</strong>.</li>
                      <li>Fill out the project details:
                        <ul className="list-disc pl-5 mt-1 text-slate-400 space-y-1">
                          <li><strong>Project Name:</strong> (e.g. <em>Skyline Luxury Towers - Phase 1</em>)</li>
                          <li><strong>Total Capital Budget ($):</strong> (e.g. <em>$1,500,000</em>)</li>
                          <li><strong>Priority:</strong> Choose <em>Low, Medium, High, or Urgent</em>.</li>
                          <li><strong>Start & Target Completion Dates</strong>.</li>
                        </ul>
                      </li>
                      <li>Click <strong>&quot;Save Project&quot;</strong>.</li>
                      <li>Click on any project card to assign Site Engineers, Foreman Leads, and Mason Supervisors to the site team!</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Materials & Suppliers */}
            {activeTopic === "materials-suppliers" && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">3. Materials Inventory & Verified Suppliers</h2>
                    <p className="text-xs text-slate-400">How to track cement, steel rebars, sand, and manage vendor ratings.</p>
                  </div>
                </div>

                <div className="space-y-5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <Package className="w-4 h-4 text-amber-400" /> How to Add Materials & Set Reorder Alerts
                    </h4>
                    <ol className="list-decimal pl-5 space-y-2 text-slate-300">
                      <li>Go to <strong>&quot;Materials Inventory&quot;</strong> in the sidebar (<code>/admin/materials</code>).</li>
                      <li>Click <strong>&quot;+ Add Material&quot;</strong>.</li>
                      <li>Enter item name (e.g. <em>Portland Cement Grade 53</em>, <em>Grade 60 Steel Rebars</em>).</li>
                      <li>Select the unit (<em>Bags, Tons, Cubic Meters, Meters, Pieces</em>).</li>
                      <li>Set your <strong>Initial Stock Quantity</strong> and <strong>Reorder Safety Threshold</strong> (e.g. 100 bags).</li>
                      <li>Whenever stock falls below your threshold, the system displays an amber <strong>&quot;Low Stock Alert&quot;</strong> so your site never runs out of concrete or steel.</li>
                    </ol>
                  </div>

                  <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <Truck className="w-4 h-4 text-blue-400" /> Managing Suppliers & Quality Ratings
                    </h4>
                    <ol className="list-decimal pl-5 space-y-2 text-slate-300">
                      <li>Go to <strong>&quot;Suppliers & Procurement&quot;</strong> (<code>/admin/suppliers</code>).</li>
                      <li>Click <strong>&quot;+ Add Supplier&quot;</strong>.</li>
                      <li>Enter vendor company name, contact person, phone number, and category (<em>Steel, Cement, Aggregates, Electrical, Equipment</em>).</li>
                      <li>Rate the supplier on a 5-star scale to maintain high procurement quality for your firm.</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Quotations, Invoices & Payments */}
            {activeTopic === "quotations-invoices" && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Receipt className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">4. Quotations, Invoices & Multi-Channel Payments</h2>
                    <p className="text-xs text-slate-400">How to create estimates, generate immutable invoices, and record payments.</p>
                  </div>
                </div>

                <div className="space-y-5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-400" /> How to Create a Quotation
                    </h4>
                    <ol className="list-decimal pl-5 space-y-2 text-slate-300">
                      <li>Go to <strong>&quot;Quotations & Invoices&quot;</strong> in the sidebar (<code>/admin/invoices</code>).</li>
                      <li>Click <strong>&quot;+ Create Quotation&quot;</strong>.</li>
                      <li>Choose the client and project, add line items (e.g. <em>Site Excavation, Piling, Shuttering</em>), specify quantity and unit rates.</li>
                      <li>Set status to <em>DRAFT, SENT, or APPROVED</em>.</li>
                    </ol>
                  </div>

                  <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-emerald-400" /> Issuing Invoices & Financial Versioning
                    </h4>
                    <p className="text-xs text-slate-400">
                      When a quotation is approved, you can click <strong>&quot;Issue Invoice&quot;</strong>. The invoice receives an immutable version number (<code>v1.0</code>). If an invoice is reissued or modified, it advances to <code>v2.0</code>, keeping earlier records intact for financial audit compliance.
                    </p>
                  </div>

                  <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-purple-400" /> How to Record a Client Payment
                    </h4>
                    <ol className="list-decimal pl-5 space-y-2 text-slate-300">
                      <li>On the invoice row, click the green <strong>&quot;Record Payment&quot;</strong> button.</li>
                      <li>Enter the received amount (e.g. $350,000).</li>
                      <li>Select the Payment Channel:
                        <ul className="list-disc pl-5 mt-1 text-slate-400 space-y-1">
                          <li><strong>Cash:</strong> Direct on-site cash transaction.</li>
                          <li><strong>Bank Wire Transfer:</strong> Interbank online transfer with transaction reference #.</li>
                          <li><strong>Bank Cheque / Pay Order:</strong> Cheque number and deposit date.</li>
                          <li><strong>JazzCash / EasyPaisa:</strong> Mobile wallet payments.</li>
                          <li><strong>Stripe:</strong> Credit or debit card POS.</li>
                        </ul>
                      </li>
                      <li>Click <strong>&quot;Save Payment&quot;</strong>. The invoice automatically marks as <code>PAID</code>!</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}

            {/* 5. Attendance & Payroll */}
            {activeTopic === "payroll-attendance" && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">5. Daily Attendance & Staff Payroll</h2>
                    <p className="text-xs text-slate-400">How to track worker attendance and calculate monthly salaries with deductions.</p>
                  </div>
                </div>

                <div className="space-y-5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-amber-400" /> Daily Attendance Oversight
                    </h4>
                    <p className="text-xs text-slate-400">
                      Navigate to <code>/admin/attendance</code>. The top summary cards show <strong>Total Workforce</strong>, <strong>Present Today</strong>, <strong>Late Entries</strong>, and <strong>Absent Workers</strong>. Admins can bulk-mark attendance for full subcontractor teams with 1 click.
                    </p>
                  </div>

                  <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-emerald-400" /> Automated Monthly Payroll Calculation
                    </h4>
                    <ol className="list-decimal pl-5 space-y-2 text-slate-300">
                      <li>Go to <strong>&quot;Staff & Payroll&quot;</strong> (<code>/admin/employees</code>).</li>
                      <li>Select the month (e.g. <em>August 2026</em>) and click <strong>&quot;Calculate Monthly Payroll&quot;</strong>.</li>
                      <li>The system computes base salary minus days absent to calculate net salary payouts.</li>
                      <li>Click <strong>&quot;Print Payroll Statement&quot;</strong> or export to PDF for easy disbursement.</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}

            {/* 6. Site Engineer Field Portal */}
            {activeTopic === "engineer-portal" && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <HardHat className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">6. Civil Site Engineer Field Portal</h2>
                    <p className="text-xs text-slate-400">Mobile and tablet interface for on-site engineers, QR scanning, and AI reporting.</p>
                  </div>
                </div>

                <div className="space-y-5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <Bot className="w-4 h-4 text-amber-400" /> How to Generate an AI Daily Site Report
                    </h4>
                    <ol className="list-decimal pl-5 space-y-2 text-slate-300">
                      <li>Log into <code>/engineer/dashboard</code> on your mobile phone or tablet.</li>
                      <li>In the <strong>&quot;Today&apos;s Site Notes&quot;</strong> text box, type your raw observations (e.g. <em>&quot;Poured 45 cubic meters concrete on 2nd floor columns, 28 masons present, passed slump test, delayed 1 hour due to rain&quot;</em>).</li>
                      <li>(Optional) Click <strong>&quot;Attach Site Photo&quot;</strong> to snap or upload a picture.</li>
                      <li>Click the amber button <strong>&quot;Synthesize AI Daily Site Report&quot;</strong>.</li>
                      <li>The AI instantly formats your raw notes into a formal, structured daily progress report with sections for Executed Work, Material Utilization, Delays, and Tomorrow&apos;s Plan!</li>
                    </ol>
                  </div>

                  <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-emerald-400" /> Worker QR Check-In with Duplicate Guard
                    </h4>
                    <p className="text-xs text-slate-400">
                      Click <strong>&quot;Scan Worker QR&quot;</strong> to scan worker badge cards. If you scan a worker who was already checked in today, the system alerts you immediately, preventing double attendance.
                    </p>
                  </div>

                  <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-purple-400" /> Logging Site Expenses ($10,000 Safety Cap)
                    </h4>
                    <p className="text-xs text-slate-400">
                      Click <strong>&quot;Log Site Expense&quot;</strong> to submit field payments for fuel, equipment repair, or emergency materials up to <strong>$10,000</strong>. Amounts above $10,000 require Company Admin approval.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 7. Client Transparency Portal */}
            {activeTopic === "client-portal" && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">7. Client & Property Investor Portal</h2>
                    <p className="text-xs text-slate-400">Live milestone progress, PDF statements, and AI project support chat.</p>
                  </div>
                </div>

                <div className="space-y-5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <Eye className="w-4 h-4 text-amber-400" /> 1. Live Project Progress Tracking
                    </h4>
                    <p className="text-xs text-slate-400">
                      Clients navigate to <code>/client/dashboard</code> to view live progress percentages (e.g. 25% completed), milestone completion dates, and project priorities.
                    </p>
                  </div>

                  <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <Download className="w-4 h-4 text-emerald-400" /> 2. Invoices & PDF Statements
                    </h4>
                    <p className="text-xs text-slate-400">
                      In <code>/client/invoices</code>, clients can view paid and pending invoices. Click <strong>&quot;Preview PDF&quot;</strong> to inspect or download official billing statements.
                    </p>
                  </div>

                  <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <Bot className="w-4 h-4 text-purple-400" /> 3. Grounded AI Support Chat
                    </h4>
                    <p className="text-xs text-slate-400">
                      Clients can open <code>/client/ai</code> and ask: <em>&quot;When will the foundation piling be completed?&quot;</em> The AI reads live site logs and gives an accurate, plain-language answer.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 8. Custom Production Fields */}
            {activeTopic === "custom-fields" && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <SlidersHorizontal className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">8. Custom Production Fields (No Code Required)</h2>
                    <p className="text-xs text-slate-400">How to create custom data fields tailored to your unique construction business.</p>
                  </div>
                </div>

                <div className="space-y-5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <PlusCircle className="w-4 h-4 text-amber-400" /> How to Create Custom Fields
                    </h4>
                    <ol className="list-decimal pl-5 space-y-2 text-slate-300">
                      <li>Go to <strong>&quot;Custom Production Fields&quot;</strong> in the sidebar (<code>/admin/custom-fields</code>).</li>
                      <li>Click <strong>&quot;+ Create Custom Field&quot;</strong>.</li>
                      <li>Enter the Field Label (e.g. <em>Concrete Pour Temperature (°C)</em>, <em>Slump Test Result</em>, <em>Excavator Batch #</em>).</li>
                      <li>Choose the Field Type:
                        <ul className="list-disc pl-5 mt-1 text-slate-400 space-y-1">
                          <li><strong>TEXT:</strong> General names or codes.</li>
                          <li><strong>NUMBER:</strong> Quantities, temperatures, cubic meters.</li>
                          <li><strong>DATE:</strong> Inspection deadlines or concrete curing dates.</li>
                          <li><strong>SELECT:</strong> Dropdown lists (e.g. <em>Passed, Failed, Retest</em>).</li>
                          <li><strong>CHECKBOX:</strong> Safety check flags (e.g. <em>Lead Inspector Approved</em>).</li>
                        </ul>
                      </li>
                      <li>Click <strong>&quot;Create Field&quot;</strong>. This custom field will now appear on all your site production forms automatically!</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}

            {/* 9. AI Studio */}
            {activeTopic === "ai-studio" && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">9. AI Intelligence Studio & Cost Estimations</h2>
                    <p className="text-xs text-slate-400">How to use AI tools for instant budget estimations and quotation drafting.</p>
                  </div>
                </div>

                <div className="space-y-5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" /> AI Project Cost & Timeline Estimator
                    </h4>
                    <ol className="list-decimal pl-5 space-y-2 text-slate-300">
                      <li>Go to <strong>&quot;AI Studio&quot;</strong> (<code>/admin/ai</code>).</li>
                      <li>Select project size (e.g. <em>5 Marla, 10 Marla, 1 Kanal, or Multi-Story Commercial</em>).</li>
                      <li>Click <strong>&quot;Estimate Cost & Timeline&quot;</strong>.</li>
                      <li>The AI calculates material quantities (cement bags, steel tons, sand m³), estimated timeline in days, and total budget breakdown!</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}

            {/* 10. Super Admin */}
            {activeTopic === "super-admin" && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Crown className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">10. Platform Owner Control Center (Super Admin)</h2>
                    <p className="text-xs text-slate-400">How platform founder Sidra Raza monitors global platform metrics.</p>
                  </div>
                </div>

                <div className="space-y-5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <div className="p-5 bg-slate-950/80 rounded-2xl border border-amber-500/30 space-y-3">
                    <h4 className="font-bold text-amber-400 text-sm flex items-center gap-2">
                      <Lock className="w-4 h-4" /> Unlocking the Owner Vault
                    </h4>
                    <p className="text-xs text-slate-400">
                      Navigate to <code>/admin/super-admin</code>. Enter the Super Admin owner credentials. Once inside, you can inspect total registered construction companies, user counts, geographical locations by country, active subscription plans, and user feedback submissions.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 11. Tips & Tricks */}
            {activeTopic === "tips-tricks" && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Share2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">11. PDF Downloads, WhatsApp Sharing & Helpful Tips</h2>
                    <p className="text-xs text-slate-400">Convenient shortcuts to speed up daily site communication.</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-slate-300">
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">1-Click WhatsApp Sharing</h4>
                      <p className="text-xs text-slate-400">On any quotation or invoice, click <strong>&quot;Share to WhatsApp&quot;</strong> to send an formatted summary directly to your client&apos;s phone.</p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                      <Download className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">High-Resolution PDF Downloads</h4>
                      <p className="text-xs text-slate-400">Click <strong>&quot;Download PDF&quot;</strong> on invoices or daily reports to save print-ready documents for site binders and client meetings.</p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                      <Sun className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">Dark / Light Mode Toggle</h4>
                      <p className="text-xs text-slate-400">Click the Sun/Moon icon in the top header to switch between Dark Mode (ideal for night shifts) and Light Mode (ideal for bright outdoor sunlight on site).</p>
                    </div>
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
