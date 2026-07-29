# 🏗️ AI Construction ERP — Next-Gen Multi-Tenant Construction Platform

AI Construction ERP is a full-stack, enterprise-grade Construction Resource Planning (ERP) platform powered by AI. Designed to serve construction firms, civil engineers, contractors, real estate developers, skilled workers, and project investors across the globe, it provides complete end-to-end management of construction sites, workforce attendance, material inventory, financial billing, multi-channel payment processing, and AI-driven site intelligence.

Built on a **Multi-Tenant SaaS Architecture**, millions of independent businesses and users can register their accounts, store their clients and site data securely in 100% private database vaults, and access isolated dashboards without any cross-tenant data leakage.

---

## 🌟 Key Features & Capabilities

### 1. 🏗️ Multi-Project Portfolio Management
- Track active, planned, and completed construction projects in real-time.
- Live dynamic calculation of project progress percentage (`progressPct`), budget consumption, and priority badges.
- Assign engineers, foreman leads, masons, and fixers to site project teams.

### 2. 📱 QR Check-In & Daily Site Workforce Tracking
- QR-code scan check-in for site workers and manual roster overrides.
- Automated daily workforce summaries: Total Workers, Present Today, Late Entry, and Absent count.
- Integrated with staff payroll calculation for attendance-based salary deductions.

### 3. 🧱 Material Inventory & Procurement Engine
- Monitor stock levels for cement, steel, aggregates, electrical, and plumbing items.
- Automatic reorder alerts when inventory drops below safety thresholds.
- Supplier management with vendor rating system (5.0 scale) and auto-purchase orders.

### 4. 💵 Financial Billing, Quotations, & Multi-Channel Payments
- **Quotation Generator:** Create custom estimates with custom Quotation IDs, initial statuses (`SENT`, `PENDING`, `DRAFT`, `APPROVED`, `REJECTED`), and full editing capabilities.
- **Immutable Invoices:** Generate versioned invoices (`v1.0`, `v2.0` on void/reissue) for transparent financial audit trails.
- **Multi-Channel Payment Recording:** Support for **Naqad Cash**, **Bank Wire / Online Transfer**, **Bank Cheque / Pay Order**, **JazzCash Wallet**, **EasyPaisa Wallet**, and **Stripe POS**.
- Upload receipt slips, cheque numbers, and transaction references for immutable payment verification.

### 5. 🤖 AI Intelligence Studio
- **Daily Site Report Formatter:** Converts raw civil engineer field notes into formal, structured daily site reports.
- **Project Cost & Timeline Estimator:** Calculates budget projections, material quantities, and target completion dates using AI heuristics.
- **AI Quotation Drafts:** Generates draft estimates requiring Admin sign-off (Constitution §2.3 compliance).
- **Grounded AI Assistant:** Interactive Q&A over site logs, material stocks, and financial records.

### 6. 👥 Multi-Tenant SaaS Architecture & User Directory
- Strict data isolation per company (`where: { companyId }`).
- Visitor profile onboarding modal from the header toolbar.
- User directory managing Administrators, Civil Engineers, Skilled Workers, and Clients with password authentication.

### 7. 👑 Super Admin Platform Owner Control Center
- Platform owner global dashboard monitoring all registered tenant accounts.
- Displays tenant company names, geographical country locations (Pakistan, UAE, USA, Saudi Arabia, etc.), subscription plans (`FREE`, `PRO`, `ENTERPRISE`), total active users, and system operational metrics.

---

## 🎯 How Different Roles Benefit from AI Construction ERP

| User Role | Main Benefits & Features | Access Path |
|---|---|---|
| **Company Admin / Contractor** | Full operational control over projects, materials, suppliers, quotations, invoices, multi-channel payment receipts, staff directory, and payroll. | `/admin/dashboard` |
| **Civil Site Engineer** | Mobile field interface for daily QR attendance logging, site expense entry, material requests, and instant AI daily report formatting. | `/engineer/dashboard` |
| **Client / Real Estate Investor** | Live visibility into project milestone completion, dynamic progress percentages, invoice history, and project approval requests. | `/client/dashboard` |
| **Skilled Worker / Labour** | Fast QR badge self-check-in, daily site assignment verification, and automated payroll slip generation. | `/admin/attendance` |
| **Platform Owner (Super Admin)** | High-level control center overseeing all registered companies, geographical distribution by country, global user counts, and SaaS subscription tiers. | `/admin/super-admin` |

---

## 🛠️ Technology Stack

- **Core & Runtime:** Node.js, Next.js 16 (App Router), React 19, TypeScript
- **Styling & Aesthetics:** Tailwind CSS v4, Lucide Icons, Glassmorphism UI Design System, Custom Theme Provider (Dark/Light mode)
- **Database & ORM:** Prisma ORM 5.x, SQLite (development) / PostgreSQL (production)
- **Validation & Security:** Zod payload validation schemas, SHA256 password hashing, RBAC permission guards

---

## 📁 Repository Structure

```
ai-construction-erp/
├── README.md               # Root Project Overview & Platform Architecture (This file)
├── frontend/               # Full-Stack Next.js Application
│   ├── app/                # App Router (Pages & API Routes)
│   │   ├── admin/          # Admin & Super Admin Pages
│   │   ├── api/            # Backend API Route Handlers
│   │   ├── client/         # Client / Investor Portal
│   │   └── engineer/       # Civil Engineer Mobile Field Interface
│   ├── components/         # Reusable UI Components (Sidebar, Header, ThemeProvider, Toast)
│   ├── lib/                # Database & Auth Context Helpers
│   ├── prisma/             # Database Schema & Seeding Scripts
│   ├── services/           # Backend Business Logic Services
│   ├── README.md           # Frontend Documentation & UI Guide
│   └── package.json
└── backend/                # Backend Architecture & API Specifications
    └── README.md           # Backend Documentation & Database API Guide
```

---

## 🚀 Quick Start Guide

### 1. Clone & Navigate to Frontend Directory
```bash
git clone https://github.com/SidraRaza/ai-construction-erp.git
cd ai-construction-erp/frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file inside `frontend/`:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-development-secret-key-at-least-32-chars-long"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Push Database Schema & Seed Demo Accounts
```bash
npx prisma db push
npx prisma db seed
```

### 5. Start Development Server
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

## 🔑 Pre-Configured Demo Accounts (Password: `Password123!`)

- **Platform Owner (Super Admin):** `owner@buildcorp.com`
- **Company Admin:** `admin@buildcorp.com`
- **Civil Engineer:** `engineer@buildcorp.com`
- **Labour Lead:** `labour@buildcorp.com`
- **Client Representative:** `client@buildcorp.com`

---

## 📄 Documentation Links
- [Frontend Documentation (`frontend/README.md`)](file:///D:/ai-construction-erp/frontend/README.md)
- [Backend API & Database Documentation (`backend/README.md`)](file:///D:/ai-construction-erp/backend/README.md)
