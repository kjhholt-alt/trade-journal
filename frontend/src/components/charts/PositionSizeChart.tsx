"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DataPoint {
  range: string;
  count: number;
  avgPnl: number;
}

export default function PositionSizeChart({ data }: { data: DataPoint[] }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Position Size Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="range" stroke="#9ca3af" fontSize={12} label={{ value: "Shares", position: "insideBottom", offset: -5, fill: "#9ca3af" }} />
          <YAxis stroke="#9ca3af" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#f3f4f6",
            }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any, name: any) => {
              const v = Number(value ?? 0);
              if (name === "count") return [v, "Trades"];
              return [`$${v.toFixed(2)}`, "Avg P&L"];
            }}
          />
          <Bar dataKey="count" fill="#818cf8" radius={[4, 4, 0, 0]} name="count" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
