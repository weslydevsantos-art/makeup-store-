import Link from "next/link";

export default function NotFound() {
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
          fontSize: "6rem",
          marginBottom: "1rem",
          opacity: 0.3,
        }}
      >
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="var(--color-rose)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="m15 9-6 6" />
          <path d="m9 9 6 6" />
        </svg>
      </div>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "2rem",
          marginBottom: "0.5rem",
        }}
      >
        Pagina nao encontrada
      </h1>
      <p style={{ color: "var(--color-rose)", marginBottom: "2rem", maxWidth: "400px" }}>
        A pagina que voce esta procurando nao existe ou foi movida.
      </p>
      <Link href="/" className="btn btn-primary">
        Voltar para a loja
      </Link>
    </div>
  );
}
