import { db } from "@/lib/db";
import { CreateSupplierInput, CreatePurchaseOrderInput } from "@/validations/supplier.validation";
import { ActivityLogService } from "@/services/activity-log.service";
import { requirePermission } from "@/services/rbac-guard";
import { Role } from "@/lib/rbac";

export class SupplierService {
  static async createSupplier(
    companyId: string,
    userId: string,
    userRole: Role,
    data: CreateSupplierInput
  ) {
    requirePermission(userRole, "manage:projects");

    const supplier = await db.client.create({
      data: {
        companyId,
        name: `${data.name} [Supplier: ${data.category}]`,
        contact: data.contact,
        email: data.email,
        address: data.address,
      },
    });

    await ActivityLogService.log({
      companyId,
      userId,
      action: "CREATE_SUPPLIER",
      entityType: "Supplier",
      entityId: supplier.id,
      meta: { supplierName: data.name, category: data.category },
    });

    return supplier;
  }

  static async getSuppliers(companyId: string) {
    return db.client.findMany({
      where: {
        companyId,
        name: { contains: "[Supplier:" },
      },
      orderBy: { name: "asc" },
    });
  }

  /**
   * Auto Purchase Order Suggestion Engine
   * Scans inventory for items where stock <= reorderLevel and generates PO drafts
   */
  static async getAutoPurchaseOrderSuggestions(companyId: string) {
    const lowStockMaterials = await db.material.findMany({
      where: { companyId },
    });

    const suggestions = lowStockMaterials
      .filter((m) => m.stockQty.lessThanOrEqualTo(m.reorderLevel))
      .map((m) => {
        const suggestedQty = m.reorderLevel.mul(3).minus(m.stockQty);
        return {
          materialId: m.id,
          materialName: m.name,
          currentStock: m.stockQty.toNumber(),
          reorderLevel: m.reorderLevel.toNumber(),
          suggestedReorderQty: Math.max(10, suggestedQty.toNumber()),
          unit: m.unit,
        };
      });

    return suggestions;
  }
}
