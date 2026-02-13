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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers } from "lucide-react";

interface DataPoint {
  range: string;
  count: number;
  avgPnl: number;
}

export default function PositionSizeChart({ data }: { data: DataPoint[] }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-400" />
          <CardTitle>Position Size Distribution</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="range"
              stroke="#4b5563"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              label={{ value: "Shares", position: "insideBottom", offset: -5, fill: "#6b7280", fontSize: 11 }}
            />
            <YAxis stroke="#4b5563" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15, 18, 30, 0.9)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "10px",
                color: "#f3f4f6",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any, name: any) => {
                const v = Number(value ?? 0);
                if (name === "count") return [v, "Trades"];
                return [`$${v.toFixed(2)}`, "Avg P&L"];
              }}
            />
            <Bar dataKey="count" fill="#a78bfa" fillOpacity={0.8} radius={[6, 6, 0, 0]} name="count" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
