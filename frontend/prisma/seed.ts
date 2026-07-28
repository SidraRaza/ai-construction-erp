import { PrismaClient } from "@prisma/client";
import * as crypto from "crypto";

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function main() {
  console.log("🌱 Seeding database...");

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
      name: "Platform Owner",
      email: "owner@buildcorp.com",
      passwordHash,
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
