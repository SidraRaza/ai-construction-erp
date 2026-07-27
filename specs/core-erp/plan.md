# 🏗️ AI Construction ERP — Architecture & Implementation Plan (Phase 1)

**Feature:** Core ERP & Foundation (Phase 1)  
**Spec Reference:** [`specs/core-erp/spec.md`](file:///D:/ai-construction-erp/specs/core-erp/spec.md)  
**Constitution Reference:** [`.specify/memory/constitution.md`](file:///D:/ai-construction-erp/.specify/memory/constitution.md)  
**Status:** Approved for Implementation

---

## 1. Scope and Dependencies

### 1.1 In Scope (Phase 1 — Foundation)
- **Database & Prisma Layer:** Complete Prisma schema initialization matching Section 1 of Technical Specification (`Company`, `User`, `Project`, `ProjectTeam`, `Client`, `Attendance`, `Material`, `Expense`, `Quotation`, `Invoice`, `Payment`, `Document`, `Notification`, `ActivityLog`, `DailyReport`).
- **Auth & Session Management:** NextAuth / Auth.js integration with Email/Password, JWT access tokens, rotating refresh tokens, OTP endpoints draft, and password reset flows.
- **RBAC & Multi-Tenant Middleware:** Enforce `middleware.ts` route protection checking `role` and `companyId` against the Constitution Permission Matrix.
- **Service Architecture Setup:** Establish `src/services/` layer for decoupled business logic execution (User Service, Tenant Service, Project Service, Auth Service).
- **Base Dashboard Shell:** Layout shells for `(admin)`, `(engineer)`, `(client)`, `(auth)` routes with responsive sidebar, navigation, theme toggle (Dark/Light), and user profile header.

### 1.2 Out of Scope (Phase 1)
- Stripe webhook execution & payment gateway live integration (deferred to Phase 3).
- Live AI completions via OpenAI API (deferred to Phase 5).
- Cloudinary / S3 real asset upload streams (deferred to Phase 4).

### 1.3 External Dependencies
- **Data Layer:** PostgreSQL (Neon Serverless or local PostgreSQL instance) via `@prisma/client`.
- **Framework & UI:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide React icons.
- **Validation & Auth:** `zod` for payload validation, `bcryptjs` / `argon2` for password hashing, `jose` / Auth.js for JWT handling.

---

## 2. Key Decisions and Rationale

| Decision | Option Selected | Trade-offs & Rationale |
|---|---|---|
| **Architecture** | Single Next.js App Router Codebase | Eliminates CORS overhead, simplifies deployment on Vercel, single TypeScript type safety end-to-end. |
| **Service Layer Pattern** | Mandatory `src/services/` Layer | Keeps Route Handlers and Server Actions thin. Business logic and audit logging occur strictly within services. |
| **Tenant Isolation** | Soft Multi-Tenancy (`companyId` column) | `companyId` added to every tenant table. Service helper wrapper automatically injects `companyId` filter to eliminate cross-tenant leak risk. |
| **RBAC Enforcement** | Dual-layer (Middleware + Service Guard) | `middleware.ts` handles path-level checks based on route groups `(admin)`, `(engineer)`, etc. Services execute fine-grained permission assertions. |

---

## 3. Interfaces and API Contracts

### 3.1 Public API Endpoints (Phase 1 Core)

- `POST /api/auth/register` — Initial company & admin user registration
- `POST /api/auth/login` — Authentication & JWT issuing
- `POST /api/auth/refresh` — Access token renewal
- `GET  /api/users/me` — Current authenticated user profile & tenant scope
- `GET  /api/companies/current` — Current company metadata & settings
- `GET  /api/projects` — List projects (scoped by `companyId` and user assignment)

### 3.2 Standard API Response Envelope

```typescript
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
};
```

### 3.3 Error Taxonomy & Status Codes

- `400 Bad Request`: Zod validation failure (`INVALID_PAYLOAD`).
- `401 Unauthorized`: Missing or expired JWT token (`UNAUTHENTICATED`).
- `403 Forbidden`: RBAC role mismatch or tenant mismatch (`FORBIDDEN`).
- `404 Not Found`: Entity missing or belongs to another company (`NOT_FOUND`).
- `409 Conflict`: Duplicate unique entity, e.g., email exists (`ALREADY_EXISTS`).
- `500 Internal Error`: Unhandled server exception (`INTERNAL_ERROR`).

---

## 4. Non-Functional Requirements (NFRs) & Budgets

- **Performance:**
  - Middleware RBAC evaluation: `< 10ms`.
  - Service query latency: `< 100ms` p95.
  - Dashboard shell initial render: `< 1.5s` LCP.
- **Security:**
  - Passwords hashed with `bcryptjs` (cost factor 12).
  - JWT tokens signed with `HS256`/`RS256` secret, expiring in 15 minutes.
  - HTTP-only, Secure, SameSite cookies for refresh tokens.
- **Multi-Tenant Safety:** `100%` of service queries for company entities must require a `companyId` parameter.

---

## 5. Data Management and Migration

- **ORM & Client:** Prisma ORM schema located at `src/prisma/schema.prisma`.
- **Migration Strategy:**
  - Schema changes committed to version control.
  - Applied via `npx prisma migrate dev --name <migration_name>`.
- **Audit Trail:**
  - Append-only `ActivityLog` table populated by service methods on create/update/delete actions:
    `ActivityLog(companyId, userId, action, entityType, entityId, meta, createdAt)`.

---

## 6. Operational Readiness

- **Observability:** Centralized logger module (`src/lib/logger.ts`) formatting console logs with timestamp, environment, context, and trace level.
- **Environment Configuration Guard:** Zod validation schema (`src/lib/env.ts`) checking `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXT_PUBLIC_APP_URL` on boot.
- **Seeding:** `src/prisma/seed.ts` script populating standard Super Admin, demo Company, Admin, Engineer, Labour, Client, and sample Projects.

---

## 7. Risk Analysis and Mitigation

| Risk | Impact | Mitigation Strategy |
|---|---|---|
| Cross-tenant data leakage | High | Prisma service extension (`withTenantScope`) forcing `companyId` condition on all tenant queries. |
| Role escalation via API manipulation | High | Server-side `requireRole()` guard mandatory at the top of every service method and API handler. |
| In-place editing of issued invoices | Medium | Database & Service level checks preventing `UPDATE` on `Invoice` where `status != DRAFT`; requires `void-and-reissue` service call. |

---

## 8. Evaluation and Validation (Definition of Done)

- [ ] `src/prisma/schema.prisma` defined with all 17 models and enums.
- [ ] Database migrations executed cleanly without errors.
- [ ] Zod validations built for User, Company, Auth, and Project entities.
- [ ] NextAuth / JWT authentication flow verified via API tests.
- [ ] RBAC Middleware verified blocking unauthorized route access for all 5 roles.
- [ ] Seed script (`npx prisma db seed`) creates working initial state.
- [ ] Dashboard shell layouts for `(admin)`, `(engineer)`, and `(client)` rendered with responsive mobile-first UI.
