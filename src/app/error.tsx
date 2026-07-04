"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className="container"
      style={{
        padding: "2rem 1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "80px",
          height: "80px",
          marginBottom: "1.5rem",
          background: "var(--color-error-bg)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-error)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </div>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "2rem",
          marginBottom: "0.5rem",
        }}
      >
        Ops! Algo deu errado
      </h1>
      <p style={{ color: "var(--color-rose)", marginBottom: "2rem", maxWidth: "400px" }}>
        Ocorreu um erro inesperado. Por favor, tente novamente.
      </p>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
        <button onClick={reset} className="btn btn-primary">
          Tentar novamente
        </button>
        <Link href="/" className="btn btn-secondary">
          Voltar para a loja
        </Link>
      </div>
    </div>
  );
}
