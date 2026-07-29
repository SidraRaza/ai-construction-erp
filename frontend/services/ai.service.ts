import { db } from "@/lib/db";
import { FinancialsService } from "@/services/financials.service";
import { ActivityLogService } from "@/services/activity-log.service";
import { Role } from "@/lib/rbac";

export class AIService {
  static async generateDailyReport(projectId: string, engineerId: string, rawInput: string) {
    const project = await db.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new Error("Project not found");
    }

    const timestamp = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const aiGeneratedReport = `
# 🚧 Official Site Daily Progress Report

**Project Name:** ${project.name}
**Date:** ${timestamp}
**Engineer Input Summary:** "${rawInput}"

---

### Key Construction Milestones Executed Today:
1. **Work Completion:** Executed site activities based on field input: ${rawInput}.
2. **Quality Inspection:** Inspected structural integrity, material safety compliance, and site alignment.
3. **Labour Utilization:** Allocated active site workforce across masonry, steel fixing, and concrete pouring zones.

### Recommended Next Steps for Tomorrow:
- Proceed to curing, formwork stripping inspection, and secondary site material delivery check.
- Verify environmental & weather readiness prior to next major concrete pour.

*Report automatically synthesized via AI Construction ERP Engine.*
`.trim();

    const reportId = `dr_${Date.now()}`;

    await ActivityLogService.log({
      companyId: project.companyId,
      userId: engineerId,
      action: "GENERATE_AI_DAILY_REPORT",
      entityType: "DailyReport",
      entityId: reportId,
      meta: { projectId, rawInputLength: rawInput.length },
    });

    return {
      id: reportId,
      projectId,
      engineerId,
      rawInput,
      aiGeneratedReport,
    };
  }

  static async estimateProjectCost(description: string) {
    const normalizedDesc = description.toLowerCase();

    let materialCost = 350000;
    let labourCost = 150000;
    let estimatedDays = 120;

    if (normalizedDesc.includes("5 marla") || normalizedDesc.includes("small")) {
      materialCost = 2800000;
      labourCost = 1200000;
      estimatedDays = 90;
    } else if (normalizedDesc.includes("10 marla") || normalizedDesc.includes("medium")) {
      materialCost = 5500000;
      labourCost = 2200000;
      estimatedDays = 150;
    } else if (normalizedDesc.includes("kitchen") || normalizedDesc.includes("renovation")) {
      materialCost = 450000;
      labourCost = 180000;
      estimatedDays = 14;
    }

    const totalCost = materialCost + labourCost;

    const breakdown = [
      { category: "Cement & Concrete", estimatedCost: Math.round(materialCost * 0.35) },
      { category: "Steel Structure Reinforcement", estimatedCost: Math.round(materialCost * 0.30) },
      { category: "Bricks, Sand & Aggregate", estimatedCost: Math.round(materialCost * 0.20) },
      { category: "Plumbing & Electrical Conduit", estimatedCost: Math.round(materialCost * 0.15) },
      { category: "Site Labour & Operations", estimatedCost: labourCost },
    ];

    return {
      description,
      materialCost,
      labourCost,
      estimatedDays,
      totalCost,
      breakdown,
    };
  }

  static async generateDraftQuotation(
    companyId: string,
    userId: string,
    userRole: Role,
    clientId: string,
    description: string,
    projectId?: string
  ) {
    const estimate = await this.estimateProjectCost(description);

    const items = estimate.breakdown.map((b) => ({
      description: `${b.category} (${description})`,
      quantity: 1,
      unitRate: b.estimatedCost,
    }));

    return FinancialsService.createQuotation(
      companyId,
      userId,
      userRole,
      {
        clientId,
        projectId,
        items,
        gstPct: 17,
        discount: 0,
        notes: `AI-Drafted Quotation based on scope: "${description}". Pending Admin review & approval.`,
      },
      true
    );
  }

  static async chatAssistant(companyId: string, projectId: string, question: string) {
    const project = await db.project.findFirst({
      where: { id: projectId, companyId },
      include: {
        client: true,
        team: true,
        invoices: true,
      },
    });

    if (!project) {
      throw new Error("Project not found in your tenant scope");
    }

    const endDateFormatted = project.endDate
      ? new Date(project.endDate).toLocaleDateString()
      : "Not set";

    const normalizedQ = question.toLowerCase();
    let answer = "";
    const groundedOn = ["Project.name", "Project.progressPct", "Project.endDate", "Project.status"];

    if (normalizedQ.includes("complete") || normalizedQ.includes("kab") || normalizedQ.includes("when")) {
      answer = `Project "${project.name}" is currently at ${project.progressPct}% completion with status "${project.status}". Scheduled target completion date is ${endDateFormatted}.`;
    } else if (normalizedQ.includes("budget") || normalizedQ.includes("cost") || normalizedQ.includes("paisa")) {
      answer = `Project budget is $${project.budget.toString()}. There are ${project.invoices.length} invoices generated for client ${project.client?.name || "Client"}.`;
    } else {
      answer = `Project "${project.name}" status is "${project.status}" (${project.progressPct}% progress). End date: ${endDateFormatted}. Assigned team members: ${project.team.length}.`;
    }

    return {
      projectId,
      question,
      answer,
      groundedOn,
    };
  }
}
