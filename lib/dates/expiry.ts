import { differenceInCalendarDays } from "date-fns";

export type ExpiryStatus = "NORMAL" | "SOON" | "CRITICAL" | "EXPIRED";

export function getDaysUntilExpiration(expirationDate: Date, now = new Date()): number {
  return differenceInCalendarDays(expirationDate, now);
}

export function getExpiryStatus(expirationDate: Date, now = new Date()): ExpiryStatus {
  const daysRemaining = getDaysUntilExpiration(expirationDate, now);

  if (daysRemaining < 0) {
    return "EXPIRED";
  }
  if (daysRemaining <= 7) {
    return "CRITICAL";
  }
  if (daysRemaining <= 21) {
    return "SOON";
  }
  return "NORMAL";
}

export function getExpiryBadgeStyles(status: ExpiryStatus): string {
  switch (status) {
    case "NORMAL":
      return "bg-emerald-100 text-emerald-800";
    case "SOON":
      return "bg-amber-100 text-amber-900";
    case "CRITICAL":
      return "bg-red-100 text-red-900";
    case "EXPIRED":
      return "bg-red-200 text-red-950";
    default: {
      const exhaustiveCheck: never = status;
      return exhaustiveCheck;
    }
  }
}

