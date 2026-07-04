import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

const updateSchema = z.object({
  itemId: z.string(),
  handoffStatus: z.enum(["PENDING", "HANDED_OFF", "SHIPPED_BY_SUPPLIER"]).optional(),
  supplierTracking: z.string().optional()
});

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { itemId, handoffStatus, supplierTracking } = parsed.data;

  const item = await prisma.orderItem.update({
    where: { id: itemId },
    data: {
      ...(handoffStatus && {
        handoffStatus,
        handoffAt: handoffStatus === "HANDED_OFF" ? new Date() : undefined
      }),
      ...(supplierTracking && { supplierTracking })
    }
  });

  // Se todos os itens do pedido já foram enviados (própria + fornecedora), marca o pedido como SHIPPED
  const allItems = await prisma.orderItem.findMany({ where: { orderId: params.id } });
  const allShipped = allItems.every(
    (i) => i.source === "OWN_STOCK" || i.handoffStatus === "SHIPPED_BY_SUPPLIER"
  );

  if (allShipped) {
    await prisma.order.update({ where: { id: params.id }, data: { status: "SHIPPED" } });
  }

  return NextResponse.json(item);
}
