"use client";

import StatCard from "@/components/StatCard";
import PnlChart from "@/components/charts/PnlChart";
import WinRateChart from "@/components/charts/WinRateChart";
import HeatmapChart from "@/components/charts/HeatmapChart";
import PositionSizeChart from "@/components/charts/PositionSizeChart";
import {
  mockTrades,
  getTradeStats,
  getPnlOverTime,
  getWinRateByTicker,
  getHourlyPerformance,
  getPositionSizeDistribution,
} from "@/data/mockTrades";

export default function DashboardPage() {
  const stats = getTradeStats(mockTrades);
  const pnlData = getPnlOverTime(mockTrades);
  const winRateData = getWinRateByTicker(mockTrades);
  const hourlyData = getHourlyPerformance(mockTrades);
  const positionData = getPositionSizeDistribution(mockTrades);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Overview of your trading performance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Trades"
          value={stats.totalTrades}
          subtitle="All time"
        />
        <StatCard
          title="Win Rate"
          value={`${stats.winRate}%`}
          trend={stats.winRate >= 50 ? "up" : "down"}
        />
        <StatCard
          title="Total P&L"
          value={`$${stats.totalPnl.toLocaleString()}`}
          trend={stats.totalPnl >= 0 ? "up" : "down"}
        />
        <StatCard
          title="Average R:R"
          value={`${stats.avgRR}:1`}
          trend={stats.avgRR >= 1 ? "up" : "neutral"}
        />
      </div>

      {/* Charts */}
      <PnlChart data={pnlData} />

      <div className="grid lg:grid-cols-2 gap-6">
        <WinRateChart data={winRateData} />
        <PositionSizeChart data={positionData} />
      </div>

      <HeatmapChart data={hourlyData} />
    </div>
  );
}
