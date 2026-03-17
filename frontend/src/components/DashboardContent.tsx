"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Activity, Target, DollarSign, Scale, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StatCard from "@/components/StatCard";
import PnlChart from "@/components/charts/PnlChart";
import WinRateChart from "@/components/charts/WinRateChart";
import HeatmapChart from "@/components/charts/HeatmapChart";
import PositionSizeChart from "@/components/charts/PositionSizeChart";
import DailyPnlChart from "@/components/charts/DailyPnlChart";
import WinRatePieChart from "@/components/charts/WinRatePieChart";
import PnlByTickerChart from "@/components/charts/PnlByTickerChart";
import { FilterSidebar, type TradeFilters } from "@/components/FilterSidebar";
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
  getAllTags,
  getAllTickers,
  getAllStrategies,
} from "@/data/mockTrades";

export function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Parse filters from URL
  const [filters, setFilters] = useState<TradeFilters>(() => ({
    tags: searchParams?.get("tags")?.split(",").filter(Boolean) || [],
    tickers: searchParams?.get("tickers")?.split(",").filter(Boolean) || [],
    strategies: searchParams?.get("strategies")?.split(",").filter(Boolean) || [],
    dateFrom: searchParams?.get("dateFrom") || "",
    dateTo: searchParams?.get("dateTo") || "",
    pnlMin: searchParams?.get("pnlMin") || "",
    pnlMax: searchParams?.get("pnlMax") || "",
  }));

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.tags.length) params.set("tags", filters.tags.join(","));
    if (filters.tickers.length) params.set("tickers", filters.tickers.join(","));
    if (filters.strategies.length) params.set("strategies", filters.strategies.join(","));
    if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.set("dateTo", filters.dateTo);
    if (filters.pnlMin) params.set("pnlMin", filters.pnlMin);
    if (filters.pnlMax) params.set("pnlMax", filters.pnlMax);

    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : "/dashboard";
    router.replace(newUrl, { scroll: false });
  }, [filters, router]);

  // Filter trades based on active filters
  const filteredTrades = useMemo(() => {
    return mockTrades.filter((trade) => {
      // Tag filter
      if (filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some((tag) => trade.tags.includes(tag));
        if (!hasMatchingTag) return false;
      }

      // Ticker filter
      if (filters.tickers.length > 0 && !filters.tickers.includes(trade.ticker)) {
        return false;
      }

      // Strategy filter
      if (filters.strategies.length > 0 && !filters.strategies.includes(trade.notes)) {
        return false;
      }

      // Date range filter
      if (filters.dateFrom) {
        const tradeDate = new Date(trade.exit_time);
        const fromDate = new Date(filters.dateFrom);
        if (tradeDate < fromDate) return false;
      }
      if (filters.dateTo) {
        const tradeDate = new Date(trade.exit_time);
        const toDate = new Date(filters.dateTo);
        toDate.setHours(23, 59, 59, 999); // End of day
        if (tradeDate > toDate) return false;
      }

      // P&L range filter
      if (filters.pnlMin && trade.pnl < parseFloat(filters.pnlMin)) {
        return false;
      }
      if (filters.pnlMax && trade.pnl > parseFloat(filters.pnlMax)) {
        return false;
      }

      return true;
    });
  }, [filters]);

  const stats = getTradeStats(filteredTrades);
  const pnlData = getPnlOverTime(filteredTrades);
  const winRateData = getWinRateByTicker(filteredTrades);
  const hourlyData = getHourlyPerformance(filteredTrades);
  const positionData = getPositionSizeDistribution(filteredTrades);
  const dailyPnlData = getDailyPnl(filteredTrades);
  const winLossData = getWinLossDistribution(filteredTrades);
  const pnlByTickerData = getPnlByTicker(filteredTrades);

  const availableTags = getAllTags(mockTrades);
  const availableTickers = getAllTickers(mockTrades);
  const availableStrategies = getAllStrategies(mockTrades);

  const activeFilterCount =
    filters.tags.length +
    filters.tickers.length +
    filters.strategies.length +
    (filters.dateFrom ? 1 : 0) +
    (filters.dateTo ? 1 : 0) +
    (filters.pnlMin ? 1 : 0) +
    (filters.pnlMax ? 1 : 0);

  return (
    <div className="flex min-h-screen">
      <FilterSidebar
        filters={filters}
        onFiltersChange={setFilters}
        availableTags={availableTags}
        availableTickers={availableTickers}
        availableStrategies={availableStrategies}
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />

      <div className="flex-1 p-6 space-y-6">
        {/* Header with Filter Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">
              {filteredTrades.length === mockTrades.length
                ? "Overview of your trading performance"
                : `Showing ${filteredTrades.length} of ${mockTrades.length} trades`}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="lg:hidden"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2 bg-brand-600/20 text-brand-300">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
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
    </div>
  );
}
