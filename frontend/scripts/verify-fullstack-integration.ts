import { POST as registerHandler } from "../app/api/auth/register/route";
import { POST as loginHandler } from "../app/api/auth/login/route";
import { GET as getProjectsHandler, POST as createProjectHandler } from "../app/api/projects/route";
import { POST as assignTeamHandler } from "../app/api/projects/[id]/team/route";
import { POST as markAttendanceHandler } from "../app/api/attendance/mark/route";
import { POST as bulkAttendanceHandler } from "../app/api/attendance/bulk/route";
import { GET as getMaterialsHandler, POST as createMaterialHandler } from "../app/api/materials/route";
import { GET as getSuppliersHandler, POST as createSupplierHandler } from "../app/api/suppliers/route";
import { GET as getExpensesHandler, POST as createExpenseHandler } from "../app/api/expenses/route";
import { POST as createQuotationHandler } from "../app/api/quotations/route";
import { POST as calculatePayrollHandler } from "../app/api/payroll/route";
import { GET as getContractsHandler, POST as createContractHandler } from "../app/api/contracts/route";
import { POST as aiReportHandler } from "../app/api/ai/report/route";
import { POST as aiEstimateHandler } from "../app/api/ai/estimate/route";
import { POST as aiChatHandler } from "../app/api/ai/chat/route";
import { GET as searchHandler } from "../app/api/search/route";
import { GET as getActivityLogHandler } from "../app/api/activity-log/route";
import { db } from "../lib/db";
import { AuthService } from "../services/auth.service";
import { ProjectService } from "../services/project.service";
import { AttendanceService } from "../services/attendance.service";
import { MaterialService } from "../services/material.service";
import { ExpenseService } from "../services/expense.service";
import { FinancialsService } from "../services/financials.service";
import { SupplierService } from "../services/supplier.service";
import { PayrollService } from "../services/payroll.service";
import { ContractService } from "../services/contract.service";
import { AIService } from "../services/ai.service";
import bcrypt from "bcryptjs";

async function verifyFullstackIntegration() {
  console.log("\n========================================================");
  console.log("🔗 STARTING FULL-STACK END-TO-END INTEGRATION VERIFICATION");
  console.log("========================================================\n");

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string) {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`  ✅ PASS: ${testName}`);
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      throw new Error(`Integration test failed: ${testName}`);
    }
  }

  try {
    // ---------------------------------------------------------
    // 1. WORKFLOW: ONBOARDING & TENANT AUTHENTICATION
    // ---------------------------------------------------------
    console.log("--- 1. Testing Workflow: Onboarding & Tenant Auth ---");
    const testEmail = `e2e_admin_${Date.now()}@buildcorp.com`;

    const regReq = new Request("http://localhost:3000/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        companyName: "E2E Fullstack Construction Corp",
        name: "E2E Admin User",
        email: testEmail,
        password: "E2EPassword123!",
        phone: "+15550000",
      }),
    });

    const regRes = await registerHandler(regReq);
    const regData = await regRes.json();

    assert(regRes.status === 201, "Auth API created company & admin (201)");
    assert(!!regData.data.company.id, "Frontend receives Company CUID token");
    assert(regData.data.user.role === "ADMIN", "User role mapped to ADMIN");

    const companyId = regData.data.company.id;
    const adminId = regData.data.user.id;

    // Login API Verification
    const loginReq = new Request("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: testEmail, password: "E2EPassword123!" }),
    });

    const loginRes = await loginHandler(loginReq);
    const loginData = await loginRes.json();

    assert(loginRes.status === 200, "Login API validates hashed password (200)");
    assert(loginData.data.companyId === companyId, "Session payload scopes companyId");

    // ---------------------------------------------------------
    // 2. WORKFLOW: CLIENT & PROJECT MANAGEMENT
    // ---------------------------------------------------------
    console.log("\n--- 2. Testing Workflow: Project Creation & Team Assignment ---");

    const client = await db.client.create({
      data: {
        companyId,
        name: "E2E Client Properties",
        contact: "+15559988",
        email: "client@e2eproperties.com",
      },
    });

    const createProjReq = new Request("http://localhost:3000/api/projects", {
      method: "POST",
      headers: {
        "x-company-id": companyId,
        "x-user-id": adminId,
        "x-user-role": "ADMIN",
      },
      body: JSON.stringify({
        name: "E2E Horizon Heights Tower",
        clientId: client.id,
        startDate: new Date(),
        budget: 1200000,
        priority: "HIGH",
        status: "IN_PROGRESS",
      }),
    });

    const createProjRes = await createProjectHandler(createProjReq);
    const createProjData = await createProjRes.json();

    assert(createProjRes.status === 201, "Project API creates project entity (201)");
    assert(createProjData.data.companyId === companyId, "Project tenant isolation verified");

    const projectId = createProjData.data.id;

    // Create & Assign Engineer to Project Team
    const passwordHash = await bcrypt.hash("Password123!", 10);
    const engineerUser = await db.user.create({
      data: {
        companyId,
        name: "E2E Site Lead Engineer",
        email: `e2e_eng_${Date.now()}@buildcorp.com`,
        passwordHash,
        role: "ENGINEER",
      },
    });

    const assignTeamReq = new Request(`http://localhost:3000/api/projects/${projectId}/team`, {
      method: "POST",
      headers: {
        "x-company-id": companyId,
        "x-user-id": adminId,
        "x-user-role": "ADMIN",
      },
      body: JSON.stringify({
        userId: engineerUser.id,
        roleOnProject: "Lead Site Engineer",
      }),
    });

    const assignTeamRes = await assignTeamHandler(assignTeamReq, { params: Promise.resolve({ id: projectId }) });
    const assignTeamData = await assignTeamRes.json();

    assert(assignTeamRes.status === 200, "Team assignment API binds engineer to project site");
    assert(assignTeamData.data.userId === engineerUser.id, "Project team record verified");

    // ---------------------------------------------------------
    // 3. WORKFLOW: FIELD SITE ATTENDANCE & QR CHECK-IN
    // ---------------------------------------------------------
    console.log("\n--- 3. Testing Workflow: Attendance & Duplicate Protection ---");

    const markAttReq = new Request("http://localhost:3000/api/attendance/mark", {
      method: "POST",
      headers: {
        "x-company-id": companyId,
        "x-user-id": engineerUser.id,
        "x-user-role": "ENGINEER",
      },
      body: JSON.stringify({
        userId: engineerUser.id,
        projectId,
        date: new Date(),
        status: "PRESENT",
        method: "QR",
      }),
    });

    const markAttRes = await markAttendanceHandler(markAttReq);
    const markAttData = await markAttRes.json();

    assert(markAttRes.status === 201, "Engineer QR attendance marked PRESENT (201)");
    assert(markAttData.data.method === "QR", "Attendance method QR confirmed");

    // ---------------------------------------------------------
    // 4. WORKFLOW: MATERIAL INVENTORY & SUPPLIER REORDER
    // ---------------------------------------------------------
    console.log("\n--- 4. Testing Workflow: Material Stock & Procurement ---");

    const createMatReq = new Request("http://localhost:3000/api/materials", {
      method: "POST",
      headers: {
        "x-company-id": companyId,
        "x-user-id": adminId,
        "x-user-role": "ADMIN",
      },
      body: JSON.stringify({
        name: "E2E Deformed Rebar Steel",
        unit: "tons",
        stockQty: 50,
        reorderLevel: 15,
      }),
    });

    const createMatRes = await createMaterialHandler(createMatReq);
    const createMatData = await createMatRes.json();

    assert(createMatRes.status === 201, "Material inventory entry created");

    const autoSuggestions = await SupplierService.getAutoPurchaseOrderSuggestions(companyId);
    assert(Array.isArray(autoSuggestions), "Procurement engine computes purchase order suggestions");

    // ---------------------------------------------------------
    // 5. WORKFLOW: EXPENSE LOGGING & $10k CAPPING GUARD
    // ---------------------------------------------------------
    console.log("\n--- 5. Testing Workflow: Site Expenses & $10,000 Cap Guard ---");

    // Valid capped engineer expense ($3,500 <= $10,000)
    const validExpReq = new Request("http://localhost:3000/api/expenses", {
      method: "POST",
      headers: {
        "x-company-id": companyId,
        "x-user-id": engineerUser.id,
        "x-user-role": "ENGINEER",
      },
      body: JSON.stringify({
        projectId,
        category: "FUEL",
        amount: 3500,
        note: "Site diesel generator fuel refill",
      }),
    });

    const validExpRes = await createExpenseHandler(validExpReq);
    assert(validExpRes.status === 201, "Engineer logged valid capped expense ($3,500)");

    // Invalid engineer expense (> $10,000) rejected by backend guard
    const invalidExpReq = new Request("http://localhost:3000/api/expenses", {
      method: "POST",
      headers: {
        "x-company-id": companyId,
        "x-user-id": engineerUser.id,
        "x-user-role": "ENGINEER",
      },
      body: JSON.stringify({
        projectId,
        category: "MATERIAL",
        amount: 15000, // Exceeds $10k cap
        note: "Bulk steel purchase without admin approval",
      }),
    });

    const invalidExpRes = await createExpenseHandler(invalidExpReq);
    assert(invalidExpRes.status === 400, "Backend API guard rejected engineer expense > $10,000 (400)");

    // ---------------------------------------------------------
    // 6. WORKFLOW: FINANCIALS & IMMUTABLE INVOICES (v1 -> v2)
    // ---------------------------------------------------------
    console.log("\n--- 6. Testing Workflow: Financials & Immutable Versioning ---");

    const quotation = await FinancialsService.createQuotation(
      companyId,
      adminId,
      "ADMIN",
      {
        clientId: client.id,
        projectId,
        items: [{ description: "Foundation Piling & Excavation", quantity: 1, unitRate: 250000 }],
        gstPct: 17,
        discount: 0,
      },
      true
    );

    assert(quotation.status === "DRAFT", "AI Quotation starts with status DRAFT");

    const approvedQ = await FinancialsService.approveQuotation(companyId, adminId, "ADMIN", quotation.id);
    assert(approvedQ.status === "APPROVED", "Admin approved draft quotation");

    const invV1 = await FinancialsService.createInvoice(companyId, adminId, "ADMIN", {
      clientId: client.id,
      projectId,
      quotationId: quotation.id,
      amount: 292500,
    });

    assert(invV1.version === 1, "Invoice created with version 1");

    const invV2 = await FinancialsService.voidAndReissueInvoice(companyId, adminId, "ADMIN", invV1.id, 300000);
    assert(invV2.version === 2, "Reissued invoice incremented to version 2 (Void-and-Reissue)");

    // ---------------------------------------------------------
    // 7. WORKFLOW: STAFF PAYROLL & SUBCONTRACTS
    // ---------------------------------------------------------
    console.log("\n--- 7. Testing Workflow: Staff Payroll & Subcontracts ---");

    const payrollReq = new Request("http://localhost:3000/api/payroll", {
      method: "POST",
      headers: {
        "x-company-id": companyId,
        "x-user-id": adminId,
        "x-user-role": "ADMIN",
      },
      body: JSON.stringify({
        userId: engineerUser.id,
        month: "2026-07",
        monthlySalary: 140000,
        totalDaysInMonth: 30,
        presentDays: 29,
        lateDays: 1,
        halfDays: 0,
      }),
    });

    const payrollRes = await calculatePayrollHandler(payrollReq);
    const payrollData = await payrollRes.json();

    assert(payrollRes.status === 200, "Payroll API calculated net salary");
    assert(payrollData.data.netSalary > 0, "Payable salary verified");

    // ---------------------------------------------------------
    // 8. WORKFLOW: AI STUDIO & AUDIT TRAIL INTEGRATION
    // ---------------------------------------------------------
    console.log("\n--- 8. Testing Workflow: AI Studio & Audit Trail ---");

    const aiReportReq = new Request("http://localhost:3000/api/ai/report", {
      method: "POST",
      headers: { "x-user-id": engineerUser.id },
      body: JSON.stringify({
        projectId,
        rawInput: "Completed foundation rebar tying and column shuttering.",
      }),
    });

    const aiReportRes = await aiReportHandler(aiReportReq);
    const aiReportData = await aiReportRes.json();

    assert(aiReportRes.status === 200, "AI Daily Progress Report generated (200)");

    const logReq = new Request("http://localhost:3000/api/activity-log", {
      headers: { "x-company-id": companyId },
    });

    const logRes = await getActivityLogHandler(logReq);
    const logData = await logRes.json();

    assert(logRes.status === 200, "Audit Log API returned company activity entries");
    assert(logData.data.length > 0, "Audit trail contains records for created entities");
    console.log(`  ℹ️ Total Integrated Audit Trail Records: ${logData.data.length}`);

    // ---------------------------------------------------------
    // FINAL INTEGRATION SUMMARY
    // ---------------------------------------------------------
    console.log("\n========================================================");
    console.log(`🎉 FULL-STACK INTEGRATION COMPLETE: ${passedTests}/${totalTests} WORKFLOW ASSERTIONS PASSED`);
    console.log("========================================================\n");
  } catch (error) {
    console.error("\n❌ FULL-STACK INTEGRATION VERIFICATION FAILED:", error);
    process.exit(1);
  }
}

verifyFullstackIntegration();
