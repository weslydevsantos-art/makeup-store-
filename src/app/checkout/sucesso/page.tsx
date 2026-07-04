"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-context";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    if (!cleared) {
      clearCart();
      setCleared(true);
    }
  }, [clearCart, cleared]);

  return (
    <div
      className="container"
      style={{
        padding: "2rem 1rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh",
      }}
    >
      <div
        style={{
          textAlign: "center",
          maxWidth: "400px",
          background: "var(--color-white)",
          borderRadius: "var(--radius-lg)",
          padding: "3rem 2rem",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            margin: "0 auto 1.5rem",
            background: "var(--color-success-bg)",
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
            stroke="var(--color-success)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "2rem",
            marginBottom: "1rem",
            color: "var(--color-black)",
          }}
        >
          Pagamento confirmado!
        </h1>

        <p
          style={{
            color: "var(--color-charcoal)",
            marginBottom: "1rem",
            lineHeight: 1.6,
          }}
        >
          Obrigada por comprar com a Belle! Seu pedido foi recebido e ja estamos separando tudo com carinho.
        </p>

        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--color-rose)",
            marginBottom: "2rem",
          }}
        >
          Enviamos os detalhes do pedido para seu e-mail.
        </p>

        <Link href="/" className="btn btn-primary" style={{ display: "inline-flex" }}>
          Voltar para a loja
        </Link>
      </div>
    </div>
  );
}
