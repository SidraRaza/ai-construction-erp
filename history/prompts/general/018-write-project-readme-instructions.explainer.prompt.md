---
id: 018
title: Write Project README Instructions for Frontend & Backend Setup
stage: explainer
date: 2026-07-27
surface: agent
model: Gemini 3.6 Flash
feature: core-erp
branch: main
user: ahed8
command: none
labels: ["explainer", "readme", "setup-guide", "instructions"]
links:
  spec: specs/core-erp/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - README.md
  - frontend/README.md
  - history/prompts/general/018-write-project-readme-instructions.explainer.prompt.md
tests:
  - none
---

## Prompt

read me likh kar du mere project ki instruction ki frontend aur backend ki

## Response snapshot

Created comprehensive README.md files at root (README.md) and frontend (frontend/README.md) detailing project architecture, setup instructions for frontend and backend API route handlers, environment configuration, database seeding, demo account credentials, and testing commands in English and Roman Urdu.

## Outcome

- ✅ Impact: Provided complete, clear project setup instructions and documentation.
- 🧪 Tests: None
- 📁 Files: Created README.md, updated frontend/README.md, created PHR.
- 🔁 Next prompts: None required.
- 🧠 Reflection: Delivered user-requested README documentation.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
