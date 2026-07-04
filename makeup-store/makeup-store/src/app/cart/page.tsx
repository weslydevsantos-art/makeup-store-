"use client";

// Esqueleto do carrinho. Sugestão: usar localStorage ou um context simples
// pra guardar { productId, quantity }[] enquanto o cliente navega, e só
// mandar pro backend em /api/checkout na hora de finalizar a compra.
//
// Esse é um bom ponto pra terminar visualmente no Bolt/Lovable.

export default function CartPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Seu carrinho</h1>
      <p>TODO: renderizar itens do carrinho (client state) aqui.</p>
      <a href="/checkout">Ir para o checkout</a>
    </main>
  );
}
