"use client";

import Link from "next/link";

export default function CheckoutErrorPage() {
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
            background: "var(--color-error-bg)",
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
            stroke="var(--color-error)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
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
          Algo deu errado
        </h1>

        <p
          style={{
            color: "var(--color-charcoal)",
            marginBottom: "2rem",
            lineHeight: 1.6,
          }}
        >
          Infelizmente nao foi possivel processar seu pagamento. Nenhuma cobranca foi realizada.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Link href="/checkout" className="btn btn-primary" style={{ display: "inline-flex" }}>
            Tentar novamente
          </Link>
          <Link
            href="/cart"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-rose)",
              textDecoration: "none",
              fontSize: "0.875rem",
            }}
          >
            Voltar para o carrinho
          </Link>
        </div>
      </div>
    </div>
  );
}
