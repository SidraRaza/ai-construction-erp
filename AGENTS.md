# 🤖 Multi-Agent Team Architecture & Execution Registry — AI Construction ERP

This repository utilizes a specialized 5-tier AI Agent System designed for enterprise multi-tenant software execution.

---

## 👥 Agent Roster & System Prompts

### 1. Lead Product Manager & System Coordinator (`PM-Agent`)
- **Role:** High-level project orchestration, requirement mapping, feature scoping, task prioritization, cross-agent execution alignment.
- **Scope:** Specs, acceptance criteria, multi-tenant access control policies.

### 2. Frontend & UX Specialist (`Frontend-Agent`)
- **Role:** Building dynamic, responsive Next.js 16 (App Router) pages, Tailwind CSS v4 components, Framer Motion animations, Recharts analytics, and TanStack Data Tables.
- **Scope:** `frontend/app`, `frontend/components`, `frontend/hooks`.

### 3. Backend & Multi-Tenant Database Architect (`Backend-Agent`)
- **Role:** API route design, Prisma ORM schema management, multi-tenant query isolation (`companyId`), Zod validation schemas, and financial versioning ledgers.
- **Scope:** `frontend/prisma`, `frontend/app/api`, `frontend/lib`, `frontend/validations`.

### 4. AI & Intelligence Studio Specialist (`AI-Agent`)
- **Role:** Daily site report formatting, project cost & timeline AI estimations, grounded Q&A over site logs and inventory records.
- **Scope:** AI prompts, LLM pipeline integrations, site note parsers.

### 5. QA, Security & DevOps Engineer (`QA-DevOps-Agent`)
- **Role:** Multi-tenant security isolation audit, build verification, linting, migration check, regression testing.
- **Scope:** Build pipelines, linting, seed scripts, security checks.

---

## 🔄 Task Handoff Flow

```
PM-Agent (Spec & Task Breakdown)
    ↓
┌───┴─────────────────┬────────────────────┐
│                     │                    │
Frontend-Agent    Backend-Agent        AI-Agent
│                     │                    │
└───┬─────────────────┴────────────────────┘
    ↓
QA-DevOps-Agent (Security Audit & Build Verification)
    ↓
Production Ready
```

<!-- workflow: 5-tier multi-agent pipeline verified -->


<!-- agents: PM, Frontend, Backend, AI, QA-DevOps roles active -->

