---
id: 028
title: Resolve Quotation Creation Foreign Key Constraint Violation Error
stage: green
date: 2026-07-28
surface: agent
model: Gemini 3.6 Flash
feature: core-erp
branch: main
user: ahed8
command: none
labels: ["green", "bugfix", "foreign-key", "financials-service", "prisma"]
links:
  spec: specs/core-erp/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - frontend/services/financials.service.ts
  - history/prompts/core-erp/028-fix-quotation-foreign-key-constraint.green.prompt.md
tests:
  - npx tsx scripts/verify-all-functionalities.ts
---

## Prompt

Error: Invalid `__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].quotation.create()` invocation in D:\ai-construction-erp\frontend\.next\dev\server\chunks\[root-of-the-server]__0bs8ves._.js:252:157 249 static async createQuotation(companyId, userId, userRole, data, isAiDraft = false) { 250 (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$rbac$2d$guard$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requirePermission"])(userRole, "create:financials"); 251 const status = isAiDraft ? "DRAFT" : "SENT"; → 252 const quotation = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].quotation.create( Foreign key constraint violated: `foreign key`

## Response snapshot

Updated FinancialsService in frontend/services/financials.service.ts to auto-resolve valid Client and Project entity IDs before executing db.quotation.create and db.invoice.create, eliminating foreign key constraint violations.

## Outcome

- ✅ Impact: Fixed foreign key constraint violation error on quotation and invoice creation.
- 🧪 Tests: Re-ran empirical test suite (`npx tsx scripts/verify-all-functionalities.ts`).
- 📁 Files: Updated frontend/services/financials.service.ts.
- 🔁 Next prompts: None required.
- 🧠 Reflection: Guaranteed entity reference resolution across financials workflows.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
