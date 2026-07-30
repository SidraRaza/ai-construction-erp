# 🎨 AI Construction ERP — Frontend Application Architecture

This directory contains the Next.js App Router frontend application for **AI Construction ERP**. Built with React 19, Next.js 16, TypeScript, Tailwind CSS v4, and Lucide React icons, it features a glassmorphic dark/light UI design system tailored for construction management.

---

## 📱 Page Routes & Role Dashboards

### 1. Public & Onboarding Routes
- **`/`** — Public Landing Page & Onboarding Entry Point.

### 2. Admin Portal (`/admin/*`)
- **`/admin/dashboard`** — Executive Company Overview: Total Budget, Progress Overview, Material Alerts, Activity Log.
- **`/admin/projects`** — Real-Time Project Portfolio Management (Create projects, view dynamic progress `progressPct`, budget, priority).
- **`/admin/attendance`** — Labour Attendance Operations (Daily site workforce roster, QR check-in simulation, status toggles).
- **`/admin/materials`** — Inventory Stock Levels (Stock quantity tracking, unit rates, reorder level warnings, add material modal).
- **`/admin/suppliers`** — Vendor Procurement Roster (Supplier contacts, categories, rating cards, add vendor modal).
- **`/admin/invoices`** — Financial Billing & Payments Engine (Create/edit quotations, immutable invoices, multi-channel payment proof modal).
- **`/admin/employees`** — Staff & User Directory (Registered database users, role badges, automated monthly payroll calculator).
- **`/admin/contracts`** — Subcontractor Agreements (Trade contract milestones, start/end dates, contract amounts).
- **`/admin/custom-fields`** — Self-Configurable Custom Production Fields Engine (Define custom fields, dynamic production form generator).
- **`/admin/ai`** — AI Intelligence Studio (Daily site report formatter, project cost/timeline estimator, AI quotation generator, grounded AI chat).
- **`/admin/super-admin`** — Super Admin Platform Owner Control Center (Global tenant accounts, geographical country distribution, user counts, data isolation status).

### 3. Civil Engineer Mobile Field Portal (`/engineer/*`)
- **`/engineer/dashboard`** — Mobile-optimized site management: QR scanner check-in, daily site log notes, field expense logger, low stock alerts.

### 4. Client / Real Estate Investor Portal (`/client/*`)
- **`/client/dashboard`** — Client milestone progress tracker, budget utilization, site inspection photos.
- **`/client/invoices`** — Client invoice payment history and quotation approval requests.
- **`/client/documents`** — Site architectural blueprints and trade contracts.
- **`/client/ai`** — Client AI Assistant for site status inquiries.

---

## 🎨 UI Components & Design System

- **`Header` ([`components/navigation/header.tsx`](file:///D:/ai-construction-erp/frontend/components/navigation/header.tsx)):**
  - Global Search Input
  - Custom Production Fields Shortcut Button
  - Sun/Moon Theme Switcher Button
  - Live Database Activity Notifications Dropdown
  - Interactive User Avatar Badge & Role Dropdown

- **`Sidebar` ([`components/navigation/sidebar.tsx`](file:///D:/ai-construction-erp/frontend/components/navigation/sidebar.tsx)):**
  - Dynamic navigation links scoped to user role (`ADMIN`, `ENGINEER`, `CLIENT`, `SUPER_ADMIN`).
  - Active route highlighting with ambient amber glow borders.
  - Mobile slide-out navigation drawer with floating trigger button.

- **`RouteGuard` ([`components/auth/route-guard.tsx`](file:///D:/ai-construction-erp/frontend/components/auth/route-guard.tsx)):**
  - Enforces route authorization and session verification across all protected modules.
