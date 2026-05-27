import { ProductCategory } from "@/lib/types/domain";

type CategoryMeta = {
  label: string;
};

export const CATEGORY_ORDER: ProductCategory[] = [
  "DAIRY",
  "CANNED",
  "MEAT",
  "PRODUCE",
  "FROZEN",
  "BAKERY",
  "BEVERAGE",
  "HOUSEHOLD",
  "OTHER",
];

export const CATEGORY_META: Record<ProductCategory, CategoryMeta> = {
  DAIRY: { label: "Dairy" },
  CANNED: { label: "Canned" },
  MEAT: { label: "Meat" },
  PRODUCE: { label: "Produce" },
  FROZEN: { label: "Frozen" },
  BAKERY: { label: "Bakery" },
  BEVERAGE: { label: "Beverage" },
  HOUSEHOLD: { label: "Household" },
  OTHER: { label: "Other" },
};

