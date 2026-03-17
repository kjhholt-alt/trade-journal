"use client";

import { Activity, Target, DollarSign, Scale } from "lucide-react";
import StatCard from "@/components/StatCard";
import PnlChart from "@/components/charts/PnlChart";
import WinRateChart from "@/components/charts/WinRateChart";
import HeatmapChart from "@/components/charts/HeatmapChart";
import PositionSizeChart from "@/components/charts/PositionSizeChart";
import DailyPnlChart from "@/components/charts/DailyPnlChart";
import WinRatePieChart from "@/components/charts/WinRatePieChart";
import PnlByTickerChart from "@/components/charts/PnlByTickerChart";
import {
  mockTrades,
  getTradeStats,
  getPnlOverTime,
  getWinRateByTicker,
  getHourlyPerformance,
  getPositionSizeDistribution,
  getDailyPnl,
  getWinLossDistribution,
  getPnlByTicker,
} from "@/data/mockTrades";

export default function DashboardPage() {
  const stats = getTradeStats(mockTrades);
  const pnlData = getPnlOverTime(mockTrades);
  const winRateData = getWinRateByTicker(mockTrades);
  const hourlyData = getHourlyPerformance(mockTrades);
  const positionData = getPositionSizeDistribution(mockTrades);
  const dailyPnlData = getDailyPnl(mockTrades);
  const winLossData = getWinLossDistribution(mockTrades);
  const pnlByTickerData = getPnlByTicker(mockTrades);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Overview of your trading performance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Trades"
          value={stats.totalTrades}
          subtitle="All time"
          icon={<Activity className="w-4 h-4" />}
          delay={0}
        />
        <StatCard
          title="Win Rate"
          value={`${stats.winRate}%`}
          trend={stats.winRate >= 50 ? "up" : "down"}
          icon={<Target className="w-4 h-4" />}
          delay={0.1}
        />
        <StatCard
          title="Total P&L"
          value={`$${stats.totalPnl.toLocaleString()}`}
          trend={stats.totalPnl >= 0 ? "up" : "down"}
          icon={<DollarSign className="w-4 h-4" />}
          delay={0.2}
        />
        <StatCard
          title="Average R:R"
          value={`${stats.avgRR}:1`}
          trend={stats.avgRR >= 1 ? "up" : "neutral"}
          icon={<Scale className="w-4 h-4" />}
          delay={0.3}
        />
      </div>

      {/* P&L Charts Section */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">P&L Analysis</h2>
        <div className="space-y-6">
          {/* Cumulative P&L */}
          <PnlChart data={pnlData} />

          {/* Daily P&L */}
          <DailyPnlChart data={dailyPnlData} />

          {/* Two column: Win Rate Pie & P&L by Ticker */}
          <div className="grid lg:grid-cols-2 gap-6">
            <WinRatePieChart data={winLossData} />
            <WinRateChart data={winRateData} />
          </div>

          {/* P&L by Ticker Breakdown */}
          <PnlByTickerChart data={pnlByTickerData} />
        </div>
      </div>

      {/* Performance Insights Section */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Performance Insights</h2>
        <div className="space-y-6">
          {/* Two column charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            <PositionSizeChart data={positionData} />
            <HeatmapChart data={hourlyData} />
          </div>
        </div>
      </div>
    </div>
  );
}
