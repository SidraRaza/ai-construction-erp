import { db } from "@/lib/db";
import { CreateSupplierInput, CreatePurchaseOrderInput } from "@/validations/supplier.validation";
import { ActivityLogService } from "@/services/activity-log.service";
import { requirePermission } from "@/services/rbac-guard";
import { Role } from "@/lib/rbac";
import { Prisma } from "@prisma/client";

export class SupplierService {
  static async createSupplier(
    companyId: string,
    userId: string,
    userRole: Role,
    data: CreateSupplierInput
  ) {
    requirePermission(userRole, "manage:projects");

    const supplier = await db.supplier.create({
      data: {
        companyId,
        name: data.name,
        contact: data.contact,
        category: data.category,
        rating: data.rating ? new Prisma.Decimal(data.rating) : new Prisma.Decimal(5.0),
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
    return db.supplier.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
    });
  }

  static async createPurchaseOrder(
    companyId: string,
    userId: string,
    userRole: Role,
    data: CreatePurchaseOrderInput
  ) {
    requirePermission(userRole, "manage:projects");

    const poId = `po_${Date.now()}`;

    await ActivityLogService.log({
      companyId,
      userId,
      action: "CREATE_PURCHASE_ORDER",
      entityType: "PurchaseOrder",
      entityId: poId,
      meta: {
        supplierId: data.supplierId,
        materialId: data.materialId,
        qty: data.qty,
        totalAmount: data.totalAmount,
      },
    });

    return {
      id: poId,
      supplierId: data.supplierId,
      materialId: data.materialId,
      qty: data.qty,
      totalAmount: data.totalAmount,
      status: "ISSUED",
      createdAt: new Date(),
    };
  }

  static async getAutoPurchaseOrderSuggestions(companyId: string) {
    const lowStockMaterials = await db.material.findMany({
      where: { companyId },
    });

    return lowStockMaterials
      .filter((m) => Number(m.stockQty) < Number(m.reorderLevel))
      .map((m) => ({
        materialId: m.id,
        materialName: m.name,
        currentStock: Number(m.stockQty),
        reorderLevel: Number(m.reorderLevel),
        suggestedOrderQty: Math.max(50, Number(m.reorderLevel) * 2),
      }));
  }
}
