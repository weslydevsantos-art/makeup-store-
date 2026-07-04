# Belle - Loja de Maquiagem (Next.js + Prisma + Supabase + UniPay)

Loja de maquiagem que vende produtos de **estoque proprio** e produtos
**dropship da Jessi Make** na mesma plataforma.

## O que ja esta pronto

- **`prisma/schema.prisma`** — modelo de dados com `Product.source`
  (`OWN_STOCK` ou `DROPSHIP_JESSIMAKE`) e `OrderItem.handoffStatus`
  para rastrear o repasse manual do pedido para fornecedora.
- **`POST /api/checkout`** — recebe itens do carrinho, cria o pedido no
  banco e gera uma cobranca no UniPay (PIX, cartao ou boleto).
- **`POST /api/webhook/unipay`** — recebe a confirmacao de pagamento
  e marca o pedido como `PAID`.
- **`GET /api/products`** — lista os produtos ativos (propria loja + dropship).
- **`/admin`** — menu inicial com dois botoes grandes (cadastrar produtos
  / ver pedidos), pensado para pessoas sem intimidade com tecnologia.
- **`/admin/orders`** — lista pedidos pagos como cartoes, e para cada item
  dropship mostra um checklist passo a passo de como registrar o pedido
  na loja da Jessi Make + botao de copiar o endereco do cliente.
- **`/admin/products`** — cadastro de produtos: formulario unico que serve
  para os dois tipos (estoque proprio ou dropship Jessi Make).
- Paginas: home (listagem), produto, carrinho funcional, checkout.
- Design elegante em tons de nude/terracota com prioridade mobile.
- Carrinho com persistencia em localStorage.

Toda a linguagem do admin foi escrita em portugues simples, sem termos
tecnicos, pensando em pessoa leiga usando no dia a dia.

## Como rodar localmente

```bash
npm install
cp .env.example .env       # preencha as variaveis de ambiente
npx prisma migrate dev --name init
npm run seed               # popula 3 produtos de exemplo
npm run dev
```

## Banco de dados (Supabase)

1. Crie um projeto em https://supabase.com
2. Va em Project Settings > Database > Connection string
3. Copie as duas URLs:
   - **Transaction pooler** (porta 6543) -> `DATABASE_URL`
   - **Direct connection** (porta 5432) -> `DIRECT_URL`
4. Cole no `.env` e nas variaveis de ambiente da Vercel

## Gateway de pagamento (UniPay)

1. Crie uma conta em https://unipaybr.com
2. Pegue sua `API Key` e `Merchant ID` no painel
3. Configure as variaveis `UNIPAY_API_KEY` e `UNIPAY_MERCHANT_ID`
4. O webhook sera chamado automaticamente em `/api/webhook/unipay`

O UniPay aceita PIX, cartao de credito e boleto com taxas competitivas.

## Fluxo dropship (Jessi Make) — 100% manual

A Jessi Make nao tem um sistema de dropship de verdade — o pedido e
registrado usando um "truque" no carrinho da loja dela:

1. Adicione ao carrinho da loja dela um **produto marcador** (ex: "Dropship")
2. Aplique um **cupom de desconto** que zera o preco desse marcador
3. Adicione tambem o **produto real** que o cliente comprou
4. Finalize o pedido normalmente na loja dela
5. Envie o **endereco do cliente final** separadamente (WhatsApp, e-mail)

O painel `/admin/orders` transforma isso em um checklist com botao
"Copiar endereco" e "Marcar como repassado".

**Antes de usar**, edite essas constantes em `src/app/admin/orders/page.tsx`:

```ts
const STORE_URL = "https://www.jessimake.com.br";
const MARKER_PRODUCT = "Dropship";
const COUPON_CODE = "COLOQUE_O_CUPOM_AQUI";
```

## Variaveis de ambiente

```env
# Supabase
DATABASE_URL="postgresql://..."     # Pooler (porta 6543)
DIRECT_URL="postgresql://..."        # Direta (porta 5432)

# UniPay
UNIPAY_API_KEY="sua-chave-api"
UNIPAY_MERCHANT_ID="seu-merchant-id"

# Admin
ADMIN_PASSWORD="ana123456"

# App
NEXT_PUBLIC_APP_URL="https://anamake.vercel.app"
```

## Deploy na Vercel

```bash
vercel
```

Configure as variaveis do `.env.example` no dashboard da Vercel
(Settings > Environment Variables) antes do primeiro deploy.

---

Desenvolvido com Next.js 14, Prisma, Supabase e UniPay.
