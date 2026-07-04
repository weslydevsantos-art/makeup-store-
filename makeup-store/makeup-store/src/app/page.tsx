import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <main>
      <h1 style={{ padding: "24px 24px 0" }}>Loja de Maquiagem</h1>
      <div className="grid">
        {products.map((product) => (
          <Link key={product.id} href={`/product/${product.id}`} className="card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.imageUrl ?? "https://via.placeholder.com/300"}
              alt={product.name}
              style={{ width: "100%", borderRadius: 8 }}
            />
            <h3>{product.name}</h3>
            <p>R$ {(product.price / 100).toFixed(2)}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
