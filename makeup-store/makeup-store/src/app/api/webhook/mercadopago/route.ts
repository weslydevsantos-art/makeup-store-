import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mpPayment } from "@/lib/mercadopago";

// O Mercado Pago chama essa rota quando o status de um pagamento muda.
// Doc: https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/additional-content/notifications/webhooks
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body || body.type !== "payment") {
    return NextResponse.json({ received: true });
  }

  const paymentId = body.data?.id;
  if (!paymentId) {
    return NextResponse.json({ received: true });
  }

  // Busca o pagamento real na API do MP (nunca confia só no payload do webhook)
  const payment = await mpPayment.get({ id: paymentId });
  const orderId = payment.external_reference;

  if (!orderId) {
    return NextResponse.json({ received: true });
  }

  if (payment.status === "approved") {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "PAID",
        mpPaymentId: String(paymentId)
      }
    });
  } else if (payment.status === "rejected" || payment.status === "cancelled") {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "CANCELED" }
    });
  }

  // status "pending", "in_process" etc: não faz nada, aguarda próxima notificação

  return NextResponse.json({ received: true });
}
