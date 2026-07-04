import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  price: z.number().int().positive().optional(),
  costPrice: z.number().int().nonnegative().optional(),
  supplierSku: z.string().optional(),
  stockQty: z.number().int().nonnegative().optional(),
  active: z.boolean().optional()
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const product = await prisma.product.update({
    where: { id: params.id },
    data: parsed.data
  });

  return NextResponse.json(product);
}

// Não apaga de verdade (produto pode estar referenciado em pedidos antigos).
// Só marca como inativo, some da loja mas mantém histórico.
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  const product = await prisma.product.update({
    where: { id: params.id },
    data: { active: false }
  });

  return NextResponse.json(product);
}
