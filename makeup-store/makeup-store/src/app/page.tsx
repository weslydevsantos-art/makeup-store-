import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="container" style={{ paddingBottom: "3rem" }}>
      {/* Hero Section */}
      <section
        style={{
          textAlign: "center",
          padding: "3rem 1rem",
          borderBottom: "1px solid var(--color-nude)",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "2.5rem",
            fontWeight: 600,
            marginBottom: "0.75rem",
            color: "var(--color-black)",
          }}
        >
          Belle
        </h1>
        <p
          style={{
            color: "var(--color-rose)",
            fontSize: "1.125rem",
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
          }}
        >
          Maquiagem com Amor
        </p>
      </section>

      {/* Products Section */}
      <section style={{ padding: "2rem 0" }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.75rem",
            fontWeight: 600,
            marginBottom: "1.5rem",
            textAlign: "center",
          }}
        >
          Nossos Produtos
        </h2>

        {products.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem 1rem",
              background: "var(--color-white)",
              borderRadius: "var(--radius-lg)",
              color: "var(--color-rose)",
            }}
          >
            <p style={{ fontSize: "1rem", fontFamily: "var(--font-body)" }}>
              Em breve teremos produtos disponiveis.
            </p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                style={{
                  display: "block",
                  background: "var(--color-white)",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  boxShadow: "var(--shadow-sm)",
                  transition: "all 0.25s ease",
                  textDecoration: "none",
                  color: "inherit",
                }}
                className="card"
              >
                <div
                  style={{
                    position: "relative",
                    aspectRatio: "1 / 1",
                    background: "var(--color-cream-dark)",
                    overflow: "hidden",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.imageUrl ?? "https://images.pexels.com/photos/3685523/pexels-photo-3685523.jpeg?auto=compress&cs=tinysrgb&w=500"}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.4s ease",
                    }}
                  />
                </div>
                <div style={{ padding: "1rem" }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.9375rem",
                      fontWeight: 500,
                      marginBottom: "0.5rem",
                      color: "var(--color-charcoal)",
                      lineHeight: 1.3,
                    }}
                  >
                    {product.name}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.125rem",
                      fontWeight: 600,
                      color: "var(--color-terracotta)",
                    }}
                  >
                    R$ {(product.price / 100).toFixed(2).replace(".", ",")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
