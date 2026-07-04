"use client";

import { useState } from "react";
import { useToast } from "@/components/toast";
import { useAdminName } from "@/lib/admin-name-context";
import Link from "next/link";

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

const STORE_URL = "https://www.jessimake.com.br";
const MARKER_PRODUCT = "Dropship";
const COUPON_CODE = "COLOQUE_O_CUPOM_AQUI";

export default function AdminOrdersPage() {
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { adminName, setAdminName } = useAdminName();

  async function loadOrders() {
    setLoading(true);
    const res = await fetch("/api/admin/orders", {
      headers: { "x-admin-password": password }
    });
    setLoading(false);
    if (res.ok) setOrders(await res.json());
    else showToast("Senha errada. Tenta de novo.", "error");
  }

  async function markHandedOff(orderId: string, itemId: string) {
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": password
      },
      body: JSON.stringify({ itemId, handoffStatus: "HANDED_OFF" })
    });
    if (res.ok) {
      showToast("Pedido marcado como repassado!", "success");
      loadOrders();
    } else {
      showToast("Erro ao atualizar pedido", "error");
    }
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
    showToast("Endereco copiado!", "success");
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="container" style={{ padding: "2rem 1rem", maxWidth: "700px" }}>
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
        {adminName && (
          <p style={{ color: "var(--color-rose)", fontSize: "1rem", marginBottom: "0.5rem" }}>
            Ola, {adminName}!
          </p>
        )}
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", marginBottom: "0.5rem" }}>
          Meus Pedidos
        </h1>
        <p style={{ color: "var(--color-rose)" }}>
          Aqui voce ve e processa os pedidos dos clientes.
        </p>
      </div>

      {/* Login */}
      {!orders && (
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
            Digite seu nome (opcional) e a senha para ver os pedidos:
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <input
              type="text"
              placeholder="Seu nome (ex: Ana Luiza)"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              className="input"
            />
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && loadOrders()}
                className="input"
                style={{ flex: 1 }}
              />
              <button onClick={loadOrders} className="btn btn-primary" disabled={loading}>
                {loading ? "Carregando..." : "Entrar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Orders List */}
      {orders && (
        <>
          {orders.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "3rem 1.5rem",
                background: "var(--color-white)",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  margin: "0 auto 1rem",
                  background: "var(--color-cream-dark)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-rose)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m7.5 4.27 9 5.15" />
                  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                  <path d="m3.3 7 8.7 5 8.7-5" />
                  <path d="M12 22V12" />
                </svg>
              </div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                Nenhum pedido novo por enquanto
              </h2>
              <p style={{ color: "var(--color-rose)" }}>
                Quando os clientes fizerem pedidos pagos, eles vao aparecer aqui.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {orders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    background: "var(--color-white)",
                    borderRadius: "var(--radius-lg)",
                    boxShadow: "var(--shadow-sm)",
                    overflow: "hidden",
                  }}
                >
                  {/* Order Header */}
                  <div
                    style={{
                      padding: "1rem 1.25rem",
                      background: "var(--color-cream)",
                      borderBottom: "1px solid var(--color-nude)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "0.75rem",
                    }}
                  >
                    <div>
                      <h3 style={{ fontFamily: "var(--font-body)", fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.25rem" }}>
                        {order.customerName}
                      </h3>
                      <p style={{ fontSize: "0.875rem", color: "var(--color-rose)" }}>
                        {order.customerPhone}
                      </p>
                    </div>
                    <span
                      style={{
                        padding: "0.375rem 0.75rem",
                        background: "var(--color-warning-bg)",
                        color: "var(--color-terracotta)",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        borderRadius: "var(--radius-full)",
                      }}
                    >
                      {translateStatus(order.status)}
                    </span>
                  </div>

                  {/* Order Items */}
                  <div style={{ padding: "1rem 1.25rem" }}>
                    {order.items.map((item) => (
                      <div key={item.id} style={{ marginBottom: "1rem" }}>
                        {item.source === "OWN_STOCK" ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.75rem",
                              padding: "1rem",
                              background: "var(--color-success-bg)",
                              borderRadius: "var(--radius-md)",
                            }}
                          >
                            <div
                              style={{
                                width: "32px",
                                height: "32px",
                                background: "var(--color-success)",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                <path d="M20 6 9 17l-5-5" />
                              </svg>
                            </div>
                            <div>
                              <span style={{ fontWeight: 500 }}>{item.productName}</span>
                              <span style={{ color: "var(--color-rose)", marginLeft: "0.5rem" }}>- x{item.quantity}</span>
                              <p style={{ fontSize: "0.875rem", color: "var(--color-success)" }}>
                                E do seu estoque - embale e envie voce mesma.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div
                            style={{
                              padding: "1rem",
                              background: item.handoffStatus !== "PENDING"
                                ? "var(--color-success-bg)"
                                : "var(--color-warning-bg)",
                              borderRadius: "var(--radius-md)",
                              border: `1px solid ${item.handoffStatus !== "PENDING"
                                ? "var(--color-success)"
                                : "var(--color-gold)"}`,
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: item.handoffStatus === "PENDING" ? "1rem" : 0 }}>
                              <div
                                style={{
                                  width: "32px",
                                  height: "32px",
                                  background: item.handoffStatus !== "PENDING"
                                    ? "var(--color-success)"
                                    : "var(--color-gold)",
                                  borderRadius: "50%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                {item.handoffStatus !== "PENDING" ? (
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                    <path d="M20 6 9 17l-5-5" />
                                  </svg>
                                ) : (
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                                    <path d="M3 6h18" />
                                    <path d="M16 10a4 4 0 0 1-8 0" />
                                  </svg>
                                )}
                              </div>
                              <div>
                                <span style={{ fontWeight: 500 }}>{item.productName}</span>
                                <span style={{ color: "var(--color-rose)", marginLeft: "0.5rem" }}>- x{item.quantity}</span>
                                <p style={{ fontSize: "0.875rem", color: "var(--color-charcoal)" }}>
                                  {item.handoffStatus !== "PENDING" ? "Ja repassado para fornecedora!" : "Precisa repassar para a Jessi Make"}
                                </p>
                              </div>
                            </div>

                            {item.handoffStatus === "PENDING" && (
                              <>
                                <div
                                  style={{
                                    marginTop: "1rem",
                                    padding: "1rem",
                                    background: "var(--color-white)",
                                    borderRadius: "var(--radius-md)",
                                    fontSize: "0.9375rem",
                                  }}
                                >
                                  <p style={{ fontWeight: 600, marginBottom: "0.75rem", color: "var(--color-charcoal)" }}>
                                    Como repassar:
                                  </p>
                                  <ol style={{ paddingLeft: "1.25rem", lineHeight: 1.8, margin: 0 }}>
                                    <li>
                                      Abra a loja da Jessi Make:{` `}
                                      <a
                                        href={STORE_URL}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{ color: "var(--color-terracotta)", textDecoration: "underline" }}
                                      >
                                        {STORE_URL}
                                      </a>
                                    </li>
                                    <li>
                                      Coloque no carrinho o produto: <strong>"{MARKER_PRODUCT}"</strong>
                                    </li>
                                    <li>
                                      Aplique o cupom: <strong>{COUPON_CODE}</strong>
                                    </li>
                                    <li>
                                      Adicione tambem: <strong>{item.productName}</strong>
                                    </li>
                                    <li>Finalize o pedido na loja dela</li>
                                    <li>
                                      Envie o endereco do cliente pra ela:
                                    </li>
                                  </ol>
                                </div>

                                <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                                  <button
                                    onClick={() => copyAddress(order)}
                                    className="btn btn-secondary btn-sm"
                                  >
                                    {copiedId === order.id ? "Endereco copiado!" : "Copiar endereco"}
                                  </button>
                                  <button
                                    onClick={() => markHandedOff(order.id, item.id)}
                                    className="btn btn-primary btn-sm"
                                  >
                                    Marcar como repassado
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Customer Address Summary */}
                    <div
                      style={{
                        marginTop: "1rem",
                        padding: "0.75rem 1rem",
                        background: "var(--color-cream-dark)",
                        borderRadius: "var(--radius-md)",
                        fontSize: "0.875rem",
                      }}
                    >
                      <p style={{ color: "var(--color-rose)", marginBottom: "0.25rem" }}>Endereco de entrega:</p>
                      <p>
                        {order.shippingAddress}, {order.shippingCity} - {order.shippingState}
                      </p>
                      <p>CEP: {order.shippingZip}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function translateStatus(status: string) {
  const map: Record<string, string> = {
    PAID: "Pago - Processar",
    PROCESSING: "Em andamento",
    SHIPPED: "Enviado",
    DELIVERED: "Entregue",
    CANCELED: "Cancelado"
  };
  return map[status] ?? status;
}
