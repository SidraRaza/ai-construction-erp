# 🎨 AI Construction ERP — Frontend Documentation & UI Guide

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
- **`/admin/invoices`** — Financial Billing & Payments Engine (Create/edit quotations, immutable invoices, multi-channel payment proof modal: Cash, Bank Wire, Cheque, JazzCash, EasyPaisa, Stripe).
- **`/admin/employees`** — Staff & User Directory (Registered database users, role badges, automated monthly payroll calculator).
- **`/admin/contracts`** — Subcontractor Agreements (Trade contract milestones, start/end dates, contract amounts).
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
  - Sun/Moon Theme Switcher Button (Toggles `html.light` & `html.dark` modes with `localStorage` persistence)
  - Live Database Activity Notifications Dropdown (Fetches `/api/activity-log` with relative time indicators)
  - Onboard Profile Visitor Modal Button
  - User Avatar & Role Badge

- **`Sidebar` ([`components/navigation/sidebar.tsx`](file:///D:/ai-construction-erp/frontend/components/navigation/sidebar.tsx)):**
  - Dynamic navigation links scoped to user role (`ADMIN`, `ENGINEER`, `CLIENT`, `SUPER_ADMIN`).
  - Active route highlighting with ambient amber glow borders.

- **`ThemeProvider` ([`components/theme-provider.tsx`](file:///D:/ai-construction-erp/frontend/components/theme-provider.tsx)):**
  - Context provider applying theme class mutations to `document.documentElement`.

- **`ToastProvider` ([`components/ui/toast-provider.tsx`](file:///D:/ai-construction-erp/frontend/components/ui/toast-provider.tsx)):**
  - Global notification toast system for success, error, warning, and info alerts.

---

## 🛠️ Setup & Development Commands

```bash
# Install Node dependencies
npm install

# Start local Next.js development server
npm run dev

# Compile TypeScript production build
npm run build

# Start production server
npm start
```
