import { toPrioritizedAlertTasks } from "@/lib/services/alerts";
import { describe, expect, it } from "vitest";

describe("alerts prioritization", () => {
  it("sorts tasks by expiration date and then entry date", () => {
    const now = new Date("2026-05-01T00:00:00.000Z");
    const tasks = toPrioritizedAlertTasks(
      [
        {
          id: "batch-2",
          expirationDate: new Date("2026-05-05T00:00:00.000Z"),
          entryDate: new Date("2026-05-02T00:00:00.000Z"),
          status: "ACTIVE",
          locationNote: null,
          quantityEstimate: 10,
          product: {
            id: "prod-2",
            barcode: "8901030899029",
            sku: "YOG-PLAIN-400",
            name: "Plain Yogurt 400g",
            category: "DAIRY",
          },
        },
        {
          id: "batch-1",
          expirationDate: new Date("2026-05-03T00:00:00.000Z"),
          entryDate: new Date("2026-05-01T00:00:00.000Z"),
          status: "ACTIVE",
          locationNote: null,
          quantityEstimate: 5,
          product: {
            id: "prod-1",
            barcode: "8901030899012",
            sku: "MILK-1L-WHOLE",
            name: "Whole Milk 1L",
            category: "DAIRY",
          },
        },
      ],
      now
    );

    expect(tasks.map((task) => task.id)).toEqual(["batch-1", "batch-2"]);
    expect(tasks[0]?.expiryStatus).toBe("CRITICAL");
    expect(tasks[1]?.daysUntilExpiration).toBe(4);
  });
});

