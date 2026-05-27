import { ExpiryStatus, getDaysUntilExpiration, getExpiryStatus } from "@/lib/dates/expiry";
import { ProductCategory } from "@/lib/types/domain";

type ProductSummary = {
  id: string;
  barcode: string;
  sku: string | null;
  name: string;
  category: ProductCategory;
};

type AlertBatchInput = {
  id: string;
  expirationDate: Date;
  entryDate: Date;
  status: "ACTIVE" | "CLEARED" | "ARCHIVED";
  locationNote: string | null;
  quantityEstimate: number | null;
  product: ProductSummary;
};

export type AlertTask = AlertBatchInput & {
  daysUntilExpiration: number;
  expiryStatus: ExpiryStatus;
};

export function toAlertTask(batch: AlertBatchInput, now = new Date()): AlertTask {
  return {
    ...batch,
    daysUntilExpiration: getDaysUntilExpiration(batch.expirationDate, now),
    expiryStatus: getExpiryStatus(batch.expirationDate, now),
  };
}

export function toPrioritizedAlertTasks(batches: AlertBatchInput[], now = new Date()): AlertTask[] {
  const tasks = batches.map((batch) => toAlertTask(batch, now));

  return tasks.sort((a, b) => {
    if (a.expirationDate.getTime() !== b.expirationDate.getTime()) {
      return a.expirationDate.getTime() - b.expirationDate.getTime();
    }
    return a.entryDate.getTime() - b.entryDate.getTime();
  });
}

