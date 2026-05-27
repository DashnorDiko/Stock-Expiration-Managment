"use client";

import { ClearBatchDialog } from "@/components/alerts/ClearBatchDialog";
import { CATEGORY_META } from "@/lib/constants/categories";
import { ExpiryStatus, getExpiryBadgeStyles } from "@/lib/dates/expiry";
import { ProductCategory } from "@/lib/types/domain";
import { useEffect, useMemo, useState } from "react";

type AlertTask = {
  id: string;
  expirationDate: string;
  locationNote: string | null;
  quantityEstimate: number | null;
  status: "ACTIVE" | "CLEARED" | "ARCHIVED";
  daysUntilExpiration: number;
  expiryStatus: ExpiryStatus;
  product: {
    id: string;
    barcode: string;
    sku: string | null;
    name: string;
    category: ProductCategory;
  };
};

function formatDays(days: number): string {
  if (days < 0) {
    return `${Math.abs(days)} day(s) overdue`;
  }
  if (days === 0) {
    return "Expires today";
  }
  return `${days} day(s) left`;
}

export function ExpiryTaskList() {
  const [tasks, setTasks] = useState<AlertTask[]>([]);
  const [activeDialogBatchId, setActiveDialogBatchId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadTasks() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/alerts", { cache: "no-store" });
      const payload = (await response.json()) as { error?: string; tasks?: AlertTask[] };
      if (!response.ok || !payload.tasks) {
        setError(payload.error ?? "Unable to fetch alerts.");
        return;
      }
      setTasks(payload.tasks);
    } catch {
      setError("Unable to fetch alerts.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadTasks();
  }, []);

  const priorityTasks = useMemo(() => {
    return tasks.filter((task) => task.expiryStatus !== "NORMAL");
  }, [tasks]);

  if (loading) {
    return <p className="text-sm text-slate-600">Loading alert tasks...</p>;
  }

  if (error) {
    return (
      <div className="space-y-2 rounded-xl border border-red-200 bg-red-50 p-3">
        <p className="text-sm text-red-700">{error}</p>
        <button
          type="button"
          onClick={() => void loadTasks()}
          className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  if (priorityTasks.length === 0) {
    return <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">No expiring tasks right now.</p>;
  }

  return (
    <div className="space-y-3">
      {priorityTasks.map((task) => (
        <article key={task.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-slate-900">{task.product.name}</h3>
              <p className="text-xs text-slate-500">
                {CATEGORY_META[task.product.category].label} • {task.product.barcode}
              </p>
            </div>
            <span className={`rounded-full px-2 py-1 text-xs font-semibold ${getExpiryBadgeStyles(task.expiryStatus)}`}>
              {task.expiryStatus}
            </span>
          </div>

          <div className="mt-3 grid gap-1 text-sm text-slate-700">
            <p>Expiry Date: {new Date(task.expirationDate).toLocaleDateString()}</p>
            <p className="font-medium">{formatDays(task.daysUntilExpiration)}</p>
            {task.locationNote ? <p>Location: {task.locationNote}</p> : null}
          </div>

          <button
            type="button"
            onClick={() => setActiveDialogBatchId(task.id)}
            className="mt-4 w-full rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Clear Batch
          </button>
        </article>
      ))}

      {activeDialogBatchId ? (
        <ClearBatchDialog
          batchId={activeDialogBatchId}
          onClose={() => setActiveDialogBatchId(null)}
          onCleared={() => void loadTasks()}
        />
      ) : null}
    </div>
  );
}

