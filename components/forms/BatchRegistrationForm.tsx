"use client";

import { BarcodeScannerField } from "@/components/forms/BarcodeScannerField";
import { CATEGORY_META } from "@/lib/constants/categories";
import { ProductCategory } from "@/lib/types/domain";
import { FormEvent, useMemo, useState } from "react";

type ProductLookupResult = {
  id: string;
  barcode: string;
  sku: string | null;
  name: string;
  category: ProductCategory;
  isActive: boolean;
};

type SubmitState = {
  message: string;
  type: "error" | "success";
} | null;

export function BatchRegistrationForm() {
  const [barcode, setBarcode] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [quantityEstimate, setQuantityEstimate] = useState("");
  const [locationNote, setLocationNote] = useState("");
  const [product, setProduct] = useState<ProductLookupResult | null>(null);
  const [loadingLookup, setLoadingLookup] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>(null);
  const [submitting, setSubmitting] = useState(false);

  const categoryLabel = useMemo(() => {
    if (!product) {
      return "N/A";
    }
    return CATEGORY_META[product.category].label;
  }, [product]);

  async function lookupProduct(nextBarcode: string) {
    setLoadingLookup(true);
    setSubmitState(null);
    setProduct(null);
    setBarcode(nextBarcode);

    try {
      const response = await fetch(`/api/products/lookup?barcode=${encodeURIComponent(nextBarcode)}`);
      const payload = (await response.json()) as { error?: string; product?: ProductLookupResult };

      if (!response.ok || !payload.product) {
        setSubmitState({
          message: payload.error ?? "Product not found in the master product table.",
          type: "error",
        });
        return;
      }

      setProduct(payload.product);
    } catch {
      setSubmitState({
        message: "Product lookup failed. Check network connection and retry.",
        type: "error",
      });
    } finally {
      setLoadingLookup(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState(null);

    if (!product) {
      setSubmitState({
        message: "Scan or lookup a valid product barcode first.",
        type: "error",
      });
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          barcode,
          expirationDate,
          locationNote: locationNote || undefined,
          quantityEstimate: quantityEstimate ? Number(quantityEstimate) : undefined,
        }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setSubmitState({
          message: payload.error ?? "Unable to register batch.",
          type: "error",
        });
        return;
      }

      setSubmitState({
        message: "Batch registered successfully.",
        type: "success",
      });
      setExpirationDate("");
      setQuantityEstimate("");
      setLocationNote("");
    } catch {
      setSubmitState({
        message: "Registration request failed. Please retry.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <BarcodeScannerField onDetected={lookupProduct} />

      <div className="space-y-2">
        <label htmlFor="barcode" className="text-sm font-medium text-slate-700">
          Barcode / SKU
        </label>
        <div className="flex gap-2">
          <input
            id="barcode"
            value={barcode}
            onChange={(event) => setBarcode(event.target.value)}
            placeholder="Scan or type barcode"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-base outline-none ring-offset-2 focus:border-slate-500 focus:ring-2 focus:ring-slate-300"
          />
          <button
            type="button"
            onClick={() => lookupProduct(barcode)}
            disabled={loadingLookup || barcode.trim().length < 3}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            Lookup
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700 md:grid-cols-2">
        <div>
          <p className="font-medium text-slate-600">Product Name</p>
          <p>{product?.name ?? "Not found yet"}</p>
        </div>
        <div>
          <p className="font-medium text-slate-600">Category</p>
          <p>{categoryLabel}</p>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="expirationDate" className="text-sm font-medium text-slate-700">
          Expiration Date
        </label>
        <input
          id="expirationDate"
          type="date"
          value={expirationDate}
          onChange={(event) => setExpirationDate(event.target.value)}
          required
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-base outline-none ring-offset-2 focus:border-slate-500 focus:ring-2 focus:ring-slate-300"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="quantityEstimate" className="text-sm font-medium text-slate-700">
          Quantity Estimate (optional)
        </label>
        <input
          id="quantityEstimate"
          type="number"
          min={1}
          value={quantityEstimate}
          onChange={(event) => setQuantityEstimate(event.target.value)}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-base outline-none ring-offset-2 focus:border-slate-500 focus:ring-2 focus:ring-slate-300"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="locationNote" className="text-sm font-medium text-slate-700">
          Location Note (optional)
        </label>
        <input
          id="locationNote"
          value={locationNote}
          onChange={(event) => setLocationNote(event.target.value)}
          placeholder="Example: Aisle 2 / Chiller B"
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-base outline-none ring-offset-2 focus:border-slate-500 focus:ring-2 focus:ring-slate-300"
        />
      </div>

      {submitState ? (
        <p className={submitState.type === "success" ? "text-sm text-emerald-700" : "text-sm text-red-600"}>
          {submitState.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-base font-semibold text-white disabled:cursor-not-allowed disabled:bg-emerald-400"
      >
        {submitting ? "Saving..." : "Register Batch"}
      </button>
    </form>
  );
}

