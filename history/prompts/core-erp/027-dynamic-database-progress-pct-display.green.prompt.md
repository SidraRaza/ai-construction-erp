---
id: 027
title: Replace Hardcoded Progress Percentage with Dynamic Database progressPct
stage: green
date: 2026-07-28
surface: agent
model: Gemini 3.6 Flash
feature: core-erp
branch: main
user: ahed8
command: none
labels: ["green", "bugfix", "progress-pct", "real-data", "prisma-integration"]
links:
  spec: specs/core-erp/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - frontend/app/admin/projects/page.tsx
  - frontend/app/admin/dashboard/page.tsx
  - history/prompts/core-erp/027-dynamic-database-progress-pct-display.green.prompt.md
tests:
  - npm run build
---

## Prompt

Site Progress 65% abhi kam start bhi nh hoa phir bhi 65 % q araha mock data bikul khatam kar du real data ho

## Response snapshot

Replaced hardcoded 65% site progress indicators across project cards and dashboard charts with dynamic database record values (p.progressPct || 0), ensuring newly created projects correctly start at 0% until updated.

## Outcome

- ✅ Impact: All site progress indicators now render real database values dynamically.
- 🧪 Tests: Next.js build verification (`npm run build`).
- 📁 Files: Updated frontend/app/admin/projects/page.tsx and frontend/app/admin/dashboard/page.tsx.
- 🔁 Next prompts: None required.
- 🧠 Reflection: Eliminated hardcoded fallback progress percentage.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
