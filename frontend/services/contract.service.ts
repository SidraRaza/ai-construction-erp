import { db } from "@/lib/db";
import { ActivityLogService } from "@/services/activity-log.service";
import { requirePermission } from "@/services/rbac-guard";
import { Role } from "@/lib/rbac";

export type CreateContractInput = {
  projectId: string;
  subcontractorName: string;
  tradeScope: string;
  contractValue: number;
  startDate?: Date | string;
  endDate?: Date | string;
};

export class ContractService {
  static async createContract(
    companyId: string,
    userId: string,
    userRole: Role,
    data: CreateContractInput
  ) {
    requirePermission(userRole, "manage:projects");

    const documentRecord = await db.document.create({
      data: {
        companyId,
        projectId: data.projectId,
        type: "CONTRACT",
        url: `https://storage.buildcorp.com/contracts/${Date.now()}_contract.pdf`,
        uploadedById: userId,
      },
    });

    await ActivityLogService.log({
      companyId,
      userId,
      action: "CREATE_SUBCONTRACTOR_CONTRACT",
      entityType: "Document",
      entityId: documentRecord.id,
      meta: { subcontractorName: data.subcontractorName, tradeScope: data.tradeScope, contractValue: data.contractValue },
    });

    return {
      id: documentRecord.id,
      projectId: data.projectId,
      subcontractorName: data.subcontractorName,
      tradeScope: data.tradeScope,
      contractValue: data.contractValue,
      status: "ACTIVE",
      documentUrl: documentRecord.url,
      createdAt: documentRecord.createdAt,
    };
  }

  static async getContracts(companyId: string, projectId?: string) {
    const whereClause: Record<string, unknown> = { companyId, type: "CONTRACT" };
    if (projectId) whereClause.projectId = projectId;

    return db.document.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });
  }
}
