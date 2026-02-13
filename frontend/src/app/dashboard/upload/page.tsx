"use client";

import { useState, useCallback, DragEvent, ChangeEvent } from "react";
import { motion } from "framer-motion";
import Papa from "papaparse";
import { Upload, FileSpreadsheet, Check, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
        if (data.length > 0) setHeaders(Object.keys(data[0]));
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
    if (f && f.name.endsWith(".csv")) handleFile(f);
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
      const res = await fetch(`${apiUrl}/trades/upload`, { method: "POST", body: formData });
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Upload Trades</h1>
        <p className="text-gray-400 text-sm mt-1">Import your trade history from a CSV file</p>
      </div>

      {/* Broker Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-300">Broker Format</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {(["auto", "td_ameritrade", "robinhood"] as BrokerFormat[]).map((b) => (
              <Button
                key={b}
                variant={broker === b ? "default" : "outline"}
                size="sm"
                onClick={() => setBroker(b)}
              >
                {b === "auto" ? "Auto Detect" : b === "td_ameritrade" ? "TD Ameritrade" : "Robinhood"}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Drop Zone */}
      <motion.div
        onDrop={onDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        whileHover={{ scale: 1.005 }}
        className={cn(
          "border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer",
          dragOver
            ? "border-brand-500 bg-brand-900/10 glow-sm"
            : "border-gray-700/50 hover:border-gray-600"
        )}
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-brand-600/20 to-purple-600/20 flex items-center justify-center">
          <Upload className="w-7 h-7 text-brand-400" />
        </div>
        <p className="text-gray-300 mb-2 font-medium">
          Drag and drop your CSV file here
        </p>
        <p className="text-sm text-gray-500 mb-4">or</p>
        <label>
          <Button variant="outline" size="sm" className="cursor-pointer" asChild>
            <span>
              <FileSpreadsheet className="w-4 h-4 mr-1.5" />
              Browse Files
            </span>
          </Button>
          <input type="file" accept=".csv" onChange={onFileChange} className="hidden" />
        </label>
        <p className="text-xs text-gray-600 mt-4">Supports TD Ameritrade and Robinhood CSV formats</p>
        {file && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <Badge variant="success">
              <Check className="w-3 h-3 mr-1" />
              {file.name} ({parsedData.length} rows)
            </Badge>
          </div>
        )}
      </motion.div>

      {/* Preview Table */}
      {previewRows.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Preview (first {previewRows.length} rows)</CardTitle>
              <Badge variant="secondary">{parsedData.length} total rows</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    {headers.map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-gray-400 font-medium text-xs uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((row, i) => (
                    <tr key={i} className="border-b border-gray-800/40 hover:bg-gray-800/20 transition-colors">
                      {headers.map((h) => (
                        <td key={h} className="px-4 py-2.5 text-gray-300 whitespace-nowrap font-mono text-xs">
                          {row[h] || <span className="text-gray-600">-</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Button */}
      {parsedData.length > 0 && (
        <div className="flex items-center gap-4">
          <Button onClick={handleUpload} disabled={uploading} size="lg">
            {uploading ? (
              <>
                <svg className="animate-spin w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Uploading...
              </>
            ) : (
              <>
                Upload {parsedData.length} Trades
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
          {uploadResult && (
            <div className={cn(
              "flex items-center gap-1.5 text-sm",
              uploadResult.includes("Successfully") ? "text-emerald-400" : "text-red-400"
            )}>
              {uploadResult.includes("Successfully") ? (
                <Check className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              {uploadResult}
            </div>
          )}
        </div>
      )}

      {/* Column Mapping Info */}
      {broker !== "auto" && COLUMN_MAPPINGS[broker] && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Column Mapping</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              {Object.entries(COLUMN_MAPPINGS[broker]).map(([from, to]) => (
                <div key={from} className="flex items-center gap-2 text-gray-400">
                  <span className="text-gray-500 font-mono text-xs">{from}</span>
                  <ArrowRight className="w-3 h-3 text-gray-600" />
                  <span className="text-brand-400 font-mono text-xs">{to}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
