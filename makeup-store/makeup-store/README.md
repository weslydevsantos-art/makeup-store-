# Loja de Maquiagem — esqueleto (Next.js + Prisma + Mercado Pago)

Infra mínima pronta pra vender produtos de **estoque próprio** e produtos
**dropship da Jessi Make** na mesma loja. Feito pra ser terminado
visualmente no Bolt ou Lovable — a lógica de negócio (banco, checkout,
pagamento, repasse de pedido) já está funcional; falta só UI bonita.

## O que já está pronto

- **`prisma/schema.prisma`** — modelo de dados com `Product.source`
  (`OWN_STOCK` ou `DROPSHIP_JESSIMAKE`) e `OrderItem.handoffStatus`
  pra rastrear o repasse manual do pedido pra fornecedora.
- **`POST /api/checkout`** — recebe itens do carrinho, cria o pedido no
  banco e gera uma preferência de pagamento no Mercado Pago.
- **`POST /api/webhook/mercadopago`** — recebe a confirmação de pagamento
  e marca o pedido como `PAID`.
- **`GET /api/products`** — lista os produtos ativos (própria loja + dropship).
- **`/admin`** — menu inicial simples (2 botões grandes: cadastrar produtos
  / ver pedidos), pensado pra alguém sem intimidade com tecnologia.
- **`/admin/orders`** — lista pedidos pagos como cartões, e pra cada item
  dropship mostra um checklist passo a passo de como registrar o pedido
  na loja da Jessi Make (ver seção abaixo) + botão de copiar o endereço
  do cliente.
- **`/admin/products`** — cadastro de produtos: formulário único que serve
  pros dois tipos (estoque próprio ou dropship Jessi Make), com listagem,
  ativar/desativar. Rotas: `GET/POST /api/admin/products` e
  `PATCH/DELETE /api/admin/products/[id]`.
- Páginas: home (listagem), produto, carrinho (esqueleto), checkout.

Toda a linguagem do admin foi escrita em português simples, sem termo
técnico, pensando numa pessoa leiga em tecnologia usando o dia a dia.

## Como rodar localmente

```bash
npm install
cp .env.example .env       # preencha DATABASE_URL, MERCADOPAGO_ACCESS_TOKEN etc.
npx prisma migrate dev --name init
npm run seed                # popula 3 produtos de exemplo (1 próprio + 2 dropship)
npm run dev
```

## Banco de dados

Qualquer Postgres serve. Mais simples pra usar com Vercel:
- **Neon** (https://neon.tech) — grátis, integra direto com Vercel
- **Vercel Postgres** — direto no dashboard da Vercel

Depois de criar, cole a connection string em `DATABASE_URL` no `.env`
(e nas variáveis de ambiente do projeto na Vercel).

## Mercado Pago

1. Crie uma aplicação em https://www.mercadopago.com.br/developers/panel
2. Pegue o `Access Token` (produção ou teste) e cole em
   `MERCADOPAGO_ACCESS_TOKEN`
3. Depois do deploy, configure a `notification_url` do lado do MP (ou
   deixe como está — já é enviada dinamicamente em cada preferência
   criada, apontando pra `NEXT_PUBLIC_APP_URL/api/webhook/mercadopago`)

## Fluxo dropship (Jessi Make) — como realmente funciona, 100% manual

A Jessi Make não tem um sistema de dropship de verdade — o pedido é
registrado usando um "truque" no carrinho da loja dela:

1. Você adiciona ao carrinho da loja dela um **produto marcador**
   (ex: um produto chamado "Dropship")
2. Aplica um **cupom de desconto** que zera o preço desse marcador
3. Adiciona também o **produto real** que o cliente comprou
4. Finaliza o pedido normalmente na loja dela
5. O **endereço do cliente final** é enviado por fora (WhatsApp, chat
   do site, e-mail — como vocês combinarem), separado do pedido

O painel `/admin/orders` já vira isso num checklist: pra cada item
dropship de um pedido pago, mostra o passo a passo (com o nome do
produto marcador, o cupom, e um botão "Copiar endereço" pra colar na
mensagem pra ela), e um botão "Já fiz tudo isso" que marca o item como
repassado.

**Antes de usar**, edite essas três constantes no topo de
`src/app/admin/orders/page.tsx` com os dados reais:

```ts
const STORE_URL = "https://www.jessimake.com.br";
const MARKER_PRODUCT = "Dropship";       // nome exato do produto marcador na loja dela
const COUPON_CODE = "COLOQUE_O_CUPOM_AQUI"; // cupom que zera o preço do marcador
```

Quando ela te passar o código de rastreio, atualize via
`PATCH /api/admin/orders/[id]` com `supplierTracking`.

## O que falta (de propósito, pra fazer no Bolt/Lovable)

- Design visual de tudo (hoje é HTML cru, só funcional)
- Carrinho de verdade (hoje é placeholder — sugestão: Context API ou
  Zustand + localStorage)
- Autenticação real do admin (hoje é senha única via header — trocar
  por NextAuth/Clerk antes de produção)
- Página de acompanhamento de pedido pro cliente
- Cálculo de frete pros produtos `OWN_STOCK` (Melhor Envio/Frenet)

## Deploy na Vercel

```bash
vercel
```

Configure as mesmas variáveis do `.env.example` no dashboard da
Vercel (Settings → Environment Variables) antes do primeiro deploy.
