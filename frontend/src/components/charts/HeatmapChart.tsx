"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface HourData {
  hour: string;
  pnl: number;
  trades: number;
}

export default function HeatmapChart({ data }: { data: HourData[] }) {
  const maxPnl = Math.max(...data.map((d) => Math.abs(d.pnl)), 1);

  function getStyle(pnl: number, trades: number): { bg: string; border: string } {
    if (trades === 0) return { bg: "bg-gray-800/30", border: "border-gray-800/50" };
    const intensity = Math.min(Math.abs(pnl) / maxPnl, 1);
    if (pnl > 0) {
      if (intensity > 0.6) return { bg: "bg-emerald-600/30", border: "border-emerald-500/30" };
      if (intensity > 0.3) return { bg: "bg-emerald-700/20", border: "border-emerald-600/20" };
      return { bg: "bg-emerald-800/15", border: "border-emerald-700/15" };
    }
    if (intensity > 0.6) return { bg: "bg-red-600/30", border: "border-red-500/30" };
    if (intensity > 0.3) return { bg: "bg-red-700/20", border: "border-red-600/20" };
    return { bg: "bg-red-800/15", border: "border-red-700/15" };
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400" />
          <CardTitle>Performance by Hour</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-2">
          {data.map((d) => {
            const style = getStyle(d.pnl, d.trades);
            return (
              <div
                key={d.hour}
                className={cn(
                  "rounded-lg p-3 text-center border transition-all hover:scale-105 cursor-default",
                  style.bg,
                  style.border
                )}
                title={`${d.hour}: $${d.pnl.toFixed(2)} (${d.trades} trades)`}
              >
                <div className="text-xs text-gray-300 font-mono font-medium">{d.hour}</div>
                <div className="text-[10px] text-gray-500 mt-0.5">{d.trades} trades</div>
                <div className={cn(
                  "text-xs mt-1 font-semibold",
                  d.pnl > 0 ? "text-emerald-400" : d.pnl < 0 ? "text-red-400" : "text-gray-500"
                )}>
                  {d.pnl >= 0 ? "+" : ""}${Math.abs(d.pnl).toFixed(0)}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-5 mt-5 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-emerald-600/30 border border-emerald-500/30 rounded" />
            Profitable
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-red-600/30 border border-red-500/30 rounded" />
            Loss
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-gray-800/30 border border-gray-800/50 rounded" />
            No trades
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
