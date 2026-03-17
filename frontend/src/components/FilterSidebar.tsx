"use client";

import { useState, useEffect } from "react";
import { Filter, X, Calendar, DollarSign, Tag as TagIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { TagInput } from "@/components/TagInput";
import { cn } from "@/lib/utils";

export interface TradeFilters {
  tags: string[];
  tickers: string[];
  strategies: string[];
  dateFrom: string;
  dateTo: string;
  pnlMin: string;
  pnlMax: string;
}

interface FilterSidebarProps {
  filters: TradeFilters;
  onFiltersChange: (filters: TradeFilters) => void;
  availableTags: string[];
  availableTickers: string[];
  availableStrategies: string[];
  isOpen: boolean;
  onClose: () => void;
}

export function FilterSidebar({
  filters,
  onFiltersChange,
  availableTags,
  availableTickers,
  availableStrategies,
  isOpen,
  onClose,
}: FilterSidebarProps) {
  const [localFilters, setLocalFilters] = useState<TradeFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  function updateFilter<K extends keyof TradeFilters>(key: K, value: TradeFilters[K]) {
    const updated = { ...localFilters, [key]: value };
    setLocalFilters(updated);
    onFiltersChange(updated);
  }

  function clearFilters() {
    const cleared: TradeFilters = {
      tags: [],
      tickers: [],
      strategies: [],
      dateFrom: "",
      dateTo: "",
      pnlMin: "",
      pnlMax: "",
    };
    setLocalFilters(cleared);
    onFiltersChange(cleared);
  }

  function toggleTicker(ticker: string) {
    const updated = localFilters.tickers.includes(ticker)
      ? localFilters.tickers.filter((t) => t !== ticker)
      : [...localFilters.tickers, ticker];
    updateFilter("tickers", updated);
  }

  function toggleStrategy(strategy: string) {
    const updated = localFilters.strategies.includes(strategy)
      ? localFilters.strategies.filter((s) => s !== strategy)
      : [...localFilters.strategies, strategy];
    updateFilter("strategies", updated);
  }

  const activeFilterCount =
    localFilters.tags.length +
    localFilters.tickers.length +
    localFilters.strategies.length +
    (localFilters.dateFrom ? 1 : 0) +
    (localFilters.dateTo ? 1 : 0) +
    (localFilters.pnlMin ? 1 : 0) +
    (localFilters.pnlMax ? 1 : 0);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 h-screen w-80 bg-gray-950 border-r border-gray-800 z-50 overflow-y-auto transition-transform lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-brand-400" />
              <h2 className="text-lg font-semibold text-white">Filters</h2>
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="bg-brand-600/20 text-brand-300">
                  {activeFilterCount}
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Clear All */}
          {activeFilterCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="w-full"
            >
              Clear All Filters
            </Button>
          )}

          <Separator />

          {/* Tags Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TagIcon className="w-4 h-4 text-gray-400" />
              <label className="text-sm font-medium text-gray-300">Tags</label>
            </div>
            <TagInput
              value={localFilters.tags}
              onChange={(tags) => updateFilter("tags", tags)}
              suggestions={availableTags}
              placeholder="Filter by tags..."
            />
          </div>

          <Separator />

          {/* Tickers Filter */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-300">Tickers</label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {availableTickers.map((ticker) => (
                <div key={ticker} className="flex items-center space-x-2">
                  <Checkbox
                    id={`ticker-${ticker}`}
                    checked={localFilters.tickers.includes(ticker)}
                    onCheckedChange={() => toggleTicker(ticker)}
                  />
                  <label
                    htmlFor={`ticker-${ticker}`}
                    className="text-sm text-gray-300 cursor-pointer flex-1"
                  >
                    {ticker}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Strategy Filter */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-300">Strategy</label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {availableStrategies.map((strategy) => (
                <div key={strategy} className="flex items-center space-x-2">
                  <Checkbox
                    id={`strategy-${strategy}`}
                    checked={localFilters.strategies.includes(strategy)}
                    onCheckedChange={() => toggleStrategy(strategy)}
                  />
                  <label
                    htmlFor={`strategy-${strategy}`}
                    className="text-sm text-gray-300 cursor-pointer flex-1"
                  >
                    {strategy}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Date Range Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <label className="text-sm font-medium text-gray-300">Date Range</label>
            </div>
            <div className="space-y-2">
              <Input
                type="date"
                value={localFilters.dateFrom}
                onChange={(e) => updateFilter("dateFrom", e.target.value)}
                placeholder="From"
                className="text-sm"
              />
              <Input
                type="date"
                value={localFilters.dateTo}
                onChange={(e) => updateFilter("dateTo", e.target.value)}
                placeholder="To"
                className="text-sm"
              />
            </div>
          </div>

          <Separator />

          {/* P&L Range Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <label className="text-sm font-medium text-gray-300">P&L Range</label>
            </div>
            <div className="space-y-2">
              <Input
                type="number"
                value={localFilters.pnlMin}
                onChange={(e) => updateFilter("pnlMin", e.target.value)}
                placeholder="Min ($)"
                className="text-sm"
              />
              <Input
                type="number"
                value={localFilters.pnlMax}
                onChange={(e) => updateFilter("pnlMax", e.target.value)}
                placeholder="Max ($)"
                className="text-sm"
              />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
