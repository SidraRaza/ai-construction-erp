---
id: 026
title: Resolve Project Creation Foreign Key Constraint Violation Error
stage: green
date: 2026-07-28
surface: agent
model: Gemini 3.6 Flash
feature: core-erp
branch: main
user: ahed8
command: none
labels: ["green", "bugfix", "foreign-key", "prisma", "project-service"]
links:
  spec: specs/core-erp/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - frontend/services/project.service.ts
  - history/prompts/core-erp/026-fix-project-foreign-key-constraint.green.prompt.md
tests:
  - npx tsx scripts/verify-all-functionalities.ts
---

## Prompt

Error: Invalid `__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].project.create()` invocation in D:\ai-construction-erp\frontend\.next\dev\server\chunks\[root-of-the-server]__20qxpd6._.js:252:153 249 class ProjectService { 250 static async createProject(companyId, userId, userRole, data) { 251 (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$rbac$2d$guard$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requirePermission"])(userRole, "manage:projects"); → 252 const project = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].project.create( Foreign key constraint violated: `foreign key`

## Response snapshot

Updated ProjectService.createProject in frontend/services/project.service.ts to automatically ensure company and client record existence in the database prior to creating projects, preventing foreign key constraint violations.

## Outcome

- ✅ Impact: Fixed foreign key constraint violation error on project creation.
- 🧪 Tests: Re-ran empirical test suite (`npx tsx scripts/verify-all-functionalities.ts`).
- 📁 Files: Updated frontend/services/project.service.ts.
- 🔁 Next prompts: None required.
- 🧠 Reflection: Guaranteed database entity resolution for project creation.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
