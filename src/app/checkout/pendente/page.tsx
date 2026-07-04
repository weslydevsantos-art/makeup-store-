"use client";

import Link from "next/link";

export default function CheckoutPendingPage() {
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
            background: "var(--color-warning-bg)",
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
            stroke="var(--color-gold)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
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
          Pagamento em analise
        </h1>

        <p
          style={{
            color: "var(--color-charcoal)",
            marginBottom: "1rem",
            lineHeight: 1.6,
          }}
        >
          Seu pagamento esta sendo processado. Assim que for aprovado, voce recebera uma confirmacao por e-mail.
        </p>

        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--color-rose)",
            marginBottom: "2rem",
          }}
        >
          Isso geralmente leva alguns minutos.
        </p>

        <Link href="/" className="btn btn-primary" style={{ display: "inline-flex" }}>
          Voltar para a loja
        </Link>
      </div>
    </div>
  );
}
