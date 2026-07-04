"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/components/toast";

type AddToCartButtonProps = {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string | null;
  };
};

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem, items } = useCart();
  const { showToast } = useToast();
  const [isAdding, setIsAdding] = useState(false);

  const inCart = items.find((i) => i.productId === product.id);
  const quantityInCart = inCart?.quantity ?? 0;

  const handleAdd = () => {
    setIsAdding(true);
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
    });
    showToast("Produto adicionado ao carrinho!", "success");
    setTimeout(() => setIsAdding(false), 300);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <button
        onClick={handleAdd}
        disabled={isAdding}
        className="btn btn-primary btn-lg"
        style={{
          width: "100%",
          background: "var(--color-charcoal)",
          transition: "all 0.2s ease",
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
        Adicionar ao carrinho
      </button>
      {quantityInCart > 0 && (
        <p
          style={{
            textAlign: "center",
            fontSize: "0.875rem",
            color: "var(--color-success)",
          }}
        >
          Voce tem {quantityInCart} {quantityInCart === 1 ? "unidade" : "unidades"} no carrinho
        </p>
      )}
    </div>
  );
}
