"use client";

interface HourData {
  hour: string;
  pnl: number;
  trades: number;
}

export default function HeatmapChart({ data }: { data: HourData[] }) {
  const maxPnl = Math.max(...data.map((d) => Math.abs(d.pnl)), 1);

  function getColor(pnl: number): string {
    if (pnl === 0) return "bg-gray-800";
    const intensity = Math.min(Math.abs(pnl) / maxPnl, 1);
    if (pnl > 0) {
      if (intensity > 0.6) return "bg-green-600";
      if (intensity > 0.3) return "bg-green-700";
      return "bg-green-800";
    }
    if (intensity > 0.6) return "bg-red-600";
    if (intensity > 0.3) return "bg-red-700";
    return "bg-red-800";
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Performance by Hour</h3>
      <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-15 gap-2">
        {data.map((d) => (
          <div
            key={d.hour}
            className={`${getColor(d.pnl)} rounded-lg p-3 text-center cursor-default group relative`}
            title={`${d.hour}: $${d.pnl.toFixed(2)} (${d.trades} trades)`}
          >
            <div className="text-xs text-gray-300 font-mono">{d.hour}</div>
            <div className="text-xs text-gray-400 mt-1">{d.trades}t</div>
            <div className={`text-xs mt-1 font-medium ${d.pnl >= 0 ? "text-green-300" : "text-red-300"}`}>
              ${Math.abs(d.pnl).toFixed(0)}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-600 rounded" />
          <span>Profitable</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-600 rounded" />
          <span>Loss</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gray-800 rounded" />
          <span>No trades</span>
        </div>
      </div>
    </div>
  );
}
