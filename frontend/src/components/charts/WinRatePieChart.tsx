"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart as PieChartIcon } from "lucide-react";

interface DataPoint {
  name: string;
  value: number;
  fill: string;
}

export default function WinRatePieChart({ data }: { data: DataPoint[] }) {
  const total = data.reduce((sum, entry) => sum + entry.value, 0);
  const winRate = total > 0 ? ((data[0]?.value || 0) / total) * 100 : 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <PieChartIcon className="w-4 h-4 text-brand-400" />
          <CardTitle>Win Rate Distribution</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} opacity={0.9} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 18, 30, 0.9)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "10px",
                  color: "#f3f4f6",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: "13px", paddingTop: "10px" }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 text-center">
            <p className="text-2xl font-bold text-white">{winRate.toFixed(1)}%</p>
            <p className="text-sm text-gray-400">Overall Win Rate</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
