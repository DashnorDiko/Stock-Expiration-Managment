import { BATCH_STATUSES, PRODUCT_CATEGORIES } from "@/lib/types/domain";
import { z } from "zod";

export const createBatchSchema = z.object({
  barcode: z.string().min(3),
  expirationDate: z.coerce.date(),
  locationNote: z.string().trim().max(120).optional(),
  quantityEstimate: z.coerce.number().int().positive().optional(),
  createdByStaffCode: z.string().trim().min(3).optional(),
});

export const listBatchesQuerySchema = z.object({
  category: z.enum(PRODUCT_CATEGORIES).optional(),
  status: z.enum(BATCH_STATUSES).optional(),
});

export const patchBatchSchema = z
  .object({
    expirationDate: z.coerce.date().optional(),
    locationNote: z.string().trim().max(120).nullable().optional(),
    quantityEstimate: z.coerce.number().int().positive().nullable().optional(),
    archive: z.boolean().optional(),
    clearReason: z.string().trim().max(200).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required.",
  });

export const clearBatchSchema = z.object({
  discardedUnits: z.coerce.number().int().min(0).optional(),
  note: z.string().trim().max(200).optional(),
  clearReason: z.string().trim().max(200).optional(),
  clearedByStaffCode: z.string().trim().min(3).optional(),
});

