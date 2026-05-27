"use client";

import { CategoryTabs } from "@/components/inventory/CategoryTabs";
import { CATEGORY_META } from "@/lib/constants/categories";
import { getExpiryBadgeStyles, getExpiryStatus } from "@/lib/dates/expiry";
import { ProductCategory } from "@/lib/types/domain";
import { useEffect, useState } from "react";

type InventoryBatch = {
  id: string;
  expirationDate: string;
  quantityEstimate: number | null;
  locationNote: string | null;
  product: {
    name: string;
    barcode: string;
    category: ProductCategory;
  };
};

export default function InventoryPage() {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>("DAIRY");
  const [batches, setBatches] = useState<InventoryBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchBatches(category: ProductCategory) {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/batches?category=${category}&status=ACTIVE`, { cache: "no-store" });
      const payload = (await response.json()) as { error?: string; batches?: InventoryBatch[] };

      if (!response.ok || !payload.batches) {
        setError(payload.error ?? "Unable to load inventory batches.");
        return;
      }

      setBatches(payload.batches);
    } catch {
      setError("Unable to load inventory batches.");
    } finally {
      setLoading(false);
    }
  }

  async function archiveBatch(batchId: string) {
    try {
      const response = await fetch(`/api/batches/${batchId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ archive: true }),
      });
      if (!response.ok) {
        return;
      }
      await fetchBatches(selectedCategory);
    } catch {
      return;
    }
  }

  useEffect(() => {
    void fetchBatches(selectedCategory);
  }, [selectedCategory]);

  return (
    <section className="space-y-3">
      <header>
        <h1 className="text-xl font-bold text-slate-900">Warehouse / Inventory</h1>
        <p className="text-sm text-slate-600">Manage active batches by category and archive handled stock.</p>
      </header>

      <CategoryTabs selectedCategory={selectedCategory} onChange={setSelectedCategory} />

      {loading ? <p className="text-sm text-slate-600">Loading batches...</p> : null}
      {error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

      {!loading && !error && batches.length === 0 ? (
        <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
          No active batches in {CATEGORY_META[selectedCategory].label}.
        </p>
      ) : null}

      <div className="space-y-3">
        {batches.map((batch) => {
          const expiryStatus = getExpiryStatus(new Date(batch.expirationDate));
          const badgeStyle = getExpiryBadgeStyles(expiryStatus);

          return (
            <article key={batch.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">{batch.product.name}</h3>
                  <p className="text-xs text-slate-500">{batch.product.barcode}</p>
                </div>
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${badgeStyle}`}>{expiryStatus}</span>
              </div>
              <div className="mt-3 grid gap-1 text-sm text-slate-700">
                <p>Expiry: {new Date(batch.expirationDate).toLocaleDateString()}</p>
                {batch.quantityEstimate ? <p>Estimated Qty: {batch.quantityEstimate}</p> : null}
                {batch.locationNote ? <p>Location: {batch.locationNote}</p> : null}
              </div>
              <button
                type="button"
                onClick={() => void archiveBatch(batch.id)}
                className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
              >
                Archive Batch
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

