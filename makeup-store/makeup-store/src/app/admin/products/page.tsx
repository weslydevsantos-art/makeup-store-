"use client";

import { useEffect, useState } from "react";

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

// Tela de cadastro/edição de produtos. Um mesmo formulário serve pros
// dois tipos — o campo "supplierSku" só aparece/é obrigatório quando
// source = DROPSHIP_JESSIMAKE.

export default function AdminProductsPage() {
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState<Product[] | null>(null);
  const [saving, setSaving] = useState(false);

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
    const res = await fetch("/api/admin/products", {
      headers: { "x-admin-password": password }
    });
    if (res.ok) setProducts(await res.json());
    else alert("Senha incorreta");
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
        price: Math.round(parseFloat(form.price) * 100),       // reais -> centavos
        costPrice: Math.round(parseFloat(form.costPrice) * 100),
        source: form.source,
        supplierSku: form.supplierSku || undefined,
        stockQty: parseInt(form.stockQty || "0", 10)
      })
    });

    setSaving(false);

    if (res.ok) {
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
      alert("Erro: " + JSON.stringify(err.error));
    }
  }

  async function toggleActive(product: Product) {
    await fetch(`/api/admin/products/${product.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": password
      },
      body: JSON.stringify({ active: !product.active })
    });
    loadProducts();
  }

  return (
    <main style={{ padding: 24, maxWidth: 720, fontSize: 16 }}>
      <h1 style={{ fontSize: 26 }}>Meus produtos</h1>
      <p style={{ color: "#666" }}>Aqui você cadastra o que vai aparecer na sua loja.</p>

      <div style={{ marginBottom: 24, display: "flex", gap: 8 }}>
        <input
          type="password"
          placeholder="Digite a senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: 10, fontSize: 16, flex: 1 }}
        />
        <button onClick={loadProducts} style={{ padding: "10px 16px", fontSize: 16 }}>
          Entrar
        </button>
      </div>

      <form onSubmit={handleCreate} style={{ display: "grid", gap: 10, marginBottom: 32 }}>
        <h2 style={{ fontSize: 20 }}>Adicionar um produto novo</h2>

        <label>
          Esse produto é...
          <select
            value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value as any })}
            style={{ display: "block", padding: 10, fontSize: 16, width: "100%", marginTop: 4 }}
          >
            <option value="OWN_STOCK">Meu, que eu mesma guardo e envio</option>
            <option value="DROPSHIP_JESSIMAKE">Da Jessi Make (ela envia direto pro cliente)</option>
          </select>
        </label>

        <input
          placeholder="Nome do produto"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="Slug (ex: base-matte-30ml)"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          required
        />
        <textarea
          placeholder="Descrição"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          placeholder="URL da foto"
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
        />

        <input
          type="number"
          step="0.01"
          placeholder="Preço de venda (R$)"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <input
          type="number"
          step="0.01"
          placeholder="Custo (R$)"
          value={form.costPrice}
          onChange={(e) => setForm({ ...form, costPrice: e.target.value })}
          required
        />

        {form.source === "DROPSHIP_JESSIMAKE" ? (
          <input
            placeholder="SKU/referência na Jessi Make (obrigatório)"
            value={form.supplierSku}
            onChange={(e) => setForm({ ...form, supplierSku: e.target.value })}
            required
          />
        ) : (
          <input
            type="number"
            placeholder="Quantidade em estoque"
            value={form.stockQty}
            onChange={(e) => setForm({ ...form, stockQty: e.target.value })}
          />
        )}

        <button type="submit" disabled={saving}>
          {saving ? "Salvando..." : "Cadastrar produto"}
        </button>
      </form>

      <h2>Produtos cadastrados</h2>
      <table width="100%" cellPadding={6} style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Preço</th>
            <th>Estoque/SKU</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products?.map((p) => (
            <tr key={p.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
              <td>{p.name}</td>
              <td>{p.source === "OWN_STOCK" ? "Próprio" : "Dropship"}</td>
              <td>R$ {(p.price / 100).toFixed(2)}</td>
              <td>{p.source === "OWN_STOCK" ? p.stockQty : p.supplierSku}</td>
              <td>{p.active ? "Ativo" : "Inativo"}</td>
              <td>
                <button onClick={() => toggleActive(p)}>
                  {p.active ? "Desativar" : "Reativar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
