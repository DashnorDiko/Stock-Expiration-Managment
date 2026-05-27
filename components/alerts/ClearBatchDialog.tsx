"use client";

import { FormEvent, useState } from "react";

type ClearBatchDialogProps = {
  batchId: string;
  onClose: () => void;
  onCleared: () => void;
};

export function ClearBatchDialog({ batchId, onCleared, onClose }: ClearBatchDialogProps) {
  const [discardedUnits, setDiscardedUnits] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/batches/${batchId}/clear`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          discardedUnits: discardedUnits ? Number(discardedUnits) : undefined,
          note: note || undefined,
        }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(payload.error ?? "Unable to clear batch.");
        return;
      }

      onCleared();
      onClose();
    } catch {
      setError("Clear request failed. Please retry.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-slate-900/40 p-4 md:items-center">
      <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow-xl">
        <h3 className="text-lg font-semibold text-slate-900">Clear Batch</h3>
        <p className="mt-1 text-sm text-slate-600">Optional: log discarded units for reporting.</p>
        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <div className="space-y-1">
            <label htmlFor="discardedUnits" className="text-sm font-medium text-slate-700">
              Discarded Units (optional)
            </label>
            <input
              id="discardedUnits"
              type="number"
              min={0}
              value={discardedUnits}
              onChange={(event) => setDiscardedUnits(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="note" className="text-sm font-medium text-slate-700">
              Note (optional)
            </label>
            <input
              id="note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white disabled:bg-emerald-400"
            >
              {submitting ? "Clearing..." : "Confirm Clear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

