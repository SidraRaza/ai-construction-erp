# Tasks: AI Construction ERP — Phase 1 (Foundation & Core ERP)

**Input**: Specs from [`specs/core-erp/spec.md`](file:///D:/ai-construction-erp/specs/core-erp/spec.md) and Plan from [`specs/core-erp/plan.md`](file:///D:/ai-construction-erp/specs/core-erp/plan.md)  
**Prerequisites**: `spec.md` (required), `plan.md` (required)  
**Organization**: Tasks are grouped by user story / foundation milestone for independent implementation.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Configure directory structure, configuration files, and core dependencies per Constitution.

- [ ] T001 Establish `src/` directory structure per Constitution §6 (`app`, `components`, `features`, `hooks`, `lib`, `prisma`, `services`, `actions`, `utils`, `types`, `validations`) in `frontend/src/`
- [ ] T002 [P] Create Zod environment variable validation schema in `frontend/src/lib/env.ts` checking `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXT_PUBLIC_APP_URL`
- [ ] T003 [P] Configure global theme system (Dark/Light mode) in `frontend/src/components/theme-provider.tsx` using `next-themes`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data schema, database client, and base service infrastructure that ALL user stories depend on.

- [ ] T004 Define full 17-model Prisma schema with Enums (`Role`, `ProjectStatus`, `AttendanceStatus`, `InvoiceStatus`, `PaymentMethod`) in `frontend/src/prisma/schema.prisma`
- [ ] T005 Create Prisma client singleton helper in `frontend/src/lib/db.ts`
- [ ] T006 [P] Create generic TypeScript API response envelope & error types in `frontend/src/types/api.ts`
- [ ] T007 [P] Implement centralized activity logging service (`ActivityLog`) in `frontend/src/services/activity-log.service.ts`
- [ ] T008 [P] Create Prisma seed script in `frontend/src/prisma/seed.ts` for Super Admin, default Company, Admin, Engineer, Labour, Client, and sample Projects

---

## Phase 3: User Story 1 — Multi-Tenant Auth & User Onboarding (Priority: P1) 🎯 MVP

**Goal**: Enable secure registration, login, JWT token management, and company-scoped user onboarding.

**Independent Test**: Register a new company + admin, authenticate via `/api/auth/login`, receive valid JWT, and verify tenant `companyId` matches token user scope.

### Implementation for User Story 1
- [ ] T009 [P] [US1] Create Auth Zod validation schemas (`registerSchema`, `loginSchema`) in `frontend/src/validations/auth.validation.ts`
- [ ] T010 [P] [US1] Implement `AuthService` in `frontend/src/services/auth.service.ts` (handles registration, password hashing with bcrypt, credentials validation)
- [ ] T011 [US1] Configure Auth.js / NextAuth JWT strategy & session callback in `frontend/src/lib/auth.ts`
- [ ] T012 [US1] Create API Route handler `POST /api/auth/register` in `frontend/src/app/api/auth/register/route.ts`
- [ ] T013 [US1] Create API Route handler `POST /api/auth/login` in `frontend/src/app/api/auth/login/route.ts`
- [ ] T014 [US1] Create API Route handler `GET /api/users/me` in `frontend/src/app/api/users/me/route.ts`
- [ ] T015 [US1] Build Login & Register UI pages in `frontend/src/app/(auth)/login/page.tsx` and `frontend/src/app/(auth)/register/page.tsx`

---

## Phase 4: User Story 2 — Role-Based Access Control & Middleware Protection (Priority: P1)

**Goal**: Enforce Constitution Permission Matrix at the API and route middleware layers.

**Independent Test**: Request `(admin)` routes with an Engineer token $\rightarrow$ verify `403 Forbidden` / redirect to login or engineer dashboard.

### Implementation for User Story 2
- [ ] T016 [P] [US2] Define RBAC permission matrix matrix mapping in `frontend/src/lib/rbac.ts`
- [ ] T017 [US2] Implement Next.js `middleware.ts` in `frontend/src/middleware.ts` validating path route groups against JWT `role` and `companyId`
- [ ] T018 [US2] Implement server-side service permission assertion helper `requireRole()` in `frontend/src/services/rbac-guard.ts`

---

## Phase 5: User Story 3 — Company & Project Management Foundation (Priority: P2)

**Goal**: Provide Admin capability to create/manage projects and assign team members (Engineers/Labour).

**Independent Test**: Admin creates a project via `/api/projects`, assigns an engineer, and verifies the engineer sees only their assigned project under `/api/projects`.

### Implementation for User Story 3
- [ ] T019 [P] [US3] Create Project & Company Zod validation schemas in `frontend/src/validations/project.validation.ts`
- [ ] T020 [P] [US3] Implement `ProjectService` in `frontend/src/services/project.service.ts` with strict `companyId` scoping and `ActivityLog` creation
- [ ] T021 [US3] Create API Route handler `POST /api/projects` in `frontend/src/app/api/projects/route.ts`
- [ ] T022 [US3] Create API Route handler `GET /api/projects` in `frontend/src/app/api/projects/route.ts` (with role-based filtering: Admin sees all company projects, Engineer sees assigned only, Client sees own only)
- [ ] T023 [US3] Create API Route handler `POST /api/projects/[id]/team` in `frontend/src/app/api/projects/[id]/team/route.ts`

---

## Phase 6: User Story 4 — Responsive Dashboard Shell per Role (Priority: P2)

**Goal**: Provide a clean, role-tailored dashboard layout with sidebar navigation, header, theme toggle, and statistics metric cards.

**Independent Test**: Log in as Admin, Engineer, or Client and verify corresponding sidebar links, metric cards, and responsive layout adapt properly.

### Implementation for User Story 4
- [ ] T024 [P] [US4] Build shared Sidebar and Navigation Header components in `frontend/src/components/navigation/sidebar.tsx` and `frontend/src/components/navigation/header.tsx`
- [ ] T025 [P] [US4] Build Dashboard Metric Card components in `frontend/src/components/dashboard/metric-card.tsx`
- [ ] T026 [US4] Create Admin Dashboard Layout & Page in `frontend/src/app/(admin)/dashboard/page.tsx`
- [ ] T027 [US4] Create Engineer Dashboard Layout & Page in `frontend/src/app/(engineer)/dashboard/page.tsx`
- [ ] T028 [US4] Create Client Dashboard Layout & Page in `frontend/src/app/(client)/dashboard/page.tsx`

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Validation, linting, build verification, and seeding confirmation.

- [ ] T029 Execute Prisma migrations and seed database (`npx prisma migrate dev`, `npx prisma db seed`)
- [ ] T030 Perform build validation (`npm run build`) and lint verification (`npm run lint`)
- [ ] T031 Verify Dark/Light mode theme switching and responsive layout on mobile screen widths
