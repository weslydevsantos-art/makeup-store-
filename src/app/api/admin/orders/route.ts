import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(req: Request) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  const orders = await prisma.order.findMany({
    where: { status: { in: ["PAID", "PROCESSING", "SHIPPED"] } },
    include: { items: true },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(orders);
}
