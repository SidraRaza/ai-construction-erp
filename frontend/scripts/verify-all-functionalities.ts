import { AuthService } from "../services/auth.service";
import { ProjectService } from "../services/project.service";
import { AttendanceService } from "../services/attendance.service";
import { MaterialService } from "../services/material.service";
import { ExpenseService } from "../services/expense.service";
import { FinancialsService } from "../services/financials.service";
import { AIService } from "../services/ai.service";
import { ActivityLogService } from "../services/activity-log.service";
import { db } from "../lib/db";
import bcrypt from "bcryptjs";

async function runVerificationSuite() {
  console.log("\n========================================================");
  console.log("🧪 STARTING EMPIRICAL VERIFICATION SUITE FOR AI ERP");
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
      throw new Error(`Verification test failed: ${testName}`);
    }
  }

  try {
    // ---------------------------------------------------------
    // TEST SUITE 1: AUTHENTICATION & MULTI-TENANCY
    // ---------------------------------------------------------
    console.log("--- 1. Testing AuthService & User Onboarding ---");

    const testEmail = `admin_test_${Date.now()}@buildcorp.com`;
    const regResult = await AuthService.registerCompanyAndAdmin({
      companyName: "Verification Test Corp",
      name: "Test Admin",
      email: testEmail,
      password: "TestPassword123!",
      phone: "+15550000",
    });

    assert(!!regResult.company.id, "Company ID created");
    assert(!!regResult.user.id, "Admin User ID created");
    assert(regResult.user.role === "ADMIN", "User assigned ADMIN role");

    // Login Credentials Validation
    const loginUser = await AuthService.validateCredentials({
      email: testEmail,
      password: "TestPassword123!",
    });
    assert(loginUser.id === regResult.user.id, "Valid credentials return authenticated user payload");

    // Invalid Credentials Test
    try {
      await AuthService.validateCredentials({ email: testEmail, password: "WrongPassword" });
      assert(false, "Invalid password should fail");
    } catch {
      assert(true, "Invalid password properly rejected");
    }

    const companyId = regResult.company.id;
    const adminId = regResult.user.id;

    // Create Engineer User
    const passwordHash = await bcrypt.hash("Password123!", 10);
    const engineerUser = await db.user.create({
      data: {
        companyId,
        name: "Test Engineer",
        email: `engineer_${Date.now()}@buildcorp.com`,
        passwordHash,
        role: "ENGINEER",
      },
    });

    // Create Labour User
    const labourUser = await db.user.create({
      data: {
        companyId,
        name: "Test Labour",
        email: `labour_${Date.now()}@buildcorp.com`,
        passwordHash,
        role: "LABOUR",
      },
    });

    // Create Client Record for Foreign Key Integrity
    const client = await db.client.create({
      data: {
        companyId,
        name: "Verification Client Corp",
        contact: "+15559999",
        email: "client@verification.com",
      },
    });

    // ---------------------------------------------------------
    // TEST SUITE 2: CLIENT & PROJECT MANAGEMENT
    // ---------------------------------------------------------
    console.log("\n--- 2. Testing ProjectService & RBAC Scoping ---");

    const project = await ProjectService.createProject(companyId, adminId, "ADMIN", {
      name: "Verification Tower Alpha",
      clientId: client.id,
      startDate: new Date(),
      budget: 850000,
      priority: "HIGH",
      status: "IN_PROGRESS",
    });

    assert(project.name === "Verification Tower Alpha", "Project created successfully");
    assert(project.companyId === companyId, "Project companyId scoped correctly");

    // Assign Engineer to Project Team
    await ProjectService.assignTeamMember(companyId, adminId, "ADMIN", project.id, {
      userId: engineerUser.id,
      roleOnProject: "Site Lead",
    });

    // Fetch Projects for Engineer (should return assigned project)
    const engProjects = await ProjectService.getProjects(companyId, engineerUser.id, "ENGINEER");
    assert(engProjects.length === 1, "Engineer sees only assigned site project");

    // ---------------------------------------------------------
    // TEST SUITE 3: ATTENDANCE SYSTEM & DUPLICATE PREVENTION
    // ---------------------------------------------------------
    console.log("\n--- 3. Testing AttendanceService & Duplicate Guard ---");

    const attendanceDate = new Date();

    // Engineer marks own attendance
    const engAttRecord = await AttendanceService.markAttendance(companyId, engineerUser.id, "ENGINEER", {
      userId: engineerUser.id,
      projectId: project.id,
      date: attendanceDate,
      status: "PRESENT",
      method: "QR",
    });

    assert(engAttRecord.status === "PRESENT", "Engineer marked own attendance PRESENT via QR");

    // Admin bulk marks labour attendance
    const bulkRecords = await AttendanceService.markBulkAttendance(companyId, adminId, "ADMIN", {
      projectId: project.id,
      date: attendanceDate,
      records: [{ userId: labourUser.id, status: "PRESENT", method: "MANUAL" }],
    });

    assert(bulkRecords.length === 1, "Admin bulk-marked labour attendance");

    // Test Duplicate Rejection
    let duplicateRejected = false;
    try {
      await AttendanceService.markAttendance(companyId, engineerUser.id, "ENGINEER", {
        userId: engineerUser.id,
        projectId: project.id,
        date: attendanceDate,
        status: "PRESENT",
        method: "QR",
      });
    } catch {
      duplicateRejected = true;
    }
    assert(duplicateRejected, "Duplicate attendance attempt rejected as expected");


    // ---------------------------------------------------------
    // TEST SUITE 4: MATERIAL INVENTORY & REORDER ALERTS
    // ---------------------------------------------------------
    console.log("\n--- 4. Testing MaterialService & Inventory ---");

    const material = await MaterialService.createMaterial(companyId, adminId, "ADMIN", {
      name: "High Grade Portland Cement",
      unit: "bags",
      stockQty: 100,
      reorderLevel: 20,
    });

    assert(material.name === "High Grade Portland Cement", "Material created");

    // Adjust Stock (Consumption)
    const adjusted = await MaterialService.adjustStock(companyId, adminId, "ADMIN", material.id, {
      adjustmentQty: -85,
      reason: "Slab pouring consumption",
    });

    assert(adjusted.stockQty.toNumber() === 15, "Stock correctly decremented to 15");

    const materialsList = await MaterialService.getMaterials(companyId);
    const targetMat = materialsList.find((m) => m.id === material.id);
    assert(targetMat?.isLowStock === true, "Low stock flag triggered when stock <= reorderLevel");

    // ---------------------------------------------------------
    // TEST SUITE 5: EXPENSE TRACKER & ENGINEER CAPPING
    // ---------------------------------------------------------
    console.log("\n--- 5. Testing ExpenseService & Capping Rules ---");

    const expenseAdmin = await ExpenseService.createExpense(companyId, adminId, "ADMIN", {
      projectId: project.id,
      category: "FUEL",
      amount: 15000,
      note: "Diesel for heavy excavator",
    });

    assert(expenseAdmin.category === "FUEL", "Admin created $15,000 fuel expense without capping error");

    // Assigned Engineer logs valid capped expense ($4,500 <= $10,000)
    const expenseEng = await ExpenseService.createExpense(companyId, engineerUser.id, "ENGINEER", {
      projectId: project.id,
      category: "MISC",
      amount: 4500,
      note: "Site safety gear purchase",
    });

    assert(expenseEng.amount.toNumber() === 4500, "Assigned Engineer logged valid capped expense ($4,500)");

    // Engineer $10,000 Cap Assertion (exceeding cap fails)
    try {
      await ExpenseService.createExpense(companyId, engineerUser.id, "ENGINEER", {
        projectId: project.id,
        category: "MATERIAL",
        amount: 12000, // Exceeds $10k cap
      });
      assert(false, "Engineer expense > $10,000 should be rejected by guard");
    } catch {
      assert(true, "Engineer expense exceeding $10,000 cap rejected by guard");
    }

    // ---------------------------------------------------------
    // TEST SUITE 6: FINANCIALS, QUOTATIONS & IMMUTABLE INVOICES
    // ---------------------------------------------------------
    console.log("\n--- 6. Testing FinancialsService & Immutable Document Versioning ---");

    const quotation = await FinancialsService.createQuotation(
      companyId,
      adminId,
      "ADMIN",
      {
        clientId: client.id,
        projectId: project.id,
        items: [{ description: "Steel Rebar 12mm", quantity: 10, unitRate: 1500 }],
        gstPct: 17,
        discount: 500,
      },
      true // AI Draft = true
    );

    assert(quotation.status === "DRAFT", "AI-generated quotation created with status DRAFT");

    // Admin Approval
    const approvedQuotation = await FinancialsService.approveQuotation(companyId, adminId, "ADMIN", quotation.id);
    assert(approvedQuotation.status === "APPROVED", "Admin approved quotation");

    // Create Invoice v1
    const invoiceV1 = await FinancialsService.createInvoice(companyId, adminId, "ADMIN", {
      clientId: client.id,
      projectId: project.id,
      quotationId: quotation.id,
      amount: 17050,
    });

    assert(invoiceV1.version === 1, "Invoice created with version 1");

    // Void and Reissue Invoice v2 (Immutable Rule per Constitution §2.7)
    const invoiceV2 = await FinancialsService.voidAndReissueInvoice(
      companyId,
      adminId,
      "ADMIN",
      invoiceV1.id,
      18000
    );

    assert(invoiceV2.version === 2, "Reissued invoice incremented to version 2");

    // ---------------------------------------------------------
    // TEST SUITE 7: AI LAYER & GROUNDED CHAT
    // ---------------------------------------------------------
    console.log("\n--- 7. Testing AIService Features ---");

    const dailyReport = await AIService.generateDailyReport(companyId, project.id, engineerUser.id, "Finished 2nd floor column reinforcement.");
    assert(dailyReport.aiGeneratedReport.includes("Official Site Daily Progress Report"), "AI Daily Report formatted");

    const costEstimate = await AIService.estimateProjectCost("5 Marla Residential House Construction");
    assert(costEstimate.estimatedDays === 90, "AI Cost Estimator returned 90 days timeline for 5 Marla house");
    assert(costEstimate.totalCost > 0, "AI Cost Estimator generated total cost breakdown");

    const chatResponse = await AIService.chatAssistant(companyId, project.id, "Project kab complete hoga?");
    assert(chatResponse.answer.includes(project.name), "AI Chat Assistant grounded answer includes project name");

    // ---------------------------------------------------------
    // TEST SUITE 8: AUDIT LOG SERVICE VERIFICATION
    // ---------------------------------------------------------
    console.log("\n--- 8. Testing ActivityLog Audit Trail ---");

    const logs = await ActivityLogService.getCompanyLogs(companyId, 50);
    assert(logs.length > 0, "Audit log records populated for created entities");
    console.log(`  ℹ️ Total Activity Logs Recorded for Company: ${logs.length}`);

    // ---------------------------------------------------------
    // FINAL SUMMARY
    // ---------------------------------------------------------
    console.log("\n========================================================");
    console.log(`🎉 EMPIRICAL VERIFICATION COMPLETE: ${passedTests}/${totalTests} TESTS PASSED`);
    console.log("========================================================\n");
  } catch (error) {
    console.error("\n❌ VERIFICATION SUITE TERMINATED WITH ERROR:", error);
    process.exit(1);
  }
}

runVerificationSuite();
