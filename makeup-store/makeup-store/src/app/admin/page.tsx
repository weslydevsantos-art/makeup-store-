import Link from "next/link";

// Ponto de entrada do admin: dois botões grandes, sem menu complicado.
// Pensado pra alguém que não tem intimidade com tecnologia — nada de
// abreviação, ícone sem legenda, ou termo técnico.

export default function AdminHomePage() {
  return (
    <main style={{ padding: 24, maxWidth: 480, fontSize: 16 }}>
      <h1 style={{ fontSize: 26 }}>Painel da loja</h1>
      <p style={{ color: "#666", marginBottom: 24 }}>O que você quer fazer?</p>

      <div style={{ display: "grid", gap: 16 }}>
        <Link
          href="/admin/products"
          style={{
            display: "block",
            padding: 20,
            border: "1px solid #ddd",
            borderRadius: 12,
            textAlign: "center",
            fontSize: 18,
            fontWeight: 700,
            textDecoration: "none",
            color: "#1a1a1a"
          }}
        >
          🛍️ Cadastrar produtos
        </Link>

        <Link
          href="/admin/orders"
          style={{
            display: "block",
            padding: 20,
            border: "1px solid #ddd",
            borderRadius: 12,
            textAlign: "center",
            fontSize: 18,
            fontWeight: 700,
            textDecoration: "none",
            color: "#1a1a1a"
          }}
        >
          📦 Ver pedidos
        </Link>
      </div>
    </main>
  );
}
