import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AddToCartButton } from "@/components/add-to-cart-button";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({ where: { id: params.id } });
  if (!product) return notFound();

  return (
    <div className="container" style={{ padding: "2rem 1rem" }}>
      {/* Breadcrumb */}
      <nav
        style={{
          marginBottom: "1.5rem",
          fontSize: "0.875rem",
          color: "var(--color-rose)",
        }}
      >
        <Link
          href="/"
          style={{
            color: "inherit",
            textDecoration: "none",
            transition: "color 0.2s ease",
          }}
        >
          Inicio
        </Link>
        <span style={{ margin: "0 0.5rem" }}>/</span>
        <span style={{ color: "var(--color-charcoal)" }}>{product.name}</span>
      </nav>

      {/* Product Detail */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "2rem",
        }}
      >
        {/* Product Image */}
        <div
          style={{
            position: "relative",
            aspectRatio: "1 / 1",
            maxWidth: "500px",
            margin: "0 auto",
            background: "var(--color-cream-dark)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            boxShadow: "var(--shadow-md)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imageUrl ?? "https://images.pexels.com/photos/3685523/pexels-photo-3685523.jpeg?auto=compress&cs=tinysrgb&w=600"}
            alt={product.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>

        {/* Product Info */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "2rem",
              fontWeight: 600,
              color: "var(--color-black)",
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            {product.name}
          </h1>

          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "2rem",
              fontWeight: 600,
              color: "var(--color-terracotta)",
              margin: 0,
            }}
          >
            R$ {(product.price / 100).toFixed(2).replace(".", ",")}
          </p>

          {product.description && (
            <p
              style={{
                fontSize: "1rem",
                lineHeight: 1.7,
                color: "var(--color-charcoal)",
                margin: "0.5rem 0",
              }}
            >
              {product.description}
            </p>
          )}

          <div
            style={{
              marginTop: "1rem",
              padding: "1.5rem",
              background: "var(--color-white)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
              }}
            />
          </div>

          {/* Trust badges */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              marginTop: "1rem",
              padding: "1rem",
              background: "var(--color-cream-dark)",
              borderRadius: "var(--radius-md)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "var(--color-charcoal)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Compra segura
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "var(--color-charcoal)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="14" x="2" y="5" rx="2"/>
                <path d="M2 10h20"/>
              </svg>
              Pagamento seguro com Pix ou cartao
            </div>
          </div>
        </div>
      </div>

      {/* Continue Shopping */}
      <div
        style={{
          marginTop: "2rem",
          textAlign: "center",
        }}
      >
        <Link
          href="/"
          className="btn btn-ghost"
          style={{
            textDecoration: "none",
            color: "var(--color-rose)",
          }}
        >
          Voltar para a loja
        </Link>
      </div>
    </div>
  );
}
