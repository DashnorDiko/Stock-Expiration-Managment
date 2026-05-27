import { clearBatchSchema, createBatchSchema, listBatchesQuerySchema, patchBatchSchema } from "@/lib/validators/batch";
import { describe, expect, it } from "vitest";

describe("batch validators", () => {
  it("accepts valid batch creation payload", () => {
    const parsed = createBatchSchema.safeParse({
      barcode: "8901030899012",
      expirationDate: "2026-08-20",
      locationNote: "Aisle 4",
      quantityEstimate: 12,
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects invalid category query", () => {
    const parsed = listBatchesQuerySchema.safeParse({
      category: "INVALID",
      status: "ACTIVE",
    });

    expect(parsed.success).toBe(false);
  });

  it("requires at least one patch field", () => {
    const parsed = patchBatchSchema.safeParse({});
    expect(parsed.success).toBe(false);
  });

  it("accepts clear payload with optional waste fields", () => {
    const parsed = clearBatchSchema.safeParse({
      discardedUnits: 3,
      note: "Disposed during quality check",
      clearReason: "Near expiry",
    });

    expect(parsed.success).toBe(true);
  });
});

