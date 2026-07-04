import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPayment, verifyWebhookSignature, mapPaymentStatus } from "@/lib/unipay";

/**
 * Webhook da UniPay - recebe notificacoes de pagamento
 * Documentacao: https://unipaybr.com
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ received: true });
  }

  // Valida a assinatura do webhook (se disponivel)
  const signature = req.headers.get("x-unipay-signature") || "";
  const payloadString = JSON.stringify(body);

  if (!verifyWebhookSignature(payloadString, signature)) {
    console.error("Webhook signature validation failed");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const paymentId = body.id || body.payment_id;
  const reference = body.reference || body.external_reference;

  if (!paymentId) {
    return NextResponse.json({ received: true });
  }

  // Busca o pagamento real na API da UniPay (nunca confia so no payload do webhook)
  let payment;
  try {
    payment = await getPayment(paymentId);
  } catch (error) {
    console.error("Erro ao buscar pagamento na UniPay:", error);
    return NextResponse.json({ received: true });
  }

  const orderId = payment.reference || reference;

  if (!orderId) {
    return NextResponse.json({ received: true });
  }

  // Mapeia o status do pagamento para o status do pedido
  const orderStatus = mapPaymentStatus(payment.status);

  if (orderStatus === "PAID") {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "PAID",
        paymentId: String(paymentId)
      }
    });
  } else if (orderStatus === "CANCELED") {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "CANCELED" }
    });
  }

  // status "pending": nao faz nada, aguarda proxima notificacao

  return NextResponse.json({ received: true });
}
