import { describe, expect, it } from "vitest";
import { getDaysUntilExpiration, getExpiryStatus } from "@/lib/dates/expiry";

describe("expiry date helper", () => {
  const now = new Date("2026-01-01T12:00:00.000Z");

  it("marks past dates as EXPIRED", () => {
    const expirationDate = new Date("2025-12-31T00:00:00.000Z");
    expect(getExpiryStatus(expirationDate, now)).toBe("EXPIRED");
  });

  it("marks <= 7 days as CRITICAL", () => {
    const expirationDate = new Date("2026-01-08T00:00:00.000Z");
    expect(getExpiryStatus(expirationDate, now)).toBe("CRITICAL");
  });

  it("marks <= 21 days as SOON", () => {
    const expirationDate = new Date("2026-01-15T00:00:00.000Z");
    expect(getExpiryStatus(expirationDate, now)).toBe("SOON");
  });

  it("marks above threshold as NORMAL", () => {
    const expirationDate = new Date("2026-02-05T00:00:00.000Z");
    expect(getExpiryStatus(expirationDate, now)).toBe("NORMAL");
  });

  it("returns signed days until expiry", () => {
    const futureDate = new Date("2026-01-04T00:00:00.000Z");
    const pastDate = new Date("2025-12-30T00:00:00.000Z");

    expect(getDaysUntilExpiration(futureDate, now)).toBe(3);
    expect(getDaysUntilExpiration(pastDate, now)).toBe(-2);
  });
});

