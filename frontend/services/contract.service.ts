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

    const contractId = `cnt_${Date.now()}`;
    const documentUrl = `https://storage.buildcorp.com/contracts/${Date.now()}_contract.pdf`;

    await ActivityLogService.log({
      companyId,
      userId,
      action: "CREATE_SUBCONTRACTOR_CONTRACT",
      entityType: "Contract",
      entityId: contractId,
      meta: {
        subcontractorName: data.subcontractorName,
        tradeScope: data.tradeScope,
        contractValue: data.contractValue,
        documentUrl,
      },
    });

    return {
      id: contractId,
      projectId: data.projectId,
      subcontractorName: data.subcontractorName,
      tradeScope: data.tradeScope,
      contractValue: data.contractValue,
      status: "ACTIVE",
      documentUrl,
      createdAt: new Date(),
    };
  }

  static async getContracts(companyId: string, projectId?: string) {
    const logs = await ActivityLogService.getLogs(companyId, 50);
    return logs
      .filter((l) => l.action === "CREATE_SUBCONTRACTOR_CONTRACT")
      .map((l) => {
        let metaObj: any = {};
        try {
          metaObj = l.meta ? JSON.parse(l.meta) : {};
        } catch (e) {}

        return {
          id: l.entityId || l.id,
          projectId: metaObj.projectId || "p_default",
          subcontractorName: metaObj.subcontractorName || "Trade Subcontractor",
          tradeScope: metaObj.tradeScope || "Civil / Masonry",
          contractValue: metaObj.contractValue || 50000,
          status: "ACTIVE",
          documentUrl: metaObj.documentUrl || `https://storage.buildcorp.com/contracts/${l.id}.pdf`,
          createdAt: l.createdAt,
        };
      });
  }
}
