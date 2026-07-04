"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

  const formatPrice = (cents: number) => {
    return (cents / 100).toFixed(2).replace(".", ",");
  };

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: "2rem 1rem" }}>
        <div
          style={{
            textAlign: "center",
            padding: "4rem 1rem",
            background: "var(--color-white)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              margin: "0 auto 1.5rem",
              background: "var(--color-cream-dark)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-rose)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.75rem",
              marginBottom: "0.75rem",
              color: "var(--color-charcoal)",
            }}
          >
            Seu carrinho esta vazio
          </h1>
          <p
            style={{
              color: "var(--color-rose)",
              marginBottom: "1.5rem",
            }}
          >
            Navegue pela loja e encontre produtos lindos!
          </p>
          <Link href="/" className="btn btn-primary">
            Ver produtos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "2rem 1rem" }}>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "2rem",
          marginBottom: "1.5rem",
          textAlign: "center",
        }}
      >
        Seu Carrinho
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "2rem",
        }}
      >
        {/* Cart Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {items.map((item) => (
            <div
              key={item.productId}
              style={{
                display: "flex",
                gap: "1rem",
                background: "var(--color-white)",
                borderRadius: "var(--radius-lg)",
                padding: "1rem",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              {/* Product Image */}
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  flexShrink: 0,
                  background: "var(--color-cream-dark)",
                  borderRadius: "var(--radius-md)",
                  overflow: "hidden",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl ?? "https://images.pexels.com/photos/3685523/pexels-photo-3685523.jpeg?auto=compress&cs=tinysrgb&w=200"}
                  alt={item.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>

              {/* Product Details */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Link
                    href={`/product/${item.productId}`}
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "1rem",
                      fontWeight: 500,
                      color: "var(--color-charcoal)",
                      textDecoration: "none",
                    }}
                  >
                    {item.name}
                  </Link>
                  <button
                    onClick={() => removeItem(item.productId)}
                    style={{
                      background: "transparent",
                      border: "none",
                      padding: "0.25rem",
                      cursor: "pointer",
                      color: "var(--color-rose)",
                    }}
                    aria-label="Remover item"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </button>
                </div>

                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.125rem",
                    fontWeight: 600,
                    color: "var(--color-terracotta)",
                  }}
                >
                  R$ {formatPrice(item.price)}
                </p>

                {/* Quantity Controls */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginTop: "auto",
                  }}
                >
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    style={{
                      width: "32px",
                      height: "32px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "var(--color-cream-dark)",
                      border: "none",
                      borderRadius: "var(--radius-sm)",
                      cursor: "pointer",
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: "var(--color-charcoal)",
                    }}
                    aria-label="Diminuir quantidade"
                  >
                    -
                  </button>
                  <span
                    style={{
                      minWidth: "2rem",
                      textAlign: "center",
                      fontWeight: 500,
                    }}
                  >
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    style={{
                      width: "32px",
                      height: "32px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "var(--color-cream-dark)",
                      border: "none",
                      borderRadius: "var(--radius-sm)",
                      cursor: "pointer",
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: "var(--color-charcoal)",
                    }}
                    aria-label="Aumentar quantidade"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Subtotal */}
              <div
                style={{
                  textAlign: "right",
                  alignSelf: "flex-end",
                }}
              >
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--color-rose)",
                    marginBottom: "0.25rem",
                  }}
                >
                  Subtotal
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.125rem",
                    fontWeight: 600,
                    color: "var(--color-charcoal)",
                  }}
                >
                  R$ {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div
          style={{
            background: "var(--color-white)",
            borderRadius: "var(--radius-lg)",
            padding: "1.5rem",
            boxShadow: "var(--shadow-sm)",
            height: "fit-content",
            position: "sticky",
            top: "80px",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.25rem",
              marginBottom: "1rem",
              paddingBottom: "1rem",
              borderBottom: "1px solid var(--color-nude)",
            }}
          >
            Resumo do pedido
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--color-rose)" }}>
                {totalItems} {totalItems === 1 ? "item" : "itens"}
              </span>
              <span>R$ {formatPrice(totalPrice)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--color-rose)" }}>Frete</span>
              <span style={{ color: "var(--color-success)" }}>A calcular</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: "0.75rem",
                marginTop: "0.5rem",
                borderTop: "1px solid var(--color-nude)",
              }}
            >
              <span style={{ fontWeight: 600 }}>Total</span>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.5rem",
                  fontWeight: 600,
                  color: "var(--color-terracotta)",
                }}
              >
                R$ {formatPrice(totalPrice)}
              </span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="btn btn-primary btn-lg"
            style={{
              width: "100%",
              marginTop: "1.5rem",
              display: "block",
              textAlign: "center",
              textDecoration: "none",
            }}
          >
            Finalizar compra
          </Link>

          <Link
            href="/"
            style={{
              display: "block",
              textAlign: "center",
              marginTop: "1rem",
              color: "var(--color-rose)",
              textDecoration: "none",
              fontSize: "0.875rem",
            }}
          >
            Continuar comprando
          </Link>
        </div>
      </div>
    </div>
  );
}
