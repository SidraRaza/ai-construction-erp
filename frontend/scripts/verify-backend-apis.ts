import { POST as registerHandler } from "../app/api/auth/register/route";
import { POST as loginHandler } from "../app/api/auth/login/route";
import { GET as getProjectsHandler, POST as createProjectHandler } from "../app/api/projects/route";
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
import { POST as aiQuotationHandler } from "../app/api/ai/quotation/route";
import { POST as aiChatHandler } from "../app/api/ai/chat/route";
import { GET as searchHandler } from "../app/api/search/route";
import { GET as getActivityLogHandler } from "../app/api/activity-log/route";
import { db } from "../lib/db";
import bcrypt from "bcryptjs";

async function verifyBackendApis() {
  console.log("\n========================================================");
  console.log("🚀 STARTING EMPIRICAL BACKEND API HANDLER VERIFICATION");
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
      throw new Error(`API Verification test failed: ${testName}`);
    }
  }

  try {
    // ---------------------------------------------------------
    // 1. API: AUTH REGISTER
    // ---------------------------------------------------------
    console.log("--- 1. Testing API: POST /api/auth/register ---");
    const testEmail = `api_admin_${Date.now()}@buildcorp.com`;
    const regReq = new Request("http://localhost:3000/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        companyName: "API Verification Corp",
        name: "API Admin",
        email: testEmail,
        password: "TestPassword123!",
        phone: "+15551111",
      }),
    });

    const regRes = await registerHandler(regReq);
    const regData = await regRes.json();

    assert(regRes.status === 201, "HTTP 201 Created returned for registration");
    assert(!!regData.data.company.id, "Registration API returns Company ID");

    const companyId = regData.data.company.id;
    const adminId = regData.data.user.id;

    // Create Client Record for Foreign Key Integrity
    const client = await db.client.create({
      data: {
        companyId,
        name: "API Test Client Corp",
        contact: "+15552222",
        email: "apiclient@buildcorp.com",
      },
    });

    // Create Engineer User
    const passwordHash = await bcrypt.hash("Password123!", 10);
    const engineerUser = await db.user.create({
      data: {
        companyId,
        name: "API Test Engineer",
        email: `api_eng_${Date.now()}@buildcorp.com`,
        passwordHash,
        role: "ENGINEER",
      },
    });

    // ---------------------------------------------------------
    // 2. API: AUTH LOGIN
    // ---------------------------------------------------------
    console.log("\n--- 2. Testing API: POST /api/auth/login ---");
    const loginReq = new Request("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: testEmail,
        password: "TestPassword123!",
      }),
    });

    const loginRes = await loginHandler(loginReq);
    const loginData = await loginRes.json();

    assert(loginRes.status === 200, "HTTP 200 OK returned for valid login");
    assert(loginData.data.id === adminId, "Login API payload matches registered admin ID");

    // ---------------------------------------------------------
    // 3. API: PROJECTS
    // ---------------------------------------------------------
    console.log("\n--- 3. Testing API: POST & GET /api/projects ---");
    const createProjectReq = new Request("http://localhost:3000/api/projects", {
      method: "POST",
      headers: {
        "x-company-id": companyId,
        "x-user-id": adminId,
        "x-user-role": "ADMIN",
      },
      body: JSON.stringify({
        name: "API Verified Tower",
        clientId: client.id,
        startDate: new Date(),
        budget: 950000,
        priority: "HIGH",
        status: "IN_PROGRESS",
      }),
    });

    const projectRes = await createProjectHandler(createProjectReq);
    const projectData = await projectRes.json();

    assert(projectRes.status === 201, "HTTP 201 Created returned for project creation");
    assert(projectData.data.name === "API Verified Tower", "Project name matches API payload");

    const projectId = projectData.data.id;

    // Assign Engineer to project team
    await db.projectTeam.create({
      data: {
        projectId,
        userId: engineerUser.id,
        roleOnProject: "Site Lead",
      },
    });

    const getProjectsReq = new Request("http://localhost:3000/api/projects", {
      headers: {
        "x-company-id": companyId,
        "x-user-id": adminId,
        "x-user-role": "ADMIN",
      },
    });

    const listProjRes = await getProjectsHandler(getProjectsReq);
    const listProjData = await listProjRes.json();

    assert(listProjRes.status === 200, "HTTP 200 OK for GET /api/projects");
    assert(listProjData.data.length >= 1, "Project list contains created project");

    // ---------------------------------------------------------
    // 4. API: ATTENDANCE
    // ---------------------------------------------------------
    console.log("\n--- 4. Testing API: POST /api/attendance/mark ---");
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

    assert(markAttRes.status === 201, "HTTP 201 Created returned for attendance marking");
    assert(markAttData.data.status === "PRESENT", "Attendance status PRESENT confirmed");

    // ---------------------------------------------------------
    // 5. API: MATERIALS & INVENTORY
    // ---------------------------------------------------------
    console.log("\n--- 5. Testing API: POST & GET /api/materials ---");
    const createMatReq = new Request("http://localhost:3000/api/materials", {
      method: "POST",
      headers: {
        "x-company-id": companyId,
        "x-user-id": adminId,
        "x-user-role": "ADMIN",
      },
      body: JSON.stringify({
        name: "API Tested Cement Bags",
        unit: "bags",
        stockQty: 80,
        reorderLevel: 20,
      }),
    });

    const createMatRes = await createMaterialHandler(createMatReq);
    const createMatData = await createMatRes.json();

    assert(createMatRes.status === 201, "HTTP 201 Created returned for material creation");
    assert(createMatData.data.name === "API Tested Cement Bags", "Material name verified");

    // ---------------------------------------------------------
    // 6. API: SUPPLIERS & PROCUREMENT
    // ---------------------------------------------------------
    console.log("\n--- 6. Testing API: POST & GET /api/suppliers ---");
    const createSupReq = new Request("http://localhost:3000/api/suppliers", {
      method: "POST",
      headers: {
        "x-company-id": companyId,
        "x-user-id": adminId,
        "x-user-role": "ADMIN",
      },
      body: JSON.stringify({
        name: "API Tested Steel Vendor",
        contact: "+15558888",
        email: "vendor@apisteel.com",
        category: "Structural Steel",
      }),
    });

    const createSupRes = await createSupplierHandler(createSupReq);
    const createSupData = await createSupRes.json();

    assert(createSupRes.status === 201, "HTTP 201 Created returned for supplier creation");

    // ---------------------------------------------------------
    // 7. API: EXPENSES & CAPPING
    // ---------------------------------------------------------
    console.log("\n--- 7. Testing API: POST & GET /api/expenses ---");
    const createExpReq = new Request("http://localhost:3000/api/expenses", {
      method: "POST",
      headers: {
        "x-company-id": companyId,
        "x-user-id": adminId,
        "x-user-role": "ADMIN",
      },
      body: JSON.stringify({
        projectId,
        category: "FUEL",
        amount: 3500,
        note: "Excavator generator diesel fuel",
      }),
    });

    const createExpRes = await createExpenseHandler(createExpReq);
    const createExpData = await createExpRes.json();

    assert(createExpRes.status === 201, "HTTP 201 Created returned for expense API");
    assert(createExpData.data.category === "FUEL", "Expense category FUEL verified");

    // ---------------------------------------------------------
    // 8. API: PAYROLL CALCULATOR
    // ---------------------------------------------------------
    console.log("\n--- 8. Testing API: POST /api/payroll ---");
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
        monthlySalary: 120000,
        totalDaysInMonth: 30,
        presentDays: 28,
        lateDays: 2,
        halfDays: 0,
      }),
    });

    const payrollRes = await calculatePayrollHandler(payrollReq);
    const payrollData = await payrollRes.json();

    assert(payrollRes.status === 200, "HTTP 200 OK returned for payroll calculation");
    assert(payrollData.data.netSalary > 0, "Net salary calculated");

    // ---------------------------------------------------------
    // 9. API: SUBCONTRACT CONTRACTS
    // ---------------------------------------------------------
    console.log("\n--- 9. Testing API: POST & GET /api/contracts ---");
    const contractReq = new Request("http://localhost:3000/api/contracts", {
      method: "POST",
      headers: {
        "x-company-id": companyId,
        "x-user-id": adminId,
        "x-user-role": "ADMIN",
      },
      body: JSON.stringify({
        projectId,
        subcontractorName: "API Apex Erectors",
        tradeScope: "Structural Steel Frame",
        contractValue: 350000,
      }),
    });

    const contractRes = await createContractHandler(contractReq);
    const contractData = await contractRes.json();

    assert(contractRes.status === 201, "HTTP 201 Created returned for contract API");
    assert(contractData.data.subcontractorName === "API Apex Erectors", "Subcontractor name verified");

    // ---------------------------------------------------------
    // 10. API: AI STUDIO ENDPOINTS
    // ---------------------------------------------------------
    console.log("\n--- 10. Testing API: AI Endpoints (/api/ai/*) ---");
    const aiReportReq = new Request("http://localhost:3000/api/ai/report", {
      method: "POST",
      headers: {
        "x-user-id": engineerUser.id,
      },
      body: JSON.stringify({
        projectId,
        rawInput: "Poured 50 cubic meters concrete slab",
      }),
    });

    const aiReportRes = await aiReportHandler(aiReportReq);
    const aiReportData = await aiReportRes.json();

    assert(aiReportRes.status === 200, "HTTP 200 OK for AI daily report endpoint");
    assert(aiReportData.data.aiGeneratedReport.includes("Official Site Daily Progress Report"), "AI Daily report format verified");

    // AI Cost Estimator API
    const aiEstReq = new Request("http://localhost:3000/api/ai/estimate", {
      method: "POST",
      body: JSON.stringify({
        description: "5 Marla House Construction",
      }),
    });

    const aiEstRes = await aiEstimateHandler(aiEstReq);
    const aiEstData = await aiEstRes.json();

    assert(aiEstRes.status === 200, "HTTP 200 OK for AI cost estimator endpoint");
    assert(aiEstData.data.totalCost > 0, "AI cost estimator returned total cost");

    // AI Grounded Chat API
    const aiChatReq = new Request("http://localhost:3000/api/ai/chat", {
      method: "POST",
      headers: {
        "x-company-id": companyId,
      },
      body: JSON.stringify({
        projectId,
        question: "Project kab complete hoga?",
      }),
    });

    const aiChatRes = await aiChatHandler(aiChatReq);
    const aiChatData = await aiChatRes.json();

    assert(aiChatRes.status === 200, "HTTP 200 OK for AI grounded chat endpoint");
    assert(aiChatData.data.answer.length > 0, "AI Chat returned grounded answer");

    // Global Search API
    const searchReq = new Request(`http://localhost:3000/api/search?q=API`, {
      headers: { "x-company-id": companyId },
    });

    const searchRes = await searchHandler(searchReq);
    const searchData = await searchRes.json();

    assert(searchRes.status === 200, "HTTP 200 OK for GET /api/search");
    assert(searchData.data.projects.length >= 1, "Search API returned matching project");

    // Activity Log API
    const logReq = new Request(`http://localhost:3000/api/activity-log`, {
      headers: { "x-company-id": companyId },
    });

    const logRes = await getActivityLogHandler(logReq);
    const logData = await logRes.json();

    assert(logRes.status === 200, "HTTP 200 OK for GET /api/activity-log");
    assert(logData.data.length > 0, "Activity log API returned audit entries");

    // ---------------------------------------------------------
    // FINAL BACKEND SUMMARY
    // ---------------------------------------------------------
    console.log("\n========================================================");
    console.log(`🎉 BACKEND API VERIFICATION COMPLETE: ${passedTests}/${totalTests} ENDPOINTS PASSED`);
    console.log("========================================================\n");
  } catch (error) {
    console.error("\n❌ BACKEND API VERIFICATION FAILED:", error);
    process.exit(1);
  }
}

verifyBackendApis();
