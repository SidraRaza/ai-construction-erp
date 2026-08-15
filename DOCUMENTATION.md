# 📚 AI Construction ERP — Complete System & User Documentation

> **Platform Founder & Lead Architect:** **Sidra Raza**  
> **Official Repository:** [https://github.com/SidraRaza/ai-construction-erp.git](https://github.com/SidraRaza/ai-construction-erp.git)  
> **Live Production URL:** [https://ai-construction-erp-eight.vercel.app](https://ai-construction-erp-eight.vercel.app)

---

## 📑 Table of Contents

1. [System Architecture & Multi-Tenant Design](#1-system-architecture--multi-tenant-design)
2. [Quickstart & Local Installation](#2-quickstart--local-installation)
3. [User Role Guides & Step-by-Step Walkthroughs](#3-user-role-guides--step-by-step-walkthroughs)
   - [A. Company Admin & Contractor Guide](#a-company-admin--contractor-guide)
   - [B. Civil Site Engineer Guide](#b-civil-site-engineer-guide)
   - [C. Client & Property Investor Guide](#c-client--property-investor-guide)
   - [D. Platform Owner (Super Admin) Guide](#d-platform-owner-super-admin-guide)
4. [Core Features in Detail](#4-core-features-in-detail)
   - [Projects & Team Assignment](#projects--team-assignment)
   - [QR Attendance & Duplicate Prevention](#qr-attendance--duplicate-prevention)
   - [Material Inventory & Reorder Thresholds](#material-inventory--reorder-thresholds)
   - [Quotations, Immutable Invoices & Payments](#quotations-immutable-invoices--payments)
   - [Capped Field Expense Logging](#capped-field-expense-logging)
   - [Self-Configurable Custom Production Fields](#self-configurable-custom-production-fields)
   - [AI Intelligence Studio (Daily Reports, Cost Estimations, Chat)](#ai-intelligence-studio)
5. [Complete API Reference Manual](#5-complete-api-reference-manual)
6. [Database Schema & Prisma Models](#6-database-schema--prisma-models)
7. [Security & Role-Based Access Control (RBAC)](#7-security--role-based-access-control-rbac)
8. [Frequently Asked Questions (FAQ) & Troubleshooting](#8-frequently-asked-questions-faq--troubleshooting)

---

## 1. System Architecture & Multi-Tenant Design

AI Construction ERP is built on a **Tenant-Isolated Multi-Tenant Architecture**.

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js 16 App Router                    │
│   (Turbopack + Edge Middleware + TypeScript + Tailwind CSS) │
└──────────────────────────────┬──────────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               │  Edge Security & Auth Guards  │
               │ (Cookies: erp_session, role)  │
               └───────────────┬───────────────┘
                               │
    ┌──────────────────────────┼──────────────────────────┐
    ▼                          ▼                          ▼
Admin Portal            Engineer Portal            Client Portal
(/admin/*)             (/engineer/dashboard)     (/client/dashboard)
    │                          │                          │
    └──────────────────────────┼──────────────────────────┘
                               │
                ┌──────────────┴──────────────┐
                │ getAuthContext(req) Guard   │
                │ (CompanyId Data Isolation)  │
                └──────────────┬──────────────┘
                               │
                ┌──────────────┴──────────────┐
                │     Prisma ORM (v5.22)      │
                │  Neon Serverless PostgreSQL │
                └─────────────────────────────┘
```

### Multi-Tenant Isolation Guarantee
Every organization receives a unique `companyId`. All database queries, mutation endpoints, and storage files are strictly filtered by `{ where: { companyId } }`. One company cannot view, search, modify, or infer another company's records.

---

## 2. Quickstart & Local Installation

### Prerequisites
- **Node.js**: `v18.18.0` or higher (Node.js 20+ recommended)
- **npm** or **pnpm**
- **Git**
- **Neon / PostgreSQL Database** connection URL

### 1. Clone the Repository
```bash
git clone https://github.com/SidraRaza/ai-construction-erp.git
cd ai-construction-erp/frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in `frontend/.env`:
```env
DATABASE_URL="postgresql://user:password@ep-cool-db.us-east-2.aws.neon.tech/neondb?sslmode=require"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
JWT_SECRET="your-super-secret-jwt-key"
```

### 4. Initialize Database & Seed Authentic Records
```bash
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
```

### 5. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 3. User Role Guides & Step-by-Step Walkthroughs

---

### A. Company Admin & Contractor Guide

The Company Admin portal provides executive control over physical site operations and financial ledgers.

```
Dashboard Navigation: /admin/dashboard
```

#### 1. Account Onboarding & Setup
1. Visit the home page and click **"Register or Login"**.
2. Select the **Register** tab, enter your **Company Name**, your full name, email, password, and phone number.
3. Click **Create Company Account**. You will immediately be logged in with full `ADMIN` authority.

#### 2. Managing Projects
- Navigate to **Projects** (`/admin/projects`).
- Click **"+ Create New Project"**.
- Fill in:
  - **Project Name** (e.g., *Skyline Luxury Towers - Phase 1*)
  - **Capital Budget** (e.g., `$1,500,000`)
  - **Priority** (`LOW`, `MEDIUM`, `HIGH`, `URGENT`)
- Click **Save Project**.
- **Assign Team Members:** Click on any project card to assign Site Lead Engineers, Foremen, or Mason Leads.

#### 3. Material Inventory & Automatic Alerts
- Navigate to **Materials** (`/admin/materials`).
- View real-time stock levels of Cement, Steel Rebars, Sand, Aggregates, and Pipes.
- If stock falls below the **Reorder Level**, an amber badge `Low Stock Alert` triggers automatically.
- Click **"+ Add Material"** to register new construction inventory items with custom units (`Bags`, `Tons`, `Cubic Meters`, `Meters`, `Pieces`).

#### 4. Managing Verified Suppliers
- Navigate to **Suppliers** (`/admin/suppliers`).
- Add suppliers by category (`CEMENT`, `STEEL`, `AGGREGATES`, `ELECTRICAL`, `EQUIPMENT`).
- Rate vendors on a 5.0 scale to maintain quality procurement standards.

#### 5. Quotations, Invoices & Recording Payments
- Navigate to **Quotations & Invoices** (`/admin/invoices`).
- **Create Quotations:** Set custom quotation IDs, itemize line rates with quantity, and set statuses (`DRAFT`, `SENT`, `APPROVED`).
- **Issue Invoices:** When a quotation is approved, generate an immutable invoice (`v1.0`).
- **Record Multi-Channel Payments:** Click **"Record Payment"** on any invoice and choose from:
  - `CASH` (Naqad Cash)
  - `BANK_TRANSFER` (Online Wire / Interbank)
  - `CHEQUE` (Bank Pay Order)
  - `JAZZCASH` / `EASYPAISA` (Mobile Wallets)
  - `STRIPE` (Credit/Debit Card)
- The invoice will immediately update from `PENDING` to `PAID`.

#### 6. Custom Production Fields
- Navigate to **Custom Production Fields** (`/admin/custom-fields`).
- Define custom attributes (e.g., *Concrete Temperature (°C)*, *Batch Truck Plate #*, *Slump Test Passed*).
- Field inputs dynamically render in production logging forms across the company.

---

### B. Civil Site Engineer Guide

The Site Engineer portal is optimized for high-speed field operations on mobile phones and tablets.

```
Dashboard Navigation: /engineer/dashboard
```

#### 1. Daily Site Progress & AI Synthesizer
1. Open the **Field Operations Command** dashboard.
2. In **Today's Site Notes**, type raw notes:
   > *"Poured 45 cubic meters concrete on 2nd floor columns, passed slump test, 28 workers allocated."*
3. (Optional) Click **Attach Site Progress Photo** to upload site pictures.
4. Click **"Synthesize AI Daily Site Report"**.
5. The AI automatically compiles a polished, professional daily report formatted with executed milestones, quality inspections, and tomorrow's action plan.

#### 2. Worker QR Check-In
1. Click **"Scan Worker QR"**.
2. Scan the worker's badge or select their name to record daily attendance (`PRESENT`, `LATE`, `HALF_DAY`, `ABSENT`).
3. **Duplicate Prevention:** If attendance is already marked for today, the system alerts you immediately.

#### 3. Logging Capped Field Expenses
1. Click **"Log Site Expense"**.
2. Enter the amount and category (e.g., `$4,500` for *Concrete vibrator repair & fuel*).
3. **Safety Guard:** Expenses logged by engineers are capped at **$10,000**. Entries exceeding $10,000 require Admin approval.

---

### C. Client & Property Investor Guide

The Client Portal provides complete transparency without granting access to internal contractor costs.

```
Dashboard Navigation: /client/dashboard
```

#### 1. Real-Time Milestone & Budget Tracking
- View dynamic project completion progress bars (`progressPct`) and scheduled completion dates.
- Click **"Ask AI Status Update"** to get an immediate, plain-language summary of site activities.

#### 2. Invoices & PDF Statements
- Navigate to **Invoices & Receipts** (`/client/invoices`).
- Review paid and pending invoice balances.
- Click **"Preview PDF"** on any invoice to view and download official billing statements.

#### 3. Document Vault
- Navigate to **Documents** (`/client/documents`).
- Download architectural master blueprints, environmental compliance certificates, and approved structural agreements.

#### 4. Grounded AI Support Assistant
- Navigate to **AI Support Chat** (`/client/ai`).
- Ask questions like:
  > *"When will the 3rd floor slab be ready for inspection?"*
- The AI answers using verified database milestones and logs.

---

### D. Platform Owner (Super Admin) Guide

The Super Admin portal is reserved exclusively for the platform owner to inspect global system health.

```
Dashboard Navigation: /admin/super-admin
```

#### 1. Entering the Super Admin Vault
1. Navigate to `/admin/super-admin`.
2. Enter the Super Admin password.
3. Access the global command center.

#### 2. Global Tenant Oversight
- **Global Overview Cards:** Total registered companies, total users, active projects, and system health status.
- **Tenant Directory:** Inspect company subscription plans, creation dates, user counts, and geographical locations.
- **Feedback Inbox:** Read user reviews, bug reports, and feature requests submitted via the home page.

---

## 4. Core Features in Detail

### Projects & Team Assignment
- **Status Lifecycle:** `PLANNED` ➔ `IN_PROGRESS` ➔ `ON_HOLD` ➔ `COMPLETED` ➔ `CANCELLED`.
- **Dynamic Progress Calculation:** Computes completion percentages based on finished site milestones.

### QR Attendance & Duplicate Prevention
- **Methods:** `QR` Badge Scan or `MANUAL` Roster Entry.
- **Duplicate Guard:** Prevents duplicate self-markings on the same date.
- **Bulk Entry:** Admins can bulk-mark an entire subcontractor workforce in one action.

### Material Inventory & Reorder Thresholds
- **Stock Tracking:** Automatic decrements when materials are checked out for site pours.
- **Threshold Alerts:** If `stockQty <= reorderLevel`, visual warnings trigger across all admin screens.

### Quotations, Immutable Invoices & Payments
- **Versioning Rule:** Any modification or void-reissue increments the version number (`v1.0` ➔ `v2.0`). Previous invoice records remain permanently preserved for financial audits.
- **Supported Payment Gateways:** Cash, Bank Wire, Cheque, JazzCash, EasyPaisa, Stripe.

### Self-Configurable Custom Production Fields
- Supported field types:
  - `TEXT`: Alphanumeric values (e.g., Concrete Batch ID)
  - `NUMBER`: Quantities, temperatures, cubic volumes
  - `DATE`: Pouring dates, inspection deadlines
  - `SELECT`: Custom dropdown options (e.g., Slump Test: Low / Medium / High)
  - `CHECKBOX`: Boolean verification flags (e.g., Structural Engineer Approved)

---

## 5. Complete API Reference Manual

All endpoints require authentication via session cookies (`erp_session`, `x-company-id`, `erp_role`).

### Authentication & Profiles
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new company and admin user |
| `POST` | `/api/auth/login` | Authenticate user credentials & set cookies |
| `POST` | `/api/auth/reset-password` | Securely reset password with bcrypt hashing |
| `GET` | `/api/users/me` | Retrieve active user profile |
| `PUT` | `/api/users/me` | Update name, company name, phone, or country |
| `GET` | `/api/users` | List company staff members (Admin only) |

### Projects & Workforce
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/projects` | Fetch company projects (scoped by role) |
| `POST` | `/api/projects` | Create a new construction project |
| `POST` | `/api/projects/:id/team` | Assign a staff member to project team |
| `GET` | `/api/attendance` | Fetch today's workforce attendance records |
| `POST` | `/api/attendance/mark` | Mark individual worker attendance via QR |
| `POST` | `/api/attendance/bulk` | Bulk mark attendance for labour teams |
| `POST` | `/api/payroll` | Compute attendance-based monthly payroll |

### Materials & Procurement
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/materials` | Fetch company material inventory |
| `POST` | `/api/materials` | Create a new material inventory record |
| `GET` | `/api/suppliers` | List verified construction suppliers |
| `POST` | `/api/suppliers` | Register a new supplier with category & rating |

### Financials, Quotations & Invoices
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/quotations` | Fetch company quotations |
| `POST` | `/api/quotations` | Create a new quotation |
| `PUT` | `/api/quotations/:id` | Update quotation status or items |
| `GET` | `/api/invoices` | List versioned invoices |
| `GET` | `/api/payments` | Fetch payment transaction ledgers |
| `POST` | `/api/payments` | Record a payment against an invoice |
| `GET` | `/api/expenses` | List site operational expenses |
| `POST` | `/api/expenses` | Log a site expense (capped at $10k for engineers) |
| `GET` | `/api/contracts` | Fetch subcontractor contracts |
| `POST` | `/api/contracts` | Create a new subcontractor trade contract |

### AI Intelligence Services
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/ai/report` | Synthesize raw engineer site notes into daily report |
| `POST` | `/api/ai/estimate` | Generate AI cost and timeline estimations |
| `POST` | `/api/ai/quotation` | Generate an AI draft quotation scope |
| `POST` | `/api/ai/chat` | Interactive grounded Q&A over database records |

### Super Admin & System
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/super-admin` | Global tenant metrics & audit logs (`SUPER_ADMIN` only) |
| `GET` | `/api/activity-log` | Real-time system activity notification feed |
| `GET` | `/api/search` | Global instant search across projects & invoices |
| `POST` | `/api/feedback` | Submit public platform feedback |
| `GET` | `/api/feedback` | Retrieve feedback list (`SUPER_ADMIN` only) |

---

## 6. Database Schema & Prisma Models

```prisma
model Company {
  id               String       @id @default(cuid())
  name             String
  subscriptionPlan String       @default("FREE")
  status           String       @default("ACTIVE")
  createdAt        DateTime     @default(now())
  users            User[]
  projects         Project[]
  materials        Material[]
  suppliers        Supplier[]
  customFields     CustomField[]
}

model User {
  id           String       @id @default(cuid())
  companyId    String
  name         String
  email        String       @unique
  passwordHash String
  role         String       @default("LABOUR") // SUPER_ADMIN | ADMIN | ENGINEER | LABOUR | CLIENT
  phone        String?
}

model Project {
  id          String        @id @default(cuid())
  companyId   String
  clientId    String
  name        String
  budget      Decimal
  status      String        @default("PLANNED")
  priority    String        @default("MEDIUM")
  progressPct Int           @default(0)
  team        ProjectTeam[]
  expenses    Expense[]
  invoices    Invoice[]
}

model Invoice {
  id          String        @id @default(cuid())
  companyId   String
  clientId    String
  projectId   String?
  amount      Decimal
  status      String        @default("PENDING")
  version     Int           @default(1)
  dueDate     DateTime?
  payments    Payment[]
}

model SiteIncident {
  id          String        @id @default(cuid())
  companyId   String
  projectId   String
  title       String
  severity    String        // LOW | MEDIUM | HIGH | CRITICAL
  category    String        // PPE_VIOLATION | EQUIPMENT_HAZARD | ACCIDENT
  description String
  status      String        @default("OPEN")
  reportedBy  String
}
```

---

## 7. Security & Role-Based Access Control (RBAC)

### 5-Tier Permission Matrix

| Action | Super Admin | Company Admin | Site Engineer | Labour | Client |
|---|:---:|:---:|:---:|:---:|:---:|
| **Platform Oversight** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Manage Company Settings** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Create Projects & Budgets** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Approve Quotations & Invoices** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Log Capped Expenses ($10k max)** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Generate AI Daily Reports** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Scan Worker QR Attendance** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Self QR Check-In** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **View Milestone Progress & Bills** | ✅ | ✅ | ❌ | ❌ | ✅ |
| **Download PDF Statements** | ✅ | ✅ | ❌ | ❌ | ✅ |

---

## 8. Frequently Asked Questions (FAQ) & Troubleshooting

#### Q: How do I switch between different company accounts?
**A:** Click your profile badge in the top-right header, select **"Sign Out / Switch Account"**, and log in with your other company credentials.

#### Q: What happens if an invoice needs to be amended after being issued?
**A:** AI Construction ERP enforces immutable financial versioning. Reissuing an amended invoice increments its version number (e.g. from `v1.0` to `v2.0`). The previous invoice remains stored in the database for financial audit compliance.

#### Q: Can an engineer log an expense higher than $10,000?
**A:** No. The system automatically enforces an engineer expense cap of $10,000. Expenses above $10,000 must be entered or approved by a Company Admin.

#### Q: Is my data safe from other construction firms using the platform?
**A:** Yes, 100%. Every database query and API mutation is isolated by your unique `companyId`. Cross-tenant data inspection is impossible.

---

### 👤 Ownership & License

**Platform Architect:** **Sidra Raza**  
**Repository:** [https://github.com/SidraRaza/ai-construction-erp.git](https://github.com/SidraRaza/ai-construction-erp.git)  
© 2026 Sidra Raza. All Rights Reserved.
