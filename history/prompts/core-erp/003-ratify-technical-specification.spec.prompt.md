---
id: 003
title: Ratify AI Construction ERP Technical Specification v1.0
stage: spec
date: 2026-07-27
surface: agent
model: Gemini 3.6 Flash
feature: core-erp
branch: main
user: ahed8
command: none
labels: ["spec", "prisma", "api-contracts", "requirements"]
links:
  spec: specs/core-erp/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/core-erp/spec.md
  - history/prompts/core-erp/003-ratify-technical-specification.spec.prompt.md
tests:
  - none
---

## Prompt

# 📐 AI Construction ERP — Technical Specification

**Version:** 1.0
**Companion to:** `AI-Construction-ERP-Constitution.md`
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

## Response snapshot

Ratified the Technical Specification v1.0 and wrote the specs to `specs/core-erp/spec.md`.

## Outcome

- ✅ Impact: Established core Technical Specification v1.0 including full Prisma models, API contracts, functional/non-functional criteria, and acceptance test boundaries.
- 🧪 Tests: None
- 📁 Files: Saved specs/core-erp/spec.md, history/prompts/core-erp/003-ratify-technical-specification.spec.prompt.md
- 🔁 Next prompts: Generate architectural plan (/sp.plan) and task list (/sp.tasks) for Phase 1.
- 🧠 Reflection: Comprehensive spec ratified. Ready to proceed with execution contract.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
