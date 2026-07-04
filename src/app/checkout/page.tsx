"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart-context";
import { useRouter } from "next/navigation";
import Link from "next/link";

type FormErrors = {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingZip?: string;
};

export default function CheckoutPage() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items, router]);

  const formatPrice = (cents: number) => {
    return (cents / 100).toFixed(2).replace(".", ",");
  };

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "customerName":
        if (!value.trim()) return "Nome e obrigatorio";
        if (value.trim().length < 3) return "Nome muito curto";
        break;
      case "customerEmail":
        if (!value.trim()) return "E-mail e obrigatorio";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "E-mail invalido";
        break;
      case "customerPhone":
        if (!value.trim()) return "Telefone e obrigatorio";
        if (value.replace(/\D/g, "").length < 10) return "Telefone invalido";
        break;
      case "shippingAddress":
        if (!value.trim()) return "Endereco e obrigatorio";
        if (value.trim().length < 10) return "Endereco muito curto";
        break;
      case "shippingCity":
        if (!value.trim()) return "Cidade e obrigatoria";
        break;
      case "shippingState":
        if (!value.trim()) return "Estado e obrigatorio";
        break;
      case "shippingZip":
        if (!value.trim()) return "CEP e obrigatorio";
        if (value.replace(/\D/g, "").length !== 8) return "CEP invalido";
        break;
    }
    return undefined;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    // Validate all fields
    const newErrors: FormErrors = {};
    const fields = ["customerName", "customerEmail", "customerPhone", "shippingAddress", "shippingCity", "shippingState", "shippingZip"];
    fields.forEach((field) => {
      const error = validateField(field, formData.get(field) as string);
      if (error) newErrors[field as keyof FormErrors] = error;
    });

    setErrors(newErrors);
    setTouched(Object.fromEntries(fields.map((f) => [f, true])));

    if (Object.keys(newErrors).length > 0) {
      setLoading(false);
      return;
    }

    const cartItems = items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    try {
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
          items: cartItems,
        }),
      });

      const data = await res.json();

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        alert("Erro ao processar pagamento. Tente novamente.");
        setLoading(false);
      }
    } catch {
      alert("Erro de conexao. Verifique sua internet e tente novamente.");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="container" style={{ padding: "2rem 1rem" }}>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "2rem",
          marginBottom: "1.5rem",
          textAlign: "center",
        }}
      >
        Finalizar Compra
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "2rem",
        }}
      >
        {/* Form Section */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Personal Data */}
          <section
            style={{
              background: "var(--color-white)",
              borderRadius: "var(--radius-lg)",
              padding: "1.5rem",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.25rem",
                marginBottom: "1rem",
                paddingBottom: "0.75rem",
                borderBottom: "1px solid var(--color-nude)",
              }}
            >
              Seus dados
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label className="label" htmlFor="customerName">
                  Nome completo
                </label>
                <input
                  id="customerName"
                  name="customerName"
                  type="text"
                  className={`input ${touched.customerName && errors.customerName ? "input-error" : ""}`}
                  placeholder="Digite seu nome"
                  onBlur={handleBlur}
                  onChange={handleInput}
                  required
                />
                {touched.customerName && errors.customerName && (
                  <p style={{ color: "var(--color-error)", fontSize: "0.75rem", marginTop: "0.25rem" }}>
                    {errors.customerName}
                  </p>
                )}
              </div>
              <div>
                <label className="label" htmlFor="customerEmail">
                  E-mail
                </label>
                <input
                  id="customerEmail"
                  name="customerEmail"
                  type="email"
                  className={`input ${touched.customerEmail && errors.customerEmail ? "input-error" : ""}`}
                  placeholder="seu@email.com"
                  onBlur={handleBlur}
                  onChange={handleInput}
                  required
                />
                {touched.customerEmail && errors.customerEmail && (
                  <p style={{ color: "var(--color-error)", fontSize: "0.75rem", marginTop: "0.25rem" }}>
                    {errors.customerEmail}
                  </p>
                )}
              </div>
              <div>
                <label className="label" htmlFor="customerPhone">
                  Telefone
                </label>
                <input
                  id="customerPhone"
                  name="customerPhone"
                  type="tel"
                  className={`input ${touched.customerPhone && errors.customerPhone ? "input-error" : ""}`}
                  placeholder="(00) 00000-0000"
                  onBlur={handleBlur}
                  onChange={handleInput}
                  required
                />
                {touched.customerPhone && errors.customerPhone && (
                  <p style={{ color: "var(--color-error)", fontSize: "0.75rem", marginTop: "0.25rem" }}>
                    {errors.customerPhone}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Shipping Address */}
          <section
            style={{
              background: "var(--color-white)",
              borderRadius: "var(--radius-lg)",
              padding: "1.5rem",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.25rem",
                marginBottom: "1rem",
                paddingBottom: "0.75rem",
                borderBottom: "1px solid var(--color-nude)",
              }}
            >
              Endereco de entrega
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label className="label" htmlFor="shippingAddress">
                  Endereco
                </label>
                <input
                  id="shippingAddress"
                  name="shippingAddress"
                  type="text"
                  className={`input ${touched.shippingAddress && errors.shippingAddress ? "input-error" : ""}`}
                  placeholder="Rua, numero, bairro"
                  onBlur={handleBlur}
                  onChange={handleInput}
                  required
                />
                {touched.shippingAddress && errors.shippingAddress && (
                  <p style={{ color: "var(--color-error)", fontSize: "0.75rem", marginTop: "0.25rem" }}>
                    {errors.shippingAddress}
                  </p>
                )}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="label" htmlFor="shippingCity">
                    Cidade
                  </label>
                  <input
                    id="shippingCity"
                    name="shippingCity"
                    type="text"
                    className={`input ${touched.shippingCity && errors.shippingCity ? "input-error" : ""}`}
                    placeholder="Cidade"
                    onBlur={handleBlur}
                    onChange={handleInput}
                    required
                  />
                  {touched.shippingCity && errors.shippingCity && (
                    <p style={{ color: "var(--color-error)", fontSize: "0.75rem", marginTop: "0.25rem" }}>
                      {errors.shippingCity}
                    </p>
                  )}
                </div>
                <div>
                  <label className="label" htmlFor="shippingState">
                    Estado
                  </label>
                  <input
                    id="shippingState"
                    name="shippingState"
                    type="text"
                    className={`input ${touched.shippingState && errors.shippingState ? "input-error" : ""}`}
                    placeholder="Estado"
                    onBlur={handleBlur}
                    onChange={handleInput}
                    required
                  />
                  {touched.shippingState && errors.shippingState && (
                    <p style={{ color: "var(--color-error)", fontSize: "0.75rem", marginTop: "0.25rem" }}>
                      {errors.shippingState}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className="label" htmlFor="shippingZip">
                  CEP
                </label>
                <input
                  id="shippingZip"
                  name="shippingZip"
                  type="text"
                  className={`input ${touched.shippingZip && errors.shippingZip ? "input-error" : ""}`}
                  placeholder="00000-000"
                  onBlur={handleBlur}
                  onChange={handleInput}
                  required
                />
                {touched.shippingZip && errors.shippingZip && (
                  <p style={{ color: "var(--color-error)", fontSize: "0.75rem", marginTop: "0.25rem" }}>
                    {errors.shippingZip}
                  </p>
                )}
              </div>
            </div>
          </section>
        </form>

        {/* Order Summary */}
        <div
          style={{
            background: "var(--color-white)",
            borderRadius: "var(--radius-lg)",
            padding: "1.5rem",
            boxShadow: "var(--shadow-sm)",
            height: "fit-content",
            position: "sticky",
            top: "80px",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.25rem",
              marginBottom: "1rem",
              paddingBottom: "1rem",
              borderBottom: "1px solid var(--color-nude)",
            }}
          >
            Resumo do pedido
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {items.map((item) => (
              <div
                key={item.productId}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.875rem",
                }}
              >
                <span style={{ color: "var(--color-charcoal)" }}>
                  {item.name} x{item.quantity}
                </span>
                <span style={{ fontWeight: 500 }}>
                  R$ {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: "0.75rem",
                marginTop: "0.5rem",
                borderTop: "1px solid var(--color-nude)",
              }}
            >
              <span style={{ fontWeight: 600 }}>Total</span>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.5rem",
                  fontWeight: 600,
                  color: "var(--color-terracotta)",
                }}
              >
                R$ {formatPrice(totalPrice)}
              </span>
            </div>
          </div>

          <button
            type="submit"
            form="checkout-form"
            onClick={(e) => {
              const form = document.querySelector("form");
              if (form) {
                handleSubmit(e as any);
              }
            }}
            className="btn btn-primary btn-lg"
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "1.5rem",
            }}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ animation: "spin 1s linear infinite" }}
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Processando...
              </span>
            ) : (
              <>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <path d="M2 10h20" />
                </svg>
                Pagar com UniPay
              </>
            )}
          </button>

          <p
            style={{
              textAlign: "center",
              fontSize: "0.75rem",
              color: "var(--color-rose)",
              marginTop: "1rem",
            }}
          >
            Voce sera redirecionado para o pagamento
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
