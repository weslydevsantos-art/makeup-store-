import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  price: z.number().int().positive(),       // em centavos
  costPrice: z.number().int().nonnegative(), // em centavos
  source: z.enum(["OWN_STOCK", "DROPSHIP_JESSIMAKE"]),
  supplierSku: z.string().optional(),
  stockQty: z.number().int().nonnegative().default(0)
});

export async function GET(req: Request) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  const body = await req.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;

  // Se for dropship, obriga ter o SKU da fornecedora — sem isso não tem
  // como saber o que repassar no momento do pedido.
  if (data.source === "DROPSHIP_JESSIMAKE" && !data.supplierSku) {
    return NextResponse.json(
      { error: "supplierSku é obrigatório para produtos DROPSHIP_JESSIMAKE" },
      { status: 400 }
    );
  }

  const product = await prisma.product.create({ data });
  return NextResponse.json(product, { status: 201 });
}
