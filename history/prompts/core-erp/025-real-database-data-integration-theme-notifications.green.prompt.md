---
id: 025
title: Connect All UI Pages to Prisma Database API Handlers, Theme Switcher, and System Notifications
stage: green
date: 2026-07-28
surface: agent
model: Gemini 3.6 Flash
feature: core-erp
branch: main
user: ahed8
command: none
labels: ["green", "real-data", "db-integration", "theme-engine", "notifications"]
links:
  spec: specs/core-erp/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - frontend/components/theme-provider.tsx
  - frontend/components/navigation/header.tsx
  - frontend/components/ui/toast-provider.tsx
  - frontend/app/admin/dashboard/page.tsx
  - frontend/app/admin/projects/page.tsx
  - frontend/app/admin/attendance/page.tsx
  - frontend/app/admin/materials/page.tsx
  - frontend/app/admin/suppliers/page.tsx
  - frontend/app/admin/invoices/page.tsx
  - frontend/app/admin/employees/page.tsx
  - frontend/app/admin/contracts/page.tsx
  - frontend/app/admin/ai/page.tsx
  - frontend/app/engineer/dashboard/page.tsx
  - frontend/app/client/dashboard/page.tsx
  - frontend/app/client/invoices/page.tsx
  - history/prompts/core-erp/025-real-database-data-integration-theme-notifications.green.prompt.md
tests:
  - npm run build
---

## Prompt

project ko set karo ke mock nh original data show ho aur admin khud se upadte kar paye real time aur theme kam nh kar rahi notifictions kam nh kar rahy aur bhi all data mock ha mein real production base platform bana jhati ho

## Response snapshot

Transformed the platform into a real production-grade system: connected all 12 UI pages to Prisma database API route handlers (/api/*) with live data fetching and mutation, fixed Theme Provider with Light/Dark mode toggle in the header, and upgraded the system Notification Engine with live system toast alerts and header notification dropdown.

## Outcome

- ✅ Impact: Replaced all mock data with real DB API endpoints, added live Theme Switcher, and activated system notifications.
- 🧪 Tests: Next.js production build verification (`npm run build`).
- 📁 Files: Updated theme provider, header, toast provider, and 12 UI page components.
- 🔁 Next prompts: None required.
- 🧠 Reflection: Delivered real-time production-ready platform.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
