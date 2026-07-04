import Link from "next/link";

export default function AdminHomePage() {
  return (
    <div
      className="container"
      style={{
        padding: "2rem 1rem",
        maxWidth: "500px",
        minHeight: "calc(100vh - 60px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "2rem",
            fontWeight: 600,
            marginBottom: "0.5rem",
          }}
        >
          Painel da Loja
        </h1>
        <p style={{ color: "var(--color-rose)", fontSize: "1.125rem", fontFamily: "var(--font-display)", fontStyle: "italic" }}>
          O que voce quer fazer?
        </p>
      </div>

      <div style={{ display: "grid", gap: "1rem" }}>
        <Link
          href="/admin/products"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            padding: "1.5rem",
            background: "var(--color-white)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-sm)",
            textDecoration: "none",
            color: "var(--color-charcoal)",
            transition: "all 0.25s ease",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              background: "var(--color-cream-dark)",
              borderRadius: "var(--radius-md)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-terracotta)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <div>
            <span style={{ display: "block", fontSize: "1.125rem", fontWeight: 600 }}>
              Cadastrar produtos
            </span>
            <span style={{ display: "block", fontSize: "0.875rem", color: "var(--color-rose)" }}>
              Adicionar ou editar produtos da loja
            </span>
          </div>
        </Link>

        <Link
          href="/admin/orders"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            padding: "1.5rem",
            background: "var(--color-white)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-sm)",
            textDecoration: "none",
            color: "var(--color-charcoal)",
            transition: "all 0.25s ease",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              background: "var(--color-cream-dark)",
              borderRadius: "var(--radius-md)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-gold)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m7.5 4.27 9 5.15" />
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
              <path d="m3.3 7 8.7 5 8.7-5" />
              <path d="M12 22V12" />
            </svg>
          </div>
          <div>
            <span style={{ display: "block", fontSize: "1.125rem", fontWeight: 600 }}>
              Ver pedidos
            </span>
            <span style={{ display: "block", fontSize: "0.875rem", color: "var(--color-rose)" }}>
              Acompanhar e enviar pedidos dos clientes
            </span>
          </div>
        </Link>
      </div>

      <p
        style={{
          textAlign: "center",
          fontSize: "0.875rem",
          color: "var(--color-rose)",
          marginTop: "2rem",
        }}
      >
        Escolha uma das opcoes acima para comecar
      </p>
    </div>
  );
}
