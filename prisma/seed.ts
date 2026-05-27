import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, ProductCategory } from "./generated/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const products = [
  { barcode: "8901030899012", sku: "MILK-1L-WHOLE", name: "Whole Milk 1L", category: ProductCategory.DAIRY },
  { barcode: "8901030899029", sku: "YOG-PLAIN-400", name: "Plain Yogurt 400g", category: ProductCategory.DAIRY },
  { barcode: "8901030899036", sku: "CAN-BEAN-400", name: "Baked Beans 400g", category: ProductCategory.CANNED },
  { barcode: "8901030899043", sku: "CAN-TUNA-185", name: "Tuna Chunks 185g", category: ProductCategory.CANNED },
  { barcode: "8901030899050", sku: "MEAT-CHICK-500", name: "Chicken Breast 500g", category: ProductCategory.MEAT },
  { barcode: "8901030899067", sku: "MEAT-BEEF-500", name: "Ground Beef 500g", category: ProductCategory.MEAT },
  { barcode: "8901030899074", sku: "PROD-BANANA-1K", name: "Bananas 1kg", category: ProductCategory.PRODUCE },
  { barcode: "8901030899081", sku: "PROD-APPLE-1K", name: "Apples 1kg", category: ProductCategory.PRODUCE },
  { barcode: "8901030899098", sku: "FRZN-PEAS-450", name: "Frozen Peas 450g", category: ProductCategory.FROZEN },
  { barcode: "8901030899104", sku: "FRZN-PIZZA-350", name: "Margherita Pizza 350g", category: ProductCategory.FROZEN },
  { barcode: "8901030899111", sku: "BAKE-BREAD-WHT", name: "White Bread Loaf", category: ProductCategory.BAKERY },
  { barcode: "8901030899128", sku: "BAKE-CROIS-4PK", name: "Croissant 4-Pack", category: ProductCategory.BAKERY },
  { barcode: "8901030899135", sku: "BEV-OJ-1L", name: "Orange Juice 1L", category: ProductCategory.BEVERAGE },
  { barcode: "8901030899142", sku: "BEV-WATER-1L", name: "Mineral Water 1L", category: ProductCategory.BEVERAGE },
  { barcode: "8901030899159", sku: "HOME-DETER-1L", name: "Laundry Detergent 1L", category: ProductCategory.HOUSEHOLD },
  { barcode: "8901030899166", sku: "HOME-SOAP-2PK", name: "Dish Soap 2-Pack", category: ProductCategory.HOUSEHOLD },
] as const;

const users = [
  { staffCode: "STAFF-001", name: "Warehouse Staff" },
  { staffCode: "STAFF-002", name: "Floor Supervisor" },
] as const;

async function main() {
  for (const user of users) {
    await prisma.user.upsert({
      where: { staffCode: user.staffCode },
      update: { name: user.name },
      create: user,
    });
  }

  for (const product of products) {
    await prisma.product.upsert({
      where: { barcode: product.barcode },
      update: {
        sku: product.sku,
        name: product.name,
        category: product.category,
        isActive: true,
      },
      create: product,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
