export const PRODUCT_CATEGORIES = [
  "DAIRY",
  "CANNED",
  "MEAT",
  "PRODUCE",
  "FROZEN",
  "BAKERY",
  "BEVERAGE",
  "HOUSEHOLD",
  "OTHER",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const BATCH_STATUSES = ["ACTIVE", "CLEARED", "ARCHIVED"] as const;

export type BatchStatus = (typeof BATCH_STATUSES)[number];

