import { PrismaClient, ProductSource } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      {
        name: "Base Líquida Matte 30ml",
        slug: "base-liquida-matte-30ml",
        description: "Base de alta cobertura, acabamento matte.",
        imageUrl: "https://via.placeholder.com/500x500?text=Base+Matte",
        price: 6990,
        costPrice: 3200,
        source: ProductSource.OWN_STOCK,
        stockQty: 15
      },
      {
        name: "Paleta de Sombras Nude 12 Cores",
        slug: "paleta-sombras-nude-12-cores",
        description: "Paleta com tons neutros, alta pigmentação.",
        imageUrl: "https://via.placeholder.com/500x500?text=Paleta+Nude",
        price: 8990,
        costPrice: 4500,
        source: ProductSource.DROPSHIP_JESSIMAKE,
        supplierSku: "JM-PAL-NUDE12",
        stockQty: 0
      },
      {
        name: "Batom Matte Vermelho Clássico",
        slug: "batom-matte-vermelho-classico",
        description: "Batom matte de longa duração.",
        imageUrl: "https://via.placeholder.com/500x500?text=Batom+Vermelho",
        price: 3990,
        costPrice: 1800,
        source: ProductSource.DROPSHIP_JESSIMAKE,
        supplierSku: "JM-BAT-VERM01",
        stockQty: 0
      }
    ],
    skipDuplicates: true
  });

  console.log("Seed concluído.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
