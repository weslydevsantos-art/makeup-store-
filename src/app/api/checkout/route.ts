import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createPayment } from "@/lib/unipay";

const checkoutSchema = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(8),
  shippingAddress: z.string().min(1),
  shippingCity: z.string().min(1),
  shippingState: z.string().min(1),
  shippingZip: z.string().min(1),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive()
      })
    )
    .min(1)
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;

  // Busca os produtos reais no banco (nunca confia no preco vindo do front)
  const productIds = data.items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, active: true }
  });

  if (products.length !== data.items.length) {
    return NextResponse.json(
      { error: "Um ou mais produtos nao foram encontrados ou estao inativos." },
      { status: 400 }
    );
  }

  const totalAmount = data.items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId)!;
    return sum + product.price * item.quantity;
  }, 0);

  // Cria o pedido em PENDING_PAYMENT + os itens (com snapshot de preco/nome/source)
  const order = await prisma.order.create({
    data: {
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      shippingAddress: data.shippingAddress,
      shippingCity: data.shippingCity,
      shippingState: data.shippingState,
      shippingZip: data.shippingZip,
      totalAmount,
      items: {
        create: data.items.map((item) => {
          const product = products.find((p) => p.id === item.productId)!;
          return {
            productId: product.id,
            productName: product.name,
            unitPrice: product.price,
            quantity: item.quantity,
            source: product.source,
            handoffStatus: product.source === "DROPSHIP_JESSIMAKE" ? "PENDING" : "NOT_APPLICABLE"
          };
        })
      }
    }
  });

  // Cria o pagamento no UniPay
  const payment = await createPayment({
    orderId: order.id,
    payerEmail: data.customerEmail,
    payerName: data.customerName,
    payerPhone: data.customerPhone,
    items: data.items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      return {
        id: product.id,
        title: product.name,
        quantity: item.quantity,
        unitPrice: product.price
      };
    })
  });

  // Atualiza o pedido com a referencia do pagamento
  await prisma.order.update({
    where: { id: order.id },
    data: {
      paymentId: payment.id,
      paymentReference: payment.reference
    }
  });

  return NextResponse.json({
    orderId: order.id,
    checkoutUrl: payment.checkoutUrl,
    pixQrCode: payment.pixQrCode,
    pixCopyPaste: payment.pixCopyPaste
  });
}
