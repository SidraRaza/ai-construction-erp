---
id: 002
title: Ratify AI Construction ERP Project Constitution v1.0
stage: constitution
date: 2026-07-27
surface: agent
model: Gemini 3.6 Flash
feature: none
branch: main
user: ahed8
command: none
labels: ["constitution", "ratification", "governance"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
  - history/prompts/constitution/002-ratify-project-constitution.constitution.prompt.md
tests:
  - none
---

## Prompt

# 📜 AI Construction ERP — Project Constitution

**Version:** 1.0
**Type:** Enterprise SaaS Product
**Architecture:** Full-Stack Application — Next.js (App Router) + TypeScript + Tailwind CSS, single codebase (frontend UI + backend API via Route Handlers, no separate backend service)
**Status:** Foundational Governing Document

> This document is the single source of truth for scope, architecture, roles, rules, and standards of the AI Construction ERP. Every feature, PR, and decision should be traceable back to something written here. If a new idea doesn't fit here, this document gets amended first — not the other way around.

---

## 1. Vision Statement

A single platform where a construction company can run its entire operation — projects, people, materials, money, and clients — with AI reducing the manual paperwork (reports, estimates, quotations) that normally eats an engineer's or admin's day.

**Primary objective:** Replace WhatsApp groups, Excel sheets, and paper site-diaries with one connected system.

**Secondary objective:** Serve as a flagship, portfolio-grade product demonstrating full-stack + AI engineering at an enterprise standard.

---

## 2. Core Principles (Non-Negotiable)

1. **Role isolation is sacred.** No role ever sees or touches data outside its permission boundary — enforced at the API layer, not just hidden in the UI.
2. **Every write is audited.** Any create/update/delete on a business entity (project, expense, invoice, attendance) writes an Activity Log entry. No silent mutations.
3. **Money numbers are never AI-generated without human confirmation.** AI can *draft* an estimate/quotation; a human (Admin) must approve before it becomes official and billable.
4. **One tenant = one company.** The system is multi-tenant from day one (Super Admin manages multiple companies); no shortcuts that assume a single company.
5. **Mobile-first for field roles.** Engineer, Labour, and Client roles must work well on a phone browser — they are not sitting at a desk.
6. **Offline tolerance for attendance/progress.** Site connectivity is unreliable; attendance and progress updates should queue and sync rather than fail outright.
7. **PDFs and invoices are immutable once issued.** An issued invoice/quotation is never edited in place — corrections create a new version, preserving the paper trail.

---

## 3. User Roles & Permission Matrix

| Capability | Super Admin | Admin | Engineer | Labour | Client |
|---|---|---|---|---|---|
| Manage companies/subscriptions | ✅ | ❌ | ❌ | ❌ | ❌ |
| Create/manage users | ✅ (all) | ✅ (own company) | ❌ | ❌ | ❌ |
| Create/manage projects | ❌ | ✅ | ❌ | ❌ | ❌ |
| Assign engineers/labour | ❌ | ✅ | ❌ | ❌ | ❌ |
| Submit daily progress | ❌ | ❌ | ✅ | ❌ | ❌ |
| Upload site images/videos | ❌ | ❌ | ✅ | ❌ | ❌ |
| Mark own attendance | ❌ | ❌ | ✅ | ✅ | ❌ |
| Mark labour attendance (bulk) | ❌ | ✅ | ✅ | ❌ | ❌ |
| Create quotations/invoices | ❌ | ✅ | ❌ | ❌ | ❌ |
| Record expenses | ❌ | ✅ | ✅ (own site, capped) | ❌ | ❌ |
| View project progress | ✅ | ✅ | ✅ (assigned) | ❌ | ✅ (own project) |
| Download invoices | ❌ | ✅ | ❌ | ❌ | ✅ (own) |
| View payment history | ❌ | ✅ | ❌ | ❌ | ✅ (own) |
| Access AI tools | ✅ | ✅ | ✅ (reports only) | ❌ | ❌ (chat assistant only) |

This matrix is the contract for `middleware.ts` and every API route guard — implement RBAC checks directly against this table.

---

## 4. Authentication & Security

- **Methods:** Email/Password, Google OAuth, OTP (phone/email), Forgot/Reset Password
- **Session:** Auth.js with JWT access tokens + rotating refresh tokens
- **Password policy:** bcrypt/argon2 hashing, min 8 chars, breach-check optional
- **Rate limiting:** on `/api/auth/*` to prevent brute force / OTP spam
- **RBAC middleware:** every protected route checks `role` + `companyId` (tenant scoping) before touching data
- **Audit trail:** login attempts, password resets, and role changes are logged

---

## 5. Tech Stack

| Layer | Choice |
|---|---|
| Frontend | Next.js (App Router), React, TypeScript, Tailwind CSS, Shadcn UI |
| Backend | Next.js Route Handlers, Prisma ORM, PostgreSQL |
| Auth | Auth.js (NextAuth) |
| File Storage | Cloudinary (images), UploadThing / S3-compatible (documents) |
| AI | OpenAI API |
| Charts | Recharts |
| Payments | Stripe (+ manual Cash/Bank/JazzCash/EasyPaisa logging) |
| Email | Resend |
| Hosting | Vercel (frontend), Neon PostgreSQL (DB), GitHub Actions (CI) |

---

## 6. Folder Structure

```
src/
 ├── app/                # routes (App Router), grouped by role: (admin)/(engineer)/(client)/(auth)
 ├── components/         # shared UI components (Shadcn-based)
 ├── features/           # feature-sliced modules (projects, attendance, invoices, ai...)
 ├── hooks/               # shared React hooks
 ├── lib/                 # db client, auth config, third-party clients (openai, stripe, cloudinary)
 ├── prisma/              # schema.prisma, migrations, seed
 ├── services/             # business logic layer (called by route handlers & server actions)
 ├── actions/              # Next.js server actions
 ├── utils/                # generic helpers (formatting, PDF, date)
 ├── types/                # shared TypeScript types
 ├── validations/          # zod schemas per entity
 └── middleware.ts         # RBAC + tenant + auth guard
```

**Rule:** business logic lives in `services/`, never directly inside route handlers or components. Route handlers/actions stay thin — validate input, call service, return response.

---

## 7. Database Schema (Core Tables)

```
Company        (id, name, logo, address, taxNumber, bankDetails, subscriptionPlan, status)
User           (id, companyId, name, email, phone, passwordHash, role, status, avatar)
Project        (id, companyId, clientId, name, startDate, endDate, budget, status, priority, progressPct)
ProjectTeam    (projectId, userId, roleOnProject)          # engineers/labour assigned to a project
Client         (id, companyId, name, contact, email, address)
Employee       (id, userId, salary, joinDate, designation)
Attendance     (id, userId, projectId, date, status[Present/Absent/Late/HalfDay], method[QR/Manual])
Material       (id, companyId, name, unit, stockQty, reorderLevel, supplierId)
Supplier       (id, companyId, name, contact)
Expense        (id, companyId, projectId, category[Fuel/Salary/Material/Transport/Misc], amount, date, addedBy)
Quotation      (id, companyId, clientId, projectId, items[json], gst, discount, notes, status, pdfUrl, version)
Invoice        (id, companyId, clientId, projectId, quotationId, amount, status[Paid/Pending/Partial], dueDate, pdfUrl, version)
Payment        (id, invoiceId, amount, method[Cash/Bank/JazzCash/EasyPaisa/Stripe], date, reference)
Document       (id, companyId, projectId, type[PDF/Image/Video/Contract], url, uploadedBy)
Notification   (id, userId, type[Email/SMS/Push], message, read, createdAt)
ActivityLog    (id, companyId, userId, action, entityType, entityId, meta[json], createdAt)
DailyReport    (id, projectId, engineerId, rawInput, aiGeneratedReport, date)
```

**Relational notes:**
- Every table with company-owned data carries `companyId` for tenant isolation.
- `Quotation` → `Invoice` is one-directional (an invoice can reference the quotation it came from); both are versioned, never edited destructively.
- `ActivityLog` is append-only.

---

## 8. API Structure

```
/api/auth          → login, register, otp, forgot-password, reset-password, refresh
/api/companies      → (Super Admin) CRUD + subscription management
/api/users          → CRUD, role assignment
/api/clients        → CRUD, linked projects/invoices
/api/projects       → CRUD, team assignment, progress updates
/api/attendance     → mark, bulk-mark, QR-check-in, history
/api/materials      → CRUD, stock adjustments, supplier links
/api/expenses       → CRUD, filter by project/category
/api/quotations     → create, add-items, generate-pdf, versioning
/api/invoices       → generate, status update, generate-pdf
/api/payments       → record, list by invoice/client
/api/documents      → upload, list, delete
/api/notifications  → send, list, mark-read
/api/ai/report      → engineer note → polished report
/api/ai/estimate    → project description → cost estimate
/api/ai/quotation   → scope description → draft quotation
/api/ai/chat        → client/admin Q&A over project data
```

Every route: `zod` validation → RBAC/tenant check → `services/` call → typed response.

---

## 9. Modules (Functional Scope)

1. **Company Profile** — logo, name, address, tax number, bank details
2. **Employee Management** — add/edit/delete, salary, role, attendance, leaves
3. **Client Management** — clients, their projects, invoices, payments, documents
4. **Project Management** — create, dates, budget, status, priority, progress %, team assignment
5. **Labour Attendance** — QR + manual, Present/Absent/Late/Half-day
6. **Material Management** — cement, steel, sand, bricks, inventory, stock, suppliers
7. **Expense Tracker** — fuel, salary, material, transport, misc
8. **Quotation Generator** — items, GST, discount, notes, PDF export
9. **Invoice Generator** — generate, status (Paid/Pending/Partial)
10. **Payments** — Cash, Bank, JazzCash, EasyPaisa, Stripe
11. **Documents** — PDF, images, videos, contracts
12. **Notifications** — Email, SMS, Push

---

## 10. AI Features

| Feature | Input | Output |
|---|---|---|
| AI Daily Report | Engineer's short note ("Today completed slab work") | Polished, professional construction progress report |
| AI Cost Estimator | Project description ("5 Marla House") | Material cost, labour cost, timeline, total cost |
| AI Quotation Generator | Scope description ("Kitchen Renovation") | Structured quotation draft (pending Admin approval) |
| AI Chat Assistant | Natural-language question ("Project kab complete hoga?") | Answer grounded in that project's actual data |

**Rule from Section 2.3 applies here:** AI outputs for estimates/quotations are always drafts requiring Admin sign-off before becoming official.

---

## 11. Dashboard

**Cards:** Projects, Revenue, Expenses, Employees, Attendance, Clients, Pending Payments, Completed Projects

**Charts (Recharts):** Revenue Chart, Expense Chart, Project Status, Labour Graph

---

## 12. Extra / Portfolio-Grade Features

- 🌙 Dark/Light Mode
- 🌍 Multi-language (English/Urdu)
- 📱 Fully Responsive
- 📄 PDF Export
- 📊 Analytics Dashboard
- 🔍 Global Search
- 📝 Audit Logs
- 📈 Activity Timeline
- 📂 Role-Based Access Control (RBAC)

---

## 13. Development Phases (Suggested Roadmap)

**Phase 1 — Foundation**
Auth (email/Google/OTP), RBAC middleware, Company/User models, base dashboard shell.

**Phase 2 — Core Operations**
Project Management, Employee Management, Client Management, Attendance.

**Phase 3 — Money Flow**
Expense Tracker, Quotation Generator, Invoice Generator, Payments.

**Phase 4 — Materials & Documents**
Material Management, Document uploads, Notifications.

**Phase 5 — AI Layer**
Daily Report AI, Cost Estimator AI, Quotation AI, Chat Assistant.

**Phase 6 — Polish**
Dark mode, multi-language, global search, analytics dashboard, audit logs, activity timeline.

*Build in this order — each phase depends on tables/auth from the one before it. Don't start AI features before the data they summarize actually exists.*

---

## 14. Amendment Rule

Any structural change (new role, new module, new table) requires updating this document in the same PR that introduces the code. This file drifting out of sync with the codebase is treated as a bug.

## Response snapshot

Ratified the AI Construction ERP Project Constitution v1.0 and updated `.specify/memory/constitution.md`.

## Outcome

- ✅ Impact: Established Project Constitution v1.0 as single source of truth in `.specify/memory/constitution.md`.
- 🧪 Tests: N/A
- 📁 Files: Updated `.specify/memory/constitution.md`, created `history/prompts/constitution/002-ratify-project-constitution.constitution.prompt.md`
- 🔁 Next prompts: Phase 1 planning & specification (Auth, RBAC, Data Models, Base Shell).
- 🧠 Reflection: Successfully ingested and saved constitution file.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
