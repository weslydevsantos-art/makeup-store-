"use client";

import { useState } from "react";

// Esqueleto de checkout: formulário de dados do cliente + endereço,
// que chama POST /api/checkout e redireciona pro checkoutUrl (Mercado Pago).

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    // TODO: substituir por itens reais vindos do carrinho (state/localStorage)
    const items = [{ productId: "COLOQUE_O_ID_AQUI", quantity: 1 }];

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: formData.get("customerName"),
        customerEmail: formData.get("customerEmail"),
        customerPhone: formData.get("customerPhone"),
        shippingAddress: formData.get("shippingAddress"),
        shippingCity: formData.get("shippingCity"),
        shippingState: formData.get("shippingState"),
        shippingZip: formData.get("shippingZip"),
        items
      })
    });

    const data = await res.json();
    setLoading(false);

    if (data.checkoutUrl) {
      window.location.href = data.checkoutUrl;
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 480 }}>
      <h1>Finalizar compra</h1>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <input name="customerName" placeholder="Nome completo" required />
        <input name="customerEmail" type="email" placeholder="E-mail" required />
        <input name="customerPhone" placeholder="Telefone" required />
        <input name="shippingAddress" placeholder="Endereço" required />
        <input name="shippingCity" placeholder="Cidade" required />
        <input name="shippingState" placeholder="Estado" required />
        <input name="shippingZip" placeholder="CEP" required />
        <button type="submit" disabled={loading}>
          {loading ? "Processando..." : "Pagar com Mercado Pago"}
        </button>
      </form>
    </main>
  );
}
