import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  const passwordHash = await bcrypt.hash("Password123!", 10);

  // 1. Create Default Company
  const company = await prisma.company.create({
    data: {
      name: "BuildCorp Solutions",
      address: "123 Construction Boulevard, Suite 400",
      taxNumber: "TX-998877",
      bankDetails: "Bank of America - IBAN US99BOFA123456789",
      subscriptionPlan: "ENTERPRISE",
      status: "ACTIVE",
    },
  });
  console.log(`✅ Created Company: ${company.name}`);

  // 2. Create Users across Roles
  await prisma.user.create({
    data: {
      companyId: company.id,
      name: "Super Admin User",
      email: "superadmin@buildcorp.com",
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

  await prisma.user.create({
    data: {
      companyId: company.id,
      name: "Robert Client",
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
      address: "456 Skyline Drive",
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
          { userId: engineer.id, roleOnProject: "Site Engineer" },
          { userId: labour.id, roleOnProject: "Mason Lead" },
        ],
      },
    },
  });

  console.log(`✅ Created Sample Project: ${project.name}`);
  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
