# 🏗️ AI Construction ERP — Full-Stack Documentation & Setup Guide

**Version:** 1.0  
**Architecture:** Full-Stack Next.js (App Router) + TypeScript + Tailwind CSS + Prisma ORM  
**System Architecture Note:** Single unified codebase inside `frontend/` serving both the **Frontend UI** (`app/admin`, `app/engineer`, `app/client`) and the **Backend API Route Handlers** (`app/api/*`).

---

## 🇵🇰 Roman Urdu Guide (Setup Instructions)

### 📌 Project Structure Summary
Yeh project Single Full-Stack Architecture use karta hai:
- **Frontend UI & Pages:** `frontend/app/` (`/admin/dashboard`, `/engineer/dashboard`, `/client/dashboard`, `/`)
- **Backend API Endpoints:** `frontend/app/api/` (`/api/auth/*`, `/api/projects/*`, `/api/attendance/*`, `/api/materials/*`, `/api/suppliers/*`, `/api/expenses/*`, `/api/quotations/*`, `/api/payroll/*`, `/api/contracts/*`, `/api/ai/*`)
- **Database & Prisma Schema:** `frontend/prisma/` (`schema.prisma`, `seed.ts`, SQLite/PostgreSQL)

---

### 🚀 Step-by-Step Run Karne Ka Tariqah

#### Step 1: Frontend Folder Mein Jayein
Terminal open karein aur `frontend` directory mein jayein:
```bash
cd frontend
```

#### Step 2: Environment Variables Set Karein
Check karein ke `frontend/.env` file maujood hai. Agar nahi hai toh naye `.env` banayein:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="development-secret-key-at-least-32-chars-long"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

#### Step 3: Database Setup & Seed Karein
Database schema ko sync karein aur demo accounts load karein:
```bash
# Database tables generate & push karein
npx prisma db push

# Pre-configured demo accounts seed karein
npx prisma db seed
```

#### Step 4: Development Server Start Karein
Development server chalane ke liye run karein:
```bash
npm run dev
```

Browser mein **`http://localhost:3000`** kholain.

---

### 🔑 Demo Account Logins (Password: `Password123!`)

| Role | Email | Password | Allowed Access |
|---|---|---|---|
| **Super Admin** | `superadmin@buildcorp.com` | `Password123!` | All Companies & Super Admin Control |
| **Admin** | `admin@buildcorp.com` | `Password123!` | `/admin/dashboard`, Projects, Materials, Payroll |
| **Engineer** | `engineer@buildcorp.com` | `Password123!` | `/engineer/dashboard`, QR Attendance, Site Notes |
| **Labour Lead** | `labour@buildcorp.com` | `Password123!` | Self QR Check-in |
| **Client** | `client@buildcorp.com` | `Password123!` | `/client/dashboard`, Invoices, Milestone Progress |

---

## 🇬🇧 English Setup & Architecture Guide

### 📐 Tech Stack
- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v4, Lucide React Icons, Shadcn UI
- **Database Layer:** Prisma ORM 5.x (SQLite / PostgreSQL)
- **Validation & Hashing:** Zod payload validation, `bcryptjs` password hashing

---

### 🛠️ Backend API Reference (`frontend/app/api/`)

#### 1. Authentication & Users
- `POST /api/auth/register` — Register company and admin account
- `POST /api/auth/login` — Validate credentials and return session payload
- `GET  /api/users/me` — Fetch current user profile

#### 2. Operations & Project Management
- `GET / POST /api/projects` — Create & list projects (role-scoped)
- `POST /api/projects/[id]/team` — Assign engineer or labour to project
- `POST /api/attendance/mark` — Single & QR code attendance check-in
- `POST /api/attendance/bulk` — Bulk labour attendance entry
- `GET / POST /api/materials` — Stock levels & low-stock reorder warnings
- `GET / POST /api/suppliers` — Vendor contacts & auto purchase-order suggestions
- `GET / POST /api/expenses` — Log expenses ($10k site engineer cap enforced)
- `POST /api/payroll` — Employee salary & attendance deduction calculator
- `POST /api/contracts` — Subcontractor trade agreements & milestones

#### 3. Financials & Immutable Versioning
- `POST /api/quotations` — Create quotation (AI-drafts start as `status: DRAFT`)
- `POST /api/quotations/[id]/approve` — Admin sign-off on draft quotation
- `POST /api/invoices` — Generate invoice (`version: 1`)
- `POST /api/invoices/[id]/void-and-reissue` — Immutable version increment (`version: N+1`)

#### 4. AI Intelligence Studio
- `POST /api/ai/report` — Formats raw engineer field notes into daily site report
- `POST /api/ai/estimate` — Project cost & timeline estimator
- `POST /api/ai/quotation` — AI draft quotation generator
- `POST /api/ai/chat` — Grounded Q&A over project data

#### 5. Search & Compliance
- `GET /api/search?q=` — Tenant-scoped global search across projects, clients, materials
- `GET /api/activity-log` — Audit trail for administrative actions

---

### 🧪 Running Verification Tests
To run the automated empirical test suite (26/26 tests verifying all 8 modules):
```bash
cd frontend
npx tsx scripts/verify-all-functionalities.ts
```

### 🏗️ Building for Production
```bash
cd frontend
npm run build
npm start
```
