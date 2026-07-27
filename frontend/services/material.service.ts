import { db } from "@/lib/db";
import { CreateMaterialInput, AdjustStockInput } from "@/validations/material.validation";
import { ActivityLogService } from "@/services/activity-log.service";
import { requirePermission } from "@/services/rbac-guard";
import { Role } from "@/lib/rbac";
import { Prisma } from "@prisma/client";

export class MaterialService {
  static async createMaterial(
    companyId: string,
    userId: string,
    userRole: Role,
    data: CreateMaterialInput
  ) {
    requirePermission(userRole, "manage:projects");

    const material = await db.material.create({
      data: {
        companyId,
        name: data.name,
        unit: data.unit,
        stockQty: new Prisma.Decimal(data.stockQty),
        reorderLevel: new Prisma.Decimal(data.reorderLevel),
        supplierId: data.supplierId,
      },
    });

    await ActivityLogService.log({
      companyId,
      userId,
      action: "CREATE_MATERIAL",
      entityType: "Material",
      entityId: material.id,
      meta: { name: material.name, stockQty: data.stockQty },
    });

    return material;
  }

  static async getMaterials(companyId: string) {
    const materials = await db.material.findMany({
      where: { companyId },
      orderBy: { name: "asc" },
    });

    return materials.map((m) => ({
      ...m,
      isLowStock: m.stockQty.lessThanOrEqualTo(m.reorderLevel),
    }));
  }

  static async adjustStock(
    companyId: string,
    userId: string,
    userRole: Role,
    materialId: string,
    data: AdjustStockInput
  ) {
    const material = await db.material.findFirst({
      where: { id: materialId, companyId },
    });

    if (!material) {
      throw new Error("Material not found in your company");
    }

    const newQty = material.stockQty.add(new Prisma.Decimal(data.adjustmentQty));
    if (newQty.isNegative()) {
      throw new Error("Stock quantity cannot drop below 0");
    }

    const updated = await db.material.update({
      where: { id: materialId },
      data: { stockQty: newQty },
    });

    await ActivityLogService.log({
      companyId,
      userId,
      action: "ADJUST_STOCK",
      entityType: "Material",
      entityId: materialId,
      meta: { adjustment: data.adjustmentQty, newStockQty: newQty.toNumber(), reason: data.reason },
    });

    return updated;
  }
}
