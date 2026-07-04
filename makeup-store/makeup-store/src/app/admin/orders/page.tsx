"use client";

import { useState } from "react";

type Order = {
  id: string;
  status: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  items: {
    id: string;
    productName: string;
    quantity: number;
    source: "OWN_STOCK" | "DROPSHIP_JESSIMAKE";
    handoffStatus: string;
    supplierTracking: string | null;
  }[];
};

const STORE_URL = "https://www.jessimake.com.br"; // TODO: confirmar se é esse mesmo link
const MARKER_PRODUCT = "Dropship"; // TODO: nome exato do produto marcador na loja dela
const COUPON_CODE = "COLOQUE_O_CUPOM_AQUI"; // TODO: cupom que zera o preço do marcador

// Painel de pedidos em formato de "cartões com passo a passo" em vez de
// tabela — cada pedido com item dropship vira um checklist manual de
// como registrar o pedido na loja da Jessi Make (produto marcador +
// cupom + produto real) e depois avisar o endereço do cliente.

export default function AdminOrdersPage() {
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function loadOrders() {
    const res = await fetch("/api/admin/orders", {
      headers: { "x-admin-password": password }
    });
    if (res.ok) setOrders(await res.json());
    else alert("Senha errada. Tenta de novo.");
  }

  async function markHandedOff(orderId: string, itemId: string) {
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": password
      },
      body: JSON.stringify({ itemId, handoffStatus: "HANDED_OFF" })
    });
    loadOrders();
  }

  function copyAddress(order: Order) {
    const text = [
      order.customerName,
      order.shippingAddress,
      `${order.shippingCity} - ${order.shippingState}`,
      `CEP: ${order.shippingZip}`,
      `Telefone: ${order.customerPhone}`
    ].join("\n");

    navigator.clipboard.writeText(text);
    setCopiedId(order.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <main style={{ padding: 24, maxWidth: 640, fontSize: 16 }}>
      <h1 style={{ fontSize: 26 }}>Meus pedidos</h1>

      <div style={{ marginBottom: 24, display: "flex", gap: 8 }}>
        <input
          type="password"
          placeholder="Digite a senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: 10, fontSize: 16, flex: 1 }}
        />
        <button onClick={loadOrders} style={{ padding: "10px 16px", fontSize: 16 }}>
          Entrar
        </button>
      </div>

      {orders?.length === 0 && <p>Nenhum pedido novo por enquanto.</p>}

      {orders?.map((order) => (
        <div
          key={order.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: 12,
            padding: 16,
            marginBottom: 20
          }}
        >
          <p style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
            Pedido de {order.customerName}
          </p>
          <p style={{ color: "#666", marginTop: 4 }}>Status: {translateStatus(order.status)}</p>

          {order.items.map((item) => {
            if (item.source === "OWN_STOCK") {
              return (
                <div key={item.id} style={{ marginTop: 12 }}>
                  ✅ <strong>{item.productName}</strong> x{item.quantity} — é do seu
                  estoque, é só embalar e enviar você mesma.
                </div>
              );
            }

            const done = item.handoffStatus !== "PENDING";

            return (
              <div
                key={item.id}
                style={{
                  marginTop: 12,
                  background: done ? "#f3fdf5" : "#fff8ec",
                  border: `1px solid ${done ? "#c8e6c9" : "#f0d9a6"}`,
                  borderRadius: 10,
                  padding: 14
                }}
              >
                <p style={{ margin: 0, fontWeight: 700 }}>
                  🚚 {item.productName} x{item.quantity}
                  {done ? " — já repassado ✅" : " — precisa repassar pra fornecedora"}
                </p>

                {!done && (
                  <ol style={{ marginTop: 10, paddingLeft: 20, lineHeight: 1.8 }}>
                    <li>
                      Abra a loja da Jessi Make:{" "}
                      <a href={STORE_URL} target="_blank" rel="noreferrer">
                        {STORE_URL}
                      </a>
                    </li>
                    <li>
                      Coloque no carrinho o produto <strong>"{MARKER_PRODUCT}"</strong>
                    </li>
                    <li>
                      Aplique o cupom <strong>{COUPON_CODE}</strong> (ele zera o preço
                      desse produto)
                    </li>
                    <li>
                      Adicione também o produto que o cliente comprou:{" "}
                      <strong>{item.productName}</strong>
                    </li>
                    <li>Finalize o pedido normalmente na loja dela</li>
                    <li>
                      Copie o endereço do cliente e envie pra ela (WhatsApp, chat do
                      site, ou como vocês combinaram):
                      <br />
                      <button
                        onClick={() => copyAddress(order)}
                        style={{ marginTop: 6, padding: "8px 14px", fontSize: 15 }}
                      >
                        {copiedId === order.id ? "Endereço copiado! ✅" : "📋 Copiar endereço"}
                      </button>
                    </li>
                  </ol>
                )}

                {!done && (
                  <button
                    onClick={() => markHandedOff(order.id, item.id)}
                    style={{ marginTop: 8, padding: "8px 14px", fontSize: 15 }}
                  >
                    ✔️ Já fiz tudo isso — marcar como repassado
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </main>
  );
}

function translateStatus(status: string) {
  const map: Record<string, string> = {
    PAID: "Pago, precisa processar",
    PROCESSING: "Em andamento",
    SHIPPED: "Enviado",
    DELIVERED: "Entregue",
    CANCELED: "Cancelado"
  };
  return map[status] ?? status;
}
