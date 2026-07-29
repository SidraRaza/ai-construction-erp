# ⚙️ AI Construction ERP — Backend Architecture & Database API Documentation

This directory contains the Backend API Route Handlers, Database Schemas, Services, and Multi-Tenant Security Architecture for **AI Construction ERP**.

---

## 🏛️ System & Multi-Tenant Data Architecture

The backend operates as a **Single Full-Stack Architecture** integrated within Next.js App Router API Route Handlers (`app/api/*`).

### 🔒 Strict Multi-Tenant Data Isolation
- Every database query (`Project`, `Quotation`, `Invoice`, `Material`, `Supplier`, `Expense`, `User`) is strictly scoped by `companyId`.
- API endpoints resolve the active tenant ID from request context via `getAuthContext(req)` ([`lib/auth-helpers.ts`](file:///D:/ai-construction-erp/frontend/lib/auth-helpers.ts)).
- **Guaranteed Isolation:** User A (Company A) can never view, mutate, or query User B's (Company B) private business data.

---

## 🛠️ API Endpoints Reference (`app/api/*`)

### 1. Authentication & User Management
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new tenant company and administrator profile |
| `POST` | `/api/auth/login` | Authenticate user credentials with SHA256 password hash |
| `GET` | `/api/users` | List all registered users/staff for the tenant company |
| `POST` | `/api/users` | Onboard a new visitor/staff profile into `db.user` |

### 2. Operations & Site Management
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/projects` | Fetch company projects with dynamic `progressPct` and budget |
| `POST` | `/api/projects` | Create a new construction project in database |
| `POST` | `/api/projects/[id]/team` | Assign engineers, foremen, or masons to project team |
| `GET` | `/api/attendance` | Fetch today's workforce site roster |
| `POST` | `/api/attendance/mark` | Mark single QR badge check-in |
| `POST` | `/api/attendance/bulk` | Mark bulk labour attendance roster |
| `GET / POST` | `/api/materials` | Manage material stock levels & reorder level alerts |
| `GET / POST` | `/api/suppliers` | Manage vendor roster, categories, and ratings |
| `GET / POST` | `/api/expenses` | Log site expenses (Enforces $10k engineer cap) |
| `POST` | `/api/payroll` | Automated monthly salary calculator with attendance deductions |
| `GET / POST` | `/api/contracts` | Trade contract agreements & milestone schedules |

### 3. Financials & Payment Proof Receipts
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/quotations` | Fetch project estimates and AI drafts |
| `POST` | `/api/quotations` | Create a new quotation with custom ID & status choice |
| `PUT` | `/api/quotations/[id]` | Update quotation ID, project assignment, status, or amount |
| `GET` | `/api/invoices` | Fetch issued database invoices |
| `GET` | `/api/payments` | Audit trail of recorded payments |
| `POST` | `/api/payments` | Record payment via Naqad Cash, Bank Wire, Cheque, JazzCash, EasyPaisa, Stripe with receipt reference |

### 4. AI Intelligence Studio
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/ai/report` | Formats raw engineer field notes into formal daily site report |
| `POST` | `/api/ai/estimate` | Computes AI project cost & timeline projections |
| `POST` | `/api/ai/quotation` | Generates draft estimate requiring Admin approval |
| `POST` | `/api/ai/chat` | Interactive grounded Q&A over database site logs |

### 5. System Administration & Global Search
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/search` | Tenant-scoped global search across projects, clients, materials |
| `GET` | `/api/activity-log` | Real-time database activity log feed for header notifications |
| `GET` | `/api/super-admin` | Platform owner overview of all tenant companies, countries, and metrics |

---

## 🗄️ Database Schema Models (`schema.prisma`)

```prisma
model Company { id, name, country, subscriptionPlan, status, createdAt }
model User { id, companyId, name, email, phone, passwordHash, role, status, createdAt }
model Project { id, companyId, clientId, name, startDate, endDate, budget, status, priority, progressPct, createdAt }
model ProjectTeam { id, projectId, userId, role, assignedAt }
model Client { id, companyId, name, contact, email, createdAt }
model Material { id, companyId, name, unit, stockQty, reorderLevel, createdAt }
model Inventory { id, materialId, type, qty, supplierId, receivedAt }
model Supplier { id, companyId, name, contact, category, rating, createdAt }
model Expense { id, projectId, category, amount, receiptUrl, createdAt }
model Attendance { id, workerId, date, status, createdAt }
model Quotation { id, companyId, clientId, projectId, items, gstPct, discount, notes, status, version, createdAt }
model Invoice { id, companyId, clientId, projectId, quotationId, amount, dueDate, status, version, createdAt }
model Payment { id, invoiceId, amount, method, reference, date, createdAt }
model ActivityLog { id, companyId, userId, action, entityType, entityId, meta, createdAt }
```

---

## 🧪 Empirical API Verification Test Suite

To run the automated empirical test suite verifying all database services and API endpoints:

```bash
cd frontend
npx tsx scripts/verify-all-functionalities.ts
```
