# 🏗️ AI Construction ERP — Enterprise Multi-Tenant SaaS Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_Serverless-4169E1?style=flat-square&logo=postgresql)](https://neon.tech/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen.svg?style=flat-square)](https://github.com/SidraRaza/ai-construction-erp/pulls)

> **Created & Built by:** **Sidra Raza** (Platform Founder & Lead Architect)  
> **🌐 Live Application:** [https://ai-construction-erp-eight.vercel.app](https://ai-construction-erp-eight.vercel.app)  
> **📖 Interactive User Manual:** [https://ai-construction-erp-eight.vercel.app/docs](https://ai-construction-erp-eight.vercel.app/docs)  
> **📁 Official Repository:** [https://github.com/SidraRaza/ai-construction-erp.git](https://github.com/SidraRaza/ai-construction-erp.git)  
> **📄 Local Docs:** [📖 Read DOCUMENTATION.md](./DOCUMENTATION.md)



AI Construction ERP is a full-stack, enterprise-grade Construction Resource Planning (ERP) platform designed, conceptualized, and built by **Sidra Raza**. Powered by Next.js, Prisma, and Artificial Intelligence, it serves construction firms, civil engineers, contractors, real estate developers, skilled workers, and project investors across the globe, providing complete end-to-end management of construction sites, workforce attendance, material inventory, financial billing, multi-channel payment processing, and AI-driven site intelligence.


Built on a **Multi-Tenant SaaS Architecture**, independent businesses and users can register their accounts, store their clients and site data securely in 100% private database vaults, and access isolated dashboards without any cross-tenant data leakage.

---

## 🌟 Key Modules & System Capabilities

### 1. 🏗️ Multi-Project Portfolio Management
- Track active, planned, and completed construction projects in real-time.
- Live dynamic calculation of project progress percentage (`progressPct`), budget consumption, and priority badges.
- Assign engineers, foreman leads, masons, and fixers to site project teams.

### 2. 📱 QR Check-In & Daily Site Workforce Tracking
- QR-code scan check-in for site workers and manual roster overrides.
- Automated daily workforce summaries: Total Workers, Present Today, Late Entry, and Absent count.
- Integrated with staff payroll calculation for attendance-based salary deductions.

### 3. 🧱 Material Inventory & Procurement Engine
- Monitor stock levels for cement, steel, aggregates, electrical, and plumbing items.
- Automatic reorder alerts when inventory drops below safety thresholds.
- Supplier management with vendor rating system (5.0 scale) and auto-purchase orders.

### 4. 💵 Financial Billing, Quotations, & Multi-Channel Payments
- **Quotation Generator:** Create custom estimates with custom Quotation IDs, initial statuses (`SENT`, `PENDING`, `DRAFT`, `APPROVED`, `REJECTED`), and full editing capabilities.
- **Immutable Invoices:** Generate versioned invoices (`v1.0`, `v2.0` on void/reissue) for transparent financial audit trails.
- **Multi-Channel Payment Recording:** Support for **Naqad Cash**, **Bank Wire / Online Transfer**, **Bank Cheque / Pay Order**, **JazzCash Wallet**, **EasyPaisa Wallet**, and **Stripe POS**.

### 5. 🛠️ Self-Configurable Custom Production Fields Engine
- Company admins can define their own custom fields (Text, Numeric, Date, Select Dropdowns, Checkboxes).
- Dynamic production entry forms logged into tenant-isolated database vaults.

### 6. 🤖 AI Intelligence Studio
- **Daily Site Report Formatter:** Converts raw civil engineer field notes into formal, structured daily site reports.
- **Project Cost & Timeline Estimator:** Calculates budget projections, material quantities, and target completion dates using AI heuristics.
- **AI Quotation Drafts:** Generates draft estimates requiring Admin sign-off.
- **Grounded AI Assistant:** Interactive Q&A over site logs, material stocks, and financial records.

### 7. 👑 Super Admin Platform Owner Control Center
- Platform owner global dashboard monitoring all registered tenant accounts.
- Displays tenant company names, geographical country locations, subscription plans, total active users, and system operational metrics.

---

## 🎯 User Roles & Access Architecture

| User Role | Main Capabilities |
|---|---|
| **Company Admin / Contractor** | Full operational control over projects, materials, suppliers, quotations, invoices, payment receipts, staff directory, custom fields, and payroll. |
| **Civil Site Engineer** | Mobile field interface for daily QR attendance logging, site expense entry, material requests, and instant AI daily report formatting. |
| **Client / Real Estate Investor** | Live visibility into project milestone completion, dynamic progress percentages, invoice history, and project approval requests. |
| **Platform Owner (Super Admin)** | High-level control center overseeing all registered companies, geographical distribution by country, global user counts, and SaaS subscription metrics. |

---

## 👤 Author & Ownership
**Created & Authored by:** **Sidra Raza**  
**Repository:** [https://github.com/SidraRaza/ai-construction-erp.git](https://github.com/SidraRaza/ai-construction-erp.git)  
© 2026 Sidra Raza. All Rights Reserved.
