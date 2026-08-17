# 📖 AI Construction ERP — Complete User & Website Guide

> **Platform Founder & Lead Architect:** **Sidra Raza**  
> **Official Website:** [https://ai-construction-erp-eight.vercel.app](https://ai-construction-erp-eight.vercel.app)  
> **GitHub Repository:** [https://github.com/SidraRaza/ai-construction-erp.git](https://github.com/SidraRaza/ai-construction-erp.git)

---

## 📑 Table of Contents

1. [Introduction to AI Construction ERP](#1-introduction-to-ai-construction-erp)
2. [Account Registration & Login](#2-account-registration--login)
3. [Company Admin & Contractor Guide](#3-company-admin--contractor-guide)
   - [Overview Dashboard](#overview-dashboard)
   - [Creating & Managing Projects](#creating--managing-projects)
   - [Materials Inventory & Low Stock Alerts](#materials-inventory--low-stock-alerts)
   - [Managing Verified Suppliers](#managing-verified-suppliers)
   - [Quotations & Estimates](#quotations--estimates)
   - [Issuing Invoices & Recording Multi-Channel Payments](#issuing-invoices--recording-multi-channel-payments)
   - [Staff Directory & Automated Monthly Payroll](#staff-directory--automated-monthly-payroll)
4. [Civil Site Engineer Field Portal (Mobile & Tablet)](#4-civil-site-engineer-field-portal-mobile--tablet)
   - [AI Daily Site Report Generator](#ai-daily-site-report-generator)
   - [Worker QR Attendance Check-In](#worker-qr-attendance-check-in)
   - [Logging Capped Field Expenses ($10,000 Safety Cap)](#logging-capped-field-expenses-10000-safety-cap)
5. [Client & Property Investor Portal](#5-client--property-investor-portal)
   - [Live Milestone & Budget Tracking](#live-milestone--budget-tracking)
   - [Viewing Invoices & Downloading PDFs](#viewing-invoices--downloading-pdfs)
   - [Grounded AI Project Support Chat](#grounded-ai-project-support-chat)
6. [Self-Configurable Custom Production Fields](#6-self-configurable-custom-production-fields)
7. [AI Intelligence Studio & Cost Estimations](#7-ai-intelligence-studio--cost-estimations)
8. [Platform Owner Control Center (Super Admin)](#8-platform-owner-control-center-super-admin)
9. [Convenient Features (PDF Export, WhatsApp Sharing & Themes)](#9-convenient-features-pdf-export-whatsapp-sharing--themes)
10. [Frequently Asked Questions (FAQ)](#10-frequently-asked-questions-faq)

---

## 1. Introduction to AI Construction ERP

**AI Construction ERP** is an all-in-one software platform built for construction companies, civil contractors, site engineers, real estate developers, and property investors.

It eliminates messy WhatsApp chats and lost spreadsheets by providing:
- 🏗️ **Project Tracking:** Real-time milestone progress and budget monitoring.
- 📱 **QR Attendance:** Quick check-ins for site workers with duplicate prevention.
- 🧱 **Material Tracking:** Real-time stock levels of cement, steel, and sand with automatic low stock warnings.
- 🧾 **Billing & Invoicing:** Tamper-proof versioned invoices (`v1.0`, `v2.0`) and multi-channel payment recording (Cash, Wire Transfer, Cheques, JazzCash, EasyPaisa, Stripe).
- 🤖 **AI Site Reports:** Generates polished daily site reports from rough field notes.
- ⚙️ **Custom Fields:** Create your own custom data fields without writing code.

---

## 2. Account Registration & Login

### How to Create a New Company Account
1. Open the website: [https://ai-construction-erp-eight.vercel.app](https://ai-construction-erp-eight.vercel.app)
2. Click the amber **"Register / Login"** button in the top right.
3. Select the **"Register Company"** tab.
4. Enter:
   - **Company Name** (e.g. *Apex Builders & Contractors*)
   - **Your Name** (e.g. *Sarah Admin*)
   - **Email Address**
   - **Password**
   - **Phone Number** (Optional)
5. Click **"Create Company Account"**.
6. You will immediately enter your private company dashboard with full Admin authority!

### 1-Hour Auto-Safety Session
For site security and financial privacy, user sessions remain active for **1 hour**. If you leave your device unattended, the system locks to protect your data. Simply log in again to resume.

---

## 3. Company Admin & Contractor Guide

The Company Admin portal (`/admin/dashboard`) gives contractors total operational and financial control.

### Overview Dashboard
- **Top KPI Cards:** Displays active projects, workers on site today, material alerts, and total invoiced revenue.
- **Visual Charts:** Shows monthly cashflow and budget burn rates in real-time.

### Creating & Managing Projects
1. Click **"Projects"** in the left sidebar (or visit `/admin/projects`).
2. Click **"+ Create New Project"**.
3. Fill in:
   - **Project Name:** (e.g., *Skyline Luxury Towers - Phase 1*)
   - **Budget ($):** Total capital allocated.
   - **Priority:** Low, Medium, High, or Urgent.
   - **Start Date & Completion Deadline**.
4. Click **"Save Project"**.
5. Click on any project card to assign Site Engineers, Foremen, or Masons to that site.

### Materials Inventory & Low Stock Alerts
1. Go to **"Materials Inventory"** (`/admin/materials`).
2. Click **"+ Add Material"**.
3. Type the material name (*Portland Cement*, *Deformed Steel Rebars*, *River Sand*, *Pipes*).
4. Select unit (*Bags, Tons, Cubic Meters, Meters, Pieces*).
5. Set your **Current Stock** and **Reorder Safety Level** (e.g. 100 bags).
6. Whenever stock drops below your safety level, an amber **"Low Stock Alert"** appears so your site never runs out of essential materials.

### Managing Verified Suppliers
1. Go to **"Suppliers & Procurement"** (`/admin/suppliers`).
2. Click **"+ Add Supplier"**.
3. Enter supplier name, contact person, phone number, and trade category (*Cement, Steel, Aggregates, Electrical, Heavy Equipment*).
4. Rate the supplier on a 5-star rating scale to maintain high procurement quality.

### Quotations & Estimates
1. Go to **"Quotations & Invoices"** (`/admin/invoices`).
2. Click **"+ Create Quotation"**.
3. Select the client and project, then enter line items (e.g. *Site Excavation, Foundation Piling, Steel Truss Welding*) with quantities and unit rates.
4. Set status (*DRAFT, SENT, or APPROVED*).

### Issuing Invoices & Recording Multi-Channel Payments
1. When a quotation is approved, click **"Issue Invoice"**.
2. The invoice receives an immutable version number (e.g., `v1.0`).
3. To record a payment, click the green **"Record Payment"** button on the invoice row.
4. Enter the amount received and select the payment channel:
   - **Cash:** Direct cash payment.
   - **Bank Wire Transfer:** Online interbank transfer with transaction reference ID.
   - **Bank Cheque / Pay Order:** Cheque number and deposit date.
   - **JazzCash / EasyPaisa:** Mobile wallet transfer.
   - **Stripe:** Credit or debit card POS.
5. Click **"Save Payment"**. The invoice status automatically updates to `PAID`!

### Staff Directory & Automated Monthly Payroll
1. Go to **"Staff & Payroll"** (`/admin/employees`).
2. View your workforce roster.
3. Select the payroll month (e.g., *August 2026*) and click **"Calculate Monthly Payroll"**.
4. The system automatically computes base salary minus absent days to determine net salary payouts.
5. Click **"Print Payroll Statement"** to download or disburse.

---

## 4. Civil Site Engineer Field Portal (Mobile & Tablet)

The Site Engineer portal (`/engineer/dashboard`) is designed for fast field operations on mobile phones.

### AI Daily Site Report Generator
1. Open `/engineer/dashboard` on your phone or tablet.
2. In **Today's Site Notes**, type rough observations:
   > *"Poured 45 cubic meters concrete on 2nd floor columns, 28 workers allocated, passed slump test, delayed 1 hour by rain."*
3. (Optional) Click **Attach Site Photo** to upload progress images.
4. Click the amber button **"Synthesize AI Daily Site Report"**.
5. The AI automatically compiles a polished, executive-ready report with structured sections for Completed Milestones, Quality Inspections, Delays, and Tomorrow's Plan!

### Worker QR Attendance Check-In
1. Click **"Scan Worker QR"**.
2. Scan the worker's badge card or tap their name.
3. **Duplicate Prevention Guard:** If a worker is scanned twice on the same day, the system alerts you immediately, preventing accidental duplicate attendance.

### Logging Capped Field Expenses ($10,000 Safety Cap)
1. Click **"Log Site Expense"**.
2. Enter the amount (e.g., $4,500 for generator fuel or equipment repair) and upload the receipt image.
3. **Safety Protection:** Site Engineers can log expenses up to **$10,000**. Any expense exceeding $10,000 requires Company Admin approval.

---

## 5. Client & Property Investor Portal

The Client Portal (`/client/dashboard`) gives real estate buyers and investors full transparency into their project.

### Live Milestone & Budget Tracking
- Clients can log in and view live progress bars (`progressPct`), scheduled completion dates, and project priorities.

### Viewing Invoices & Downloading PDFs
- In `/client/invoices`, clients can review paid and pending invoice balances.
- Click **"Preview PDF"** on any invoice to view and download official billing statements.

### Grounded AI Project Support Chat
- In `/client/ai`, clients can ask questions like:
  > *"When will the 3rd floor slab be ready for inspection?"*
- The AI answers instantly using live database records and site notes.

---

## 6. Self-Configurable Custom Production Fields

Every construction business has unique data needs. You can create your own custom fields without writing any code:

1. Navigate to **"Custom Production Fields"** (`/admin/custom-fields`).
2. Click **"+ Create Custom Field"**.
3. Choose the Field Type:
   - **TEXT:** Alphanumeric codes (e.g. *Concrete Batch Truck Plate #*).
   - **NUMBER:** Quantities or measurements (e.g. *Pour Temperature in °C*).
   - **DATE:** Deadlines (e.g. *Concrete Curing Inspection Date*).
   - **SELECT:** Dropdown lists (e.g. *Slump Test: Low, Medium, High*).
   - **CHECKBOX:** Safety checks (e.g. *Lead Engineer Sign-off*).
4. Click **"Create Field"**. The custom field will now appear on all your site production forms automatically!

---

## 7. AI Intelligence Studio & Cost Estimations

Navigate to `/admin/ai`:
1. **AI Cost & Timeline Estimator:** Select your project scope (e.g., *5 Marla, 10 Marla, 1 Kanal, or Multi-Story Commercial*).
2. Click **"Estimate Cost & Timeline"**.
3. The AI provides estimated material quantities (cement bags, steel tons, sand m³), project duration in days, and total budget breakdown.

---

## 8. Platform Owner Control Center (Super Admin)

The Owner Portal (`/admin/super-admin`) is exclusively for platform founder **Sidra Raza**:
1. Visit `/admin/super-admin` and enter the Super Admin password.
2. View total registered construction firms, user accounts, and geographical distribution across countries.
3. Review user feedback submitted from the home page.

---

## 9. Convenient Features (PDF Export, WhatsApp Sharing & Themes)

- 📲 **1-Click WhatsApp Sharing:** On any quotation or invoice, click **"Share to WhatsApp"** to send a clean summary directly to your client's mobile phone.
- 📄 **High-Resolution PDF Downloads:** Click **"Download PDF"** on invoices or daily reports to save print-ready documents.
- 🌓 **Dark / Light Mode:** Click the Sun/Moon icon in the top header to toggle Dark Mode (great for night work) or Light Mode (great for bright sunlight on site).

---

## 10. Frequently Asked Questions (FAQ)

#### Q: How do I switch between different company accounts?
**A:** Click your profile name in the top header, select **"Sign Out / Switch Account"**, and log in with your other company credentials.

#### Q: Can an engineer log an expense higher than $10,000?
**A:** No. The system protects company finances with a $10,000 cap for site engineers. Expenses above $10,000 must be entered or approved by an Admin.

#### Q: How does the AI generate daily site reports?
**A:** The engineer types rough observations into the text box. The AI cleans up the text, organizes it into executive sections (Completed Tasks, Delays, Tomorrow's Action Plan), and creates a formatted report.

---

### 👤 Ownership & Support

**Platform Architect:** **Sidra Raza**  
**Official Website:** [https://ai-construction-erp-eight.vercel.app](https://ai-construction-erp-eight.vercel.app)  
**Repository:** [https://github.com/SidraRaza/ai-construction-erp.git](https://github.com/SidraRaza/ai-construction-erp.git)  
© 2026 Sidra Raza. All Rights Reserved.

<!-- rbac-note: Super Admin, Company Admin, and Site Engineer access matrix -->


<!-- security: multi-tenant companyId query isolation enforced at API boundary -->


<!-- sharing: automated WhatsApp PDF invoice share format with web preview -->


<!-- attendance: offline QR code validation cache strategy with anti-spoofing -->

