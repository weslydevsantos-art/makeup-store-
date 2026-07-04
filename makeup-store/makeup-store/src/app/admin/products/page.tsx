"use client";

import { useState } from "react";
import { useToast } from "@/components/toast";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  costPrice: number;
  source: "OWN_STOCK" | "DROPSHIP_JESSIMAKE";
  supplierSku: string | null;
  stockQty: number;
  active: boolean;
  imageUrl: string | null;
};

export default function AdminProductsPage() {
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState<Product[] | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    imageUrl: "",
    price: "",
    costPrice: "",
    source: "OWN_STOCK" as "OWN_STOCK" | "DROPSHIP_JESSIMAKE",
    supplierSku: "",
    stockQty: "0"
  });

  async function loadProducts() {
    setLoading(true);
    const res = await fetch("/api/admin/products", {
      headers: { "x-admin-password": password }
    });
    setLoading(false);
    if (res.ok) {
      setProducts(await res.json());
    } else {
      showToast("Senha incorreta. Tente novamente.", "error");
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": password
      },
      body: JSON.stringify({
        name: form.name,
        slug: form.slug,
        description: form.description || undefined,
        imageUrl: form.imageUrl || undefined,
        price: Math.round(parseFloat(form.price) * 100),
        costPrice: Math.round(parseFloat(form.costPrice) * 100),
        source: form.source,
        supplierSku: form.supplierSku || undefined,
        stockQty: parseInt(form.stockQty || "0", 10)
      })
    });

    setSaving(false);

    if (res.ok) {
      showToast("Produto cadastrado com sucesso!", "success");
      setForm({
        name: "",
        slug: "",
        description: "",
        imageUrl: "",
        price: "",
        costPrice: "",
        source: "OWN_STOCK",
        supplierSku: "",
        stockQty: "0"
      });
      loadProducts();
    } else {
      const err = await res.json();
      showToast("Erro ao cadastrar: " + (err.error?.message || "Verifique os dados"), "error");
    }
  }

  async function toggleActive(product: Product) {
    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": password
      },
      body: JSON.stringify({ active: !product.active })
    });
    if (res.ok) {
      showToast(product.active ? "Produto desativado" : "Produto reativado!", "success");
      loadProducts();
    } else {
      showToast("Erro ao atualizar produto", "error");
    }
  }

  const formatPrice = (cents: number) => (cents / 100).toFixed(2).replace(".", ",");

  return (
    <div className="container" style={{ padding: "2rem 1rem", maxWidth: "800px" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <Link
          href="/admin"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "var(--color-rose)",
            textDecoration: "none",
            fontSize: "0.875rem",
            marginBottom: "1rem",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 19-7-7 7-7"/>
          </svg>
          Voltar
        </Link>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", marginBottom: "0.5rem" }}>
          Meus Produtos
        </h1>
        <p style={{ color: "var(--color-rose)" }}>
          Aqui voce cadastra o que vai aparecer na sua loja.
        </p>
      </div>

      {/* Login */}
      {!products && (
        <div
          style={{
            background: "var(--color-white)",
            borderRadius: "var(--radius-lg)",
            padding: "1.5rem",
            boxShadow: "var(--shadow-sm)",
            marginBottom: "1.5rem",
          }}
        >
          <p style={{ marginBottom: "1rem", color: "var(--color-charcoal)" }}>
            Digite a senha para acessar:
          </p>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && loadProducts()}
              className="input"
              style={{ flex: 1 }}
            />
            <button onClick={loadProducts} className="btn btn-primary" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </div>
        </div>
      )}

      {/* Add Product Form */}
      {products && (
        <div
          style={{
            background: "var(--color-white)",
            borderRadius: "var(--radius-lg)",
            padding: "1.5rem",
            boxShadow: "var(--shadow-sm)",
            marginBottom: "1.5rem",
          }}
        >
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", marginBottom: "1rem" }}>
            Adicionar um produto novo
          </h2>

          <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label className="label">Esse produto e...</label>
              <select
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value as any })}
                className="input"
              >
                <option value="OWN_STOCK">Meu, que eu mesma guardo e envio</option>
                <option value="DROPSHIP_JESSIMAKE">Da Jessi Make (ela envia direto pro cliente)</option>
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <input
                placeholder="Nome do produto"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input"
                required
              />
              <input
                placeholder="Slug (ex: base-matte-30ml)"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="input"
                required
              />
            </div>

            <textarea
              placeholder="Descricao do produto"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input"
              rows={3}
              style={{ resize: "vertical" }}
            />

            <input
              placeholder="URL da foto (ex: https://...)"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="input"
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <input
                type="number"
                step="0.01"
                placeholder="Preco de venda (R$)"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="input"
                required
              />
              <input
                type="number"
                step="0.01"
                placeholder="Custo (R$)"
                value={form.costPrice}
                onChange={(e) => setForm({ ...form, costPrice: e.target.value })}
                className="input"
                required
              />
            </div>

            {form.source === "DROPSHIP_JESSIMAKE" ? (
              <input
                placeholder="SKU/referencia na Jessi Make (obrigatorio)"
                value={form.supplierSku}
                onChange={(e) => setForm({ ...form, supplierSku: e.target.value })}
                className="input"
                required
              />
            ) : (
              <input
                type="number"
                placeholder="Quantidade em estoque"
                value={form.stockQty}
                onChange={(e) => setForm({ ...form, stockQty: e.target.value })}
                className="input"
              />
            )}

            <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
              {saving ? "Salvando..." : "Cadastrar produto"}
            </button>
          </form>
        </div>
      )}

      {/* Products List */}
      {products && (
        <div
          style={{
            background: "var(--color-white)",
            borderRadius: "var(--radius-lg)",
            padding: "1.5rem",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", marginBottom: "1rem" }}>
            Produtos cadastrados
          </h2>

          {products.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
                background: "var(--color-cream-dark)",
                borderRadius: "var(--radius-md)",
                color: "var(--color-rose)",
              }}
            >
              <p>Voce ainda nao tem produtos cadastrados.</p>
              <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
                Use o formulario acima para adicionar seu primeiro produto!
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {products.map((p) => (
                <div
                  key={p.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1rem",
                    background: p.active ? "var(--color-cream)" : "var(--color-cream-dark)",
                    borderRadius: "var(--radius-md)",
                    opacity: p.active ? 1 : 0.7,
                    border: p.active ? "1px solid var(--color-nude)" : "1px solid transparent",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      background: "var(--color-white)",
                      borderRadius: "var(--radius-sm)",
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    {p.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.imageUrl} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-rose)" strokeWidth="1.5">
                          <rect width="18" height="18" x="3" y="3" rx="2" />
                          <circle cx="9" cy="9" r="2" />
                          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    <span style={{ display: "block", fontWeight: 500, marginBottom: "0.25rem" }}>
                      {p.name}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--color-rose)" }}>
                      {p.source === "OWN_STOCK" ? "Seu estoque" : "Jessi Make"} {" "}
                      {p.source === "OWN_STOCK" && `| ${p.stockQty} un`}
                    </span>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <span style={{ display: "block", fontWeight: 600, color: "var(--color-terracotta)" }}>
                      R$ {formatPrice(p.price)}
                    </span>
                    <span
                      style={{
                        display: "inline-block",
                        fontSize: "0.75rem",
                        padding: "0.125rem 0.5rem",
                        borderRadius: "var(--radius-full)",
                        background: p.active ? "var(--color-success-bg)" : "var(--color-error-bg)",
                        color: p.active ? "var(--color-success)" : "var(--color-error)",
                        marginTop: "0.25rem",
                      }}
                    >
                      {p.active ? "Ativo" : "Inativo"}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleActive(p)}
                    className="btn btn-sm"
                    style={{
                      background: p.active ? "var(--color-error-bg)" : "var(--color-success-bg)",
                      color: p.active ? "var(--color-error)" : "var(--color-success)",
                    }}
                  >
                    {p.active ? "Desativar" : "Reativar"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
