"use client";

import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useId, useRef, useState } from "react";

type BarcodeScannerFieldProps = {
  onDetected: (barcode: string) => void;
};

export function BarcodeScannerField({ onDetected }: BarcodeScannerFieldProps) {
  const scannerRegionId = useId().replace(/:/g, "");
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const scanner = new Html5QrcodeScanner(
      scannerRegionId,
      {
        fps: 10,
        qrbox: { width: 250, height: 120 },
      },
      false
    );

    scannerRef.current = scanner;

    scanner.render(
      (decodedText) => {
        onDetected(decodedText);
        setEnabled(false);
      },
      (decodeError) => {
        const message = String(decodeError);
        if (!message.toLowerCase().includes("no multiformat readers")) {
          setError(null);
        }
      }
    );

    return () => {
      setError(null);
      scanner
        .clear()
        .catch(() => {
          return;
        })
        .finally(() => {
          scannerRef.current = null;
        });
    };
  }, [enabled, onDetected, scannerRegionId]);

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setEnabled((current) => !current)}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
      >
        {enabled ? "Stop Camera Scanner" : "Scan Barcode with Camera"}
      </button>

      {enabled ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-2">
          <div id={scannerRegionId} />
        </div>
      ) : null}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}

