# 📐 AI Construction ERP — Technical Specification

**Version:** 1.0
**Companion to:** `.specify/memory/constitution.md`
**Architecture:** Full-Stack Next.js (App Router) + TypeScript + Tailwind CSS — one codebase serves both the UI and the API (via Route Handlers/Server Actions); Prisma + PostgreSQL as the data layer underneath
**Purpose:** Exact schema, API contracts, and functional/non-functional requirements needed to start building — no ambiguity left for implementation decisions.

---

## 1. Prisma Schema (Field-Level)

```prisma
enum Role {
  SUPER_ADMIN
  ADMIN
  ENGINEER
  LABOUR
  CLIENT
}

enum ProjectStatus {
  PLANNED
  IN_PROGRESS
  ON_HOLD
  COMPLETED
  CANCELLED
}

enum AttendanceStatus {
  PRESENT
  ABSENT
  LATE
  HALF_DAY
}

enum InvoiceStatus {
  PAID
  PENDING
  PARTIAL
}

enum PaymentMethod {
  CASH
  BANK
  JAZZCASH
  EASYPAISA
  STRIPE
}

model Company {
  id               String   @id @default(cuid())
  name             String
  logoUrl          String?
  address          String?
  taxNumber        String?
  bankDetails      String?
  subscriptionPlan String   @default("FREE")
  status           String   @default("ACTIVE")
  createdAt        DateTime @default(now())
  users            User[]
  projects         Project[]
  clients          Client[]
}

model User {
  id           String   @id @default(cuid())
  companyId    String
  company      Company  @relation(fields: [companyId], references: [id])
  name         String
  email        String   @unique
  phone        String?
  passwordHash String?
  role         Role
  status       String   @default("ACTIVE")
  avatarUrl    String?
  createdAt    DateTime @default(now())
}

model Project {
  id           String        @id @default(cuid())
  companyId    String
  clientId     String
  name         String
  startDate    DateTime
  endDate      DateTime?
  budget       Decimal
  status       ProjectStatus @default(PLANNED)
  priority     String        @default("MEDIUM")
  progressPct  Int           @default(0)
  createdAt    DateTime      @default(now())
  team         ProjectTeam[]
  expenses     Expense[]
  quotations   Quotation[]
  invoices     Invoice[]
}

model ProjectTeam {
  id         String @id @default(cuid())
  projectId  String
  userId     String
  roleOnProject String
}

model Client {
  id        String   @id @default(cuid())
  companyId String
  name      String
  contact   String?
  email     String?
  address   String?
}

model Attendance {
  id        String            @id @default(cuid())
  userId    String
  projectId String
  date      DateTime
  status    AttendanceStatus
  method    String            // QR | MANUAL
  markedBy  String?
}

model Material {
  id            String @id @default(cuid())
  companyId     String
  name          String
  unit          String
  stockQty      Decimal
  reorderLevel  Decimal
  supplierId    String?
}

model Expense {
  id         String   @id @default(cuid())
  companyId  String
  projectId  String
  category   String   // FUEL | SALARY | MATERIAL | TRANSPORT | MISC
  amount     Decimal
  date       DateTime
  addedById  String
  note       String?
}

model Quotation {
  id         String   @id @default(cuid())
  companyId  String
  clientId   String
  projectId  String?
  items      Json
  gstPct     Decimal  @default(0)
  discount   Decimal  @default(0)
  notes      String?
  status     String   @default("DRAFT") // DRAFT | SENT | APPROVED | REJECTED
  pdfUrl     String?
  version    Int      @default(1)
  createdAt  DateTime @default(now())
}

model Invoice {
  id          String        @id @default(cuid())
  companyId   String
  clientId    String
  projectId   String?
  quotationId String?
  amount      Decimal
  status      InvoiceStatus @default(PENDING)
  dueDate     DateTime?
  pdfUrl      String?
  version     Int           @default(1)
  createdAt   DateTime      @default(now())
}

model Payment {
  id        String        @id @default(cuid())
  invoiceId String
  amount    Decimal
  method    PaymentMethod
  date      DateTime
  reference String?
}

model Document {
  id          String   @id @default(cuid())
  companyId   String
  projectId   String?
  type        String   // PDF | IMAGE | VIDEO | CONTRACT
  url         String
  uploadedById String
  createdAt   DateTime @default(now())
}

model Notification {
  id        String   @id @default(cuid())
  userId    String
  type      String   // EMAIL | SMS | PUSH
  message   String
  read      Boolean  @default(false)
  createdAt DateTime @default(now())
}

model ActivityLog {
  id         String   @id @default(cuid())
  companyId  String
  userId     String
  action     String
  entityType String
  entityId   String
  meta       Json?
  createdAt  DateTime @default(now())
}

model DailyReport {
  id               String   @id @default(cuid())
  projectId        String
  engineerId       String
  rawInput         String
  aiGeneratedReport String
  date             DateTime @default(now())
}
```

---

## 2. API Contracts (Request / Response)

### 2.1 Auth

**POST `/api/auth/register`**
```json
// Request
{ "name": "string", "email": "string", "password": "string", "companyId": "string" }
// Response 201
{ "userId": "string", "email": "string", "role": "ADMIN" }
```

**POST `/api/auth/login`**
```json
// Request
{ "email": "string", "password": "string" }
// Response 200
{ "accessToken": "jwt", "refreshToken": "jwt", "user": { "id": "string", "role": "Role" } }
```

**POST `/api/auth/otp/request`** → `{ "phoneOrEmail": "string" }` → `{ "sent": true }`
**POST `/api/auth/otp/verify`** → `{ "phoneOrEmail": "string", "code": "string" }` → `{ "accessToken": "jwt" }`
**POST `/api/auth/refresh`** → `{ "refreshToken": "jwt" }` → `{ "accessToken": "jwt" }`
**POST `/api/auth/forgot-password`** → `{ "email": "string" }` → `{ "sent": true }`
**POST `/api/auth/reset-password`** → `{ "token": "string", "newPassword": "string" }` → `{ "success": true }`

### 2.2 Projects

**POST `/api/projects`** *(Admin only)*
```json
// Request
{ "name": "string", "clientId": "string", "startDate": "ISO", "endDate": "ISO", "budget": 500000, "priority": "HIGH" }
// Response 201
{ "id": "string", "status": "PLANNED", "progressPct": 0 }
```

**GET `/api/projects?status=&clientId=&page=`** → paginated list, scoped by `companyId` + role (Engineer sees only assigned, Client sees only own)

**PATCH `/api/projects/:id`** → partial update, writes `ActivityLog`

**POST `/api/projects/:id/team`** → `{ "userId": "string", "roleOnProject": "string" }` → assigns engineer/labour

### 2.3 Attendance

**POST `/api/attendance/mark`**
```json
{ "userId": "string", "projectId": "string", "status": "PRESENT", "method": "QR" }
```

**POST `/api/attendance/bulk`** *(Admin/Engineer)*
```json
{ "projectId": "string", "date": "ISO", "records": [{ "userId": "string", "status": "PRESENT" }] }
```

### 2.4 Quotations & Invoices

**POST `/api/quotations`**
```json
{ "clientId": "string", "projectId": "string", "items": [{ "desc": "Cement bags", "qty": 50, "rate": 1200 }], "gstPct": 17, "discount": 0 }
```
Response includes computed `subtotal`, `gstAmount`, `total`, and `pdfUrl` after generation.

**POST `/api/quotations/:id/approve`** *(Admin only — required before AI-drafted quotations become official, per Constitution §2.3)*

**POST `/api/invoices/from-quotation/:quotationId`** → generates invoice, `version: 1`, status `PENDING`

**POST `/api/invoices/:id/void-and-reissue`** → never edits in place; creates `version: N+1`, marks old as `VOIDED`

### 2.5 AI Endpoints

**POST `/api/ai/report`**
```json
// Request
{ "projectId": "string", "rawInput": "Today completed slab work" }
// Response
{ "report": "string (formatted, professional)" }
```

**POST `/api/ai/estimate`**
```json
{ "description": "5 Marla House" }
// Response
{ "materialCost": 0, "labourCost": 0, "estimatedDays": 0, "totalCost": 0, "breakdown": [] }
```

**POST `/api/ai/quotation`**
```json
{ "description": "Kitchen Renovation" }
// Response → draft Quotation object, status: "DRAFT" — requires human approval before send
```

**POST `/api/ai/chat`**
```json
{ "projectId": "string", "question": "Project kab complete hoga?" }
// Response
{ "answer": "string", "groundedOn": ["Project.endDate", "Project.progressPct"] }
```

---

## 3. Functional Requirements (per Module)

| Module | Must-have | Should-have |
|---|---|---|
| Company Profile | CRUD company info, logo upload | Multiple bank accounts |
| Employee Mgmt | CRUD, role assignment, attendance link | Leave approval workflow |
| Client Mgmt | CRUD, linked projects/invoices | Client portal self-signup |
| Project Mgmt | CRUD, team assignment, progress % | Gantt/timeline view |
| Attendance | Manual + QR mark, daily summary | Geo-fenced check-in |
| Material Mgmt | Stock CRUD, low-stock alert | Auto purchase-order suggestion |
| Expense Tracker | CRUD by category/project | Budget-vs-actual alerts |
| Quotation | Items, GST, discount, PDF | Multi-currency |
| Invoice | Generate from quotation, status | Auto payment reminders |
| Payments | Manual log + Stripe | Partial payment scheduling |
| Documents | Upload/list/delete by project | Version history per doc |
| Notifications | Email on key events | SMS + Push |

---

## 4. Non-Functional Requirements

- **Multi-tenancy:** every query filtered by `companyId`; cross-tenant data leak = critical bug
- **Performance:** dashboard cards/charts load < 2s for up to 500 projects per company
- **Security:** RBAC enforced server-side on every route; rate-limited auth endpoints; signed URLs for document access
- **Auditability:** every mutating request produces one `ActivityLog` row
- **PDF generation:** Quotations/Invoices rendered server-side (e.g. `@react-pdf/renderer` or Puppeteer), stored in object storage, `pdfUrl` persisted — never regenerated on the fly for an already-issued document
- **Internationalization:** all UI strings externalized for English/Urdu from day one, not retrofitted later
- **Offline tolerance:** Attendance/progress submission from Engineer/Labour queues locally and syncs on reconnect

---

## 5. Acceptance Criteria (Sample — Attendance Module)

- [ ] Engineer can mark their own attendance via QR scan in < 3 taps
- [ ] Admin can bulk-mark labour attendance for a project in one submission
- [ ] Attendance record cannot be created for a date outside the project's start/end range
- [ ] Duplicate attendance for same user + date + project is rejected, not silently overwritten
- [ ] Attendance summary (Present/Absent/Late/Half-day count) reflects on dashboard within the same request cycle
