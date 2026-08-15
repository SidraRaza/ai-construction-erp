import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

async function main() {
  console.log("🌱 Seeding database...");

  // Cleanup existing default company and seed user emails if present
  await prisma.user.deleteMany({
    where: {
      email: {
        in: [
          "sidraraza680@gmail.com",
          "admin@buildcorp.com",
          "engineer@buildcorp.com",
          "labour@buildcorp.com",
          "client@buildcorp.com",
          "owner@buildcorp.com",
        ],
      },
    },
  });
  await prisma.company.deleteMany({ where: { id: "cl_default_company" } });

  // 1. Create Default Company
  const company = await prisma.company.create({
    data: {
      id: "cl_default_company",
      name: "BuildCorp Enterprise ERP",
      subscriptionPlan: "ENTERPRISE",
      status: "ACTIVE",
    },
  });

  console.log(`✅ Created company: ${company.name} (${company.id})`);

  // 2. Create Users for all 5 Roles
  const passwordHash = hashPassword("Password123!");

  const superAdmin = await prisma.user.create({
    data: {
      companyId: company.id,
      name: "Sidra Raza (Platform Owner)",
      email: "sidraraza680@gmail.com",
      passwordHash: hashPassword("87626"),
      role: "SUPER_ADMIN",
    },
  });

  const admin = await prisma.user.create({
    data: {
      companyId: company.id,
      name: "Sarah Admin",
      email: "admin@buildcorp.com",
      passwordHash,
      role: "ADMIN",
    },
  });

  const engineer = await prisma.user.create({
    data: {
      companyId: company.id,
      name: "Alex Engineer",
      email: "engineer@buildcorp.com",
      passwordHash,
      role: "ENGINEER",
    },
  });

  const labour = await prisma.user.create({
    data: {
      companyId: company.id,
      name: "John Labour",
      email: "labour@buildcorp.com",
      passwordHash,
      role: "LABOUR",
    },
  });

  const clientUser = await prisma.user.create({
    data: {
      companyId: company.id,
      name: "Client Representative",
      email: "client@buildcorp.com",
      passwordHash,
      role: "CLIENT",
    },
  });

  console.log("✅ Created default users for all 5 roles (Password: Password123!)");

  // 3. Create Client Entity
  const client = await prisma.client.create({
    data: {
      companyId: company.id,
      name: "Acme Real Estate",
      contact: "+1 555-0199",
      email: "contact@acmerealestate.com",
    },
  });

  // 4. Create Sample Project
  const project = await prisma.project.create({
    data: {
      companyId: company.id,
      clientId: client.id,
      name: "Skyline Luxury Towers - Phase 1",
      startDate: new Date(),
      endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      budget: 1500000.00,
      status: "IN_PROGRESS",
      priority: "HIGH",
      progressPct: 25,
      team: {
        create: [
          { userId: engineer.id, role: "SITE_ENGINEER" },
          { userId: labour.id, role: "MASON_LEAD" },
        ],
      },
    },
  });

  console.log(`✅ Created project: ${project.name} (${project.id})`);

  // 5. Create Real Materials & Inventory
  await prisma.material.createMany({
    data: [
      { companyId: company.id, name: "Portland Cement (Grade 53)", unit: "Bags", stockQty: 450, reorderLevel: 100 },
      { companyId: company.id, name: "Deformed Steel Rebars (Grade 60 - 12mm)", unit: "Tons", stockQty: 32, reorderLevel: 10 },
      { companyId: company.id, name: "Crushed River Sand (Coarse)", unit: "Cubic Meters", stockQty: 180, reorderLevel: 50 },
      { companyId: company.id, name: "Aggregates (20mm Crushed Stone)", unit: "Cubic Meters", stockQty: 220, reorderLevel: 60 },
      { companyId: company.id, name: "High-Pressure PVC Drainage Pipes (4-inch)", unit: "Meters", stockQty: 75, reorderLevel: 80 },
    ],
  });
  console.log("✅ Seeded construction materials & inventory");

  // 6. Create Real Suppliers
  await prisma.supplier.createMany({
    data: [
      { companyId: company.id, name: "National Steel Mills Ltd", contact: "+92 300 1234567", category: "STEEL", rating: 4.8 },
      { companyId: company.id, name: "Apex ReadyMix Concrete Corp", contact: "+92 321 7654321", category: "CEMENT", rating: 4.9 },
      { companyId: company.id, name: "Pak Build Heavy Equipment", contact: "+92 333 9876543", category: "EQUIPMENT", rating: 4.7 },
    ],
  });
  console.log("✅ Seeded verified construction suppliers");


  // 7. Create Quotation & Invoices
  const quotation = await prisma.quotation.create({
    data: {
      companyId: company.id,
      clientId: client.id,
      projectId: project.id,
      items: JSON.stringify([
        { description: "Site Excavation & Foundation Piling", quantity: 1, unitRate: 350000, amount: 350000 },
        { description: "Reinforced Concrete Core & 2nd Floor Columns", quantity: 1, unitRate: 450000, amount: 450000 },
      ]),
      status: "APPROVED",
      notes: "Commercial high-rise foundation package.",
    },
  });

  const invoice = await prisma.invoice.create({
    data: {
      companyId: company.id,
      clientId: client.id,
      project: { connect: { id: project.id } },
      quotation: { connect: { id: quotation.id } },
      amount: 350000.00,
      version: 1,
      status: "PAID",
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.payment.create({
    data: {
      invoiceId: invoice.id,
      amount: 350000.00,
      method: "BANK_TRANSFER",
      reference: "TXN-2026-081599",
    },
  });
  console.log("✅ Seeded approved quotations, versioned invoices, and payment ledgers");

  // 8. Create Subcontractor Contracts in ActivityLog
  await prisma.activityLog.createMany({
    data: [
      {
        companyId: company.id,
        userId: admin.id,
        action: "CREATE_SUBCONTRACTOR_CONTRACT",
        entityType: "Contract",
        entityId: "cnt_101",
        meta: JSON.stringify({
          projectId: project.id,
          subcontractorName: "Vertex Structural Steel Fabricators",
          tradeScope: "Structural Steel Welding & Truss Erection",
          contractValue: 280000.00,
          documentUrl: "https://storage.buildcorp.com/contracts/cnt_101.pdf",
        }),
      },
      {
        companyId: company.id,
        userId: admin.id,
        action: "CREATE_SUBCONTRACTOR_CONTRACT",
        entityType: "Contract",
        entityId: "cnt_102",
        meta: JSON.stringify({
          projectId: project.id,
          subcontractorName: "ClimateCool HVAC Engineering",
          tradeScope: "Central HVAC Ducting & Chiller Units",
          contractValue: 195000.00,
          documentUrl: "https://storage.buildcorp.com/contracts/cnt_102.pdf",
        }),
      },
    ],
  });
  console.log("✅ Seeded subcontractor contracts into audit ledger");

  // 9. Create Real Site Expenses
  await prisma.expense.createMany({
    data: [
      { projectId: project.id, category: "LABOUR", amount: 12500.00, receiptUrl: "https://storage.buildcorp.com/receipts/exp_1.jpg" },
      { projectId: project.id, category: "OVERHEAD", amount: 15000.00, receiptUrl: "https://storage.buildcorp.com/receipts/exp_2.jpg" },
      { projectId: project.id, category: "EQUIPMENT", amount: 4500.00, receiptUrl: "https://storage.buildcorp.com/receipts/exp_3.jpg" },
    ],
  });
  console.log("✅ Seeded site operational expenses");


  // 10. Create Real Site Safety Incidents
  await prisma.siteIncident.createMany({
    data: [
      {
        companyId: company.id,
        projectId: project.id,
        title: "Missing Hardhat & Harness at Level 4 Shuttering",
        severity: "MEDIUM",
        category: "PPE_VIOLATION",
        location: "Tower A - 4th Floor Edge",
        description: "Two subcontract scaffolding workers observed working near slab perimeter without tethered safety harnesses. Work halted immediately until compliance verified.",
        reportedBy: "Alex Engineer (Lead Site Inspector)",
        status: "RESOLVED",
      },
      {
        companyId: company.id,
        projectId: project.id,
        title: "Hydraulic Fluid Leakage Near Mobile Crane",
        severity: "HIGH",
        category: "EQUIPMENT_HAZARD",
        location: "Material Staging Zone B",
        description: "Heavy 50-ton mobile crane showed hydraulic hose rupture during rebar bundle hoisting. Area cordoned off; spill containment sand applied.",
        reportedBy: "Alex Engineer (Lead Site Inspector)",
        status: "OPEN",
      },
    ],
  });
  console.log("✅ Seeded site safety & OSHA compliance incidents");

  console.log("🎉 Database seeding completed successfully!");


}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
