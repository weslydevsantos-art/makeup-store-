import { MercadoPagoConfig, Preference, Payment } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN as string
});

export const mpPreference = new Preference(client);
export const mpPayment = new Payment(client);

type CheckoutItem = {
  id: string;
  title: string;
  quantity: number;
  unitPrice: number; // em reais (não em centavos) — a API do MP espera decimal
};

/**
 * Cria uma preferência de pagamento no Mercado Pago (Checkout Pro).
 * O front redireciona o cliente pro init_point retornado.
 */
export async function createPaymentPreference(params: {
  orderId: string;
  items: CheckoutItem[];
  payerEmail: string;
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  const preference = await mpPreference.create({
    body: {
      items: params.items.map((item) => ({
        id: item.id,
        title: item.title,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        currency_id: "BRL"
      })),
      payer: { email: params.payerEmail },
      external_reference: params.orderId,
      back_urls: {
        success: `${appUrl}/checkout/sucesso?order=${params.orderId}`,
        failure: `${appUrl}/checkout/erro?order=${params.orderId}`,
        pending: `${appUrl}/checkout/pendente?order=${params.orderId}`
      },
      auto_return: "approved",
      notification_url: `${appUrl}/api/webhook/mercadopago`
    }
  });

  return preference;
}
