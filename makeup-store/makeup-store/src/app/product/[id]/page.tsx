import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({ where: { id: params.id } });
  if (!product) return notFound();

  return (
    <main style={{ padding: 24 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={product.imageUrl ?? "https://via.placeholder.com/500"}
        alt={product.name}
        style={{ maxWidth: 400, borderRadius: 12 }}
      />
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p style={{ fontSize: 24, fontWeight: 700 }}>
        R$ {(product.price / 100).toFixed(2)}
      </p>
      {/* TODO: botão "Adicionar ao carrinho" — ligar no client state do carrinho */}
      <button>Adicionar ao carrinho</button>
    </main>
  );
}
