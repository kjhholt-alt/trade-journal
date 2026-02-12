"use client";

import { useState, useCallback, DragEvent, ChangeEvent } from "react";
import Papa from "papaparse";

interface ParsedRow {
  [key: string]: string;
}

type BrokerFormat = "auto" | "td_ameritrade" | "robinhood";

const COLUMN_MAPPINGS: Record<string, Record<string, string>> = {
  td_ameritrade: {
    Symbol: "ticker",
    "Buy/Sell": "side",
    Price: "entry_price",
    Quantity: "quantity",
    "Date/Time": "entry_time",
    "Net Amount": "pnl",
    Commission: "fees",
  },
  robinhood: {
    Instrument: "ticker",
    Side: "side",
    "Average Price": "entry_price",
    Quantity: "quantity",
    Date: "entry_time",
    "Total P&L": "pnl",
    Fees: "fees",
  },
};

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [broker, setBroker] = useState<BrokerFormat>("auto");
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setUploadResult(null);

    Papa.parse(f, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as ParsedRow[];
        setParsedData(data);
        if (data.length > 0) {
          setHeaders(Object.keys(data[0]));
        }
      },
      error: () => {
        setParsedData([]);
        setHeaders([]);
      },
    });
  }, []);

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f && f.name.endsWith(".csv")) {
      handleFile(f);
    }
  }

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  }

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("broker", broker);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/trades/upload`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setUploadResult(`Successfully uploaded ${data.trades_count || parsedData.length} trades.`);
      } else {
        setUploadResult("Upload failed. Make sure the backend is running.");
      }
    } catch {
      setUploadResult("Upload failed. Make sure the backend is running on port 8000.");
    } finally {
      setUploading(false);
    }
  }

  const previewRows = parsedData.slice(0, 10);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Upload Trades</h1>
        <p className="text-gray-400 mt-1">Import your trade history from a CSV file</p>
      </div>

      {/* Broker Selection */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-sm font-medium text-gray-300 mb-3">Broker Format</h3>
        <div className="flex gap-3">
          {(["auto", "td_ameritrade", "robinhood"] as BrokerFormat[]).map((b) => (
            <button
              key={b}
              onClick={() => setBroker(b)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                broker === b
                  ? "bg-brand-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              {b === "auto" ? "Auto Detect" : b === "td_ameritrade" ? "TD Ameritrade" : "Robinhood"}
            </button>
          ))}
        </div>
      </div>

      {/* Drop Zone */}
      <div
        onDrop={onDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
          dragOver
            ? "border-brand-500 bg-brand-900/10"
            : "border-gray-700 hover:border-gray-600"
        }`}
      >
        <svg
          className="w-12 h-12 mx-auto text-gray-500 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p className="text-gray-400 mb-2">
          Drag and drop your CSV file here, or{" "}
          <label className="text-brand-400 cursor-pointer hover:text-brand-300">
            browse
            <input
              type="file"
              accept=".csv"
              onChange={onFileChange}
              className="hidden"
            />
          </label>
        </p>
        <p className="text-xs text-gray-500">Supports TD Ameritrade and Robinhood CSV formats</p>
        {file && (
          <p className="text-sm text-green-400 mt-4">
            Selected: {file.name} ({parsedData.length} rows)
          </p>
        )}
      </div>

      {/* Preview Table */}
      {previewRows.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              Preview (first {previewRows.length} rows)
            </h3>
            <span className="text-sm text-gray-400">{parsedData.length} total rows</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  {headers.map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-gray-400 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewRows.map((row, i) => (
                  <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                    {headers.map((h) => (
                      <td key={h} className="px-4 py-3 text-gray-300 whitespace-nowrap">
                        {row[h] || "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Upload Button */}
      {parsedData.length > 0 && (
        <div className="flex items-center gap-4">
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {uploading ? "Uploading..." : `Upload ${parsedData.length} Trades`}
          </button>
          {uploadResult && (
            <p className={`text-sm ${uploadResult.includes("Successfully") ? "text-green-400" : "text-red-400"}`}>
              {uploadResult}
            </p>
          )}
        </div>
      )}

      {/* Column Mapping Info */}
      {broker !== "auto" && COLUMN_MAPPINGS[broker] && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Column Mapping</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
            {Object.entries(COLUMN_MAPPINGS[broker]).map(([from, to]) => (
              <div key={from} className="text-gray-400">
                <span className="text-gray-500">{from}</span> &rarr;{" "}
                <span className="text-brand-400">{to}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
