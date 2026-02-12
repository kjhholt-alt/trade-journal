export interface Trade {
  id: number;
  ticker: string;
  side: "long" | "short";
  entry_price: number;
  exit_price: number;
  quantity: number;
  entry_time: string;
  exit_time: string;
  pnl: number;
  fees: number;
  notes: string;
}

function randomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

const tickers = ["AAPL", "TSLA", "NVDA", "AMD", "META", "MSFT", "AMZN", "GOOGL", "SPY", "QQQ"];
const sides: ("long" | "short")[] = ["long", "short"];
const noteOptions = [
  "Followed plan",
  "FOMO entry",
  "Overtraded",
  "Clean setup",
  "Revenge trade",
  "News catalyst",
  "Breakout play",
  "Mean reversion",
  "Earnings play",
  "Scalp",
];

export const mockTrades: Trade[] = Array.from({ length: 50 }, (_, i) => {
  const ticker = tickers[Math.floor(Math.random() * tickers.length)];
  const side = sides[Math.floor(Math.random() * sides.length)];
  const entryPrice = parseFloat((50 + Math.random() * 450).toFixed(2));
  const priceChange = parseFloat(((Math.random() - 0.42) * 20).toFixed(2));
  const exitPrice = parseFloat((entryPrice + (side === "long" ? priceChange : -priceChange)).toFixed(2));
  const quantity = Math.floor(Math.random() * 200) + 10;
  const pnl = parseFloat(((exitPrice - entryPrice) * quantity * (side === "long" ? 1 : -1)).toFixed(2));
  const fees = parseFloat((quantity * 0.005).toFixed(2));

  const entryDate = randomDate(new Date("2025-01-01"), new Date("2025-12-31"));
  const exitDate = new Date(entryDate.getTime() + Math.random() * 8 * 60 * 60 * 1000);

  return {
    id: i + 1,
    ticker,
    side,
    entry_price: entryPrice,
    exit_price: exitPrice,
    quantity,
    entry_time: entryDate.toISOString(),
    exit_time: exitDate.toISOString(),
    pnl,
    fees,
    notes: noteOptions[Math.floor(Math.random() * noteOptions.length)],
  };
});

export function getTradeStats(trades: Trade[]) {
  const totalTrades = trades.length;
  const wins = trades.filter((t) => t.pnl > 0);
  const losses = trades.filter((t) => t.pnl <= 0);
  const winRate = totalTrades > 0 ? (wins.length / totalTrades) * 100 : 0;
  const totalPnl = trades.reduce((sum, t) => sum + t.pnl, 0);
  const avgWin = wins.length > 0 ? wins.reduce((s, t) => s + t.pnl, 0) / wins.length : 0;
  const avgLoss = losses.length > 0 ? Math.abs(losses.reduce((s, t) => s + t.pnl, 0) / losses.length) : 0;
  const avgRR = avgLoss > 0 ? avgWin / avgLoss : 0;

  return {
    totalTrades,
    winRate: parseFloat(winRate.toFixed(1)),
    totalPnl: parseFloat(totalPnl.toFixed(2)),
    avgRR: parseFloat(avgRR.toFixed(2)),
  };
}

export function getPnlOverTime(trades: Trade[]) {
  const sorted = [...trades].sort(
    (a, b) => new Date(a.exit_time).getTime() - new Date(b.exit_time).getTime()
  );
  let cumPnl = 0;
  return sorted.map((t) => {
    cumPnl += t.pnl;
    return {
      date: new Date(t.exit_time).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      pnl: parseFloat(cumPnl.toFixed(2)),
    };
  });
}

export function getWinRateByTicker(trades: Trade[]) {
  const grouped: Record<string, { wins: number; total: number }> = {};
  for (const t of trades) {
    if (!grouped[t.ticker]) grouped[t.ticker] = { wins: 0, total: 0 };
    grouped[t.ticker].total++;
    if (t.pnl > 0) grouped[t.ticker].wins++;
  }
  return Object.entries(grouped).map(([ticker, data]) => ({
    ticker,
    winRate: parseFloat(((data.wins / data.total) * 100).toFixed(1)),
    trades: data.total,
  }));
}

export function getHourlyPerformance(trades: Trade[]) {
  const hours: Record<number, { pnl: number; count: number }> = {};
  for (let h = 6; h <= 20; h++) hours[h] = { pnl: 0, count: 0 };

  for (const t of trades) {
    const hour = new Date(t.entry_time).getHours();
    if (hours[hour]) {
      hours[hour].pnl += t.pnl;
      hours[hour].count++;
    }
  }

  return Object.entries(hours).map(([hour, data]) => ({
    hour: `${hour}:00`,
    pnl: parseFloat(data.pnl.toFixed(2)),
    trades: data.count,
  }));
}

export function getPositionSizeDistribution(trades: Trade[]) {
  const ranges = [
    { label: "1-25", min: 1, max: 25 },
    { label: "26-50", min: 26, max: 50 },
    { label: "51-100", min: 51, max: 100 },
    { label: "101-150", min: 101, max: 150 },
    { label: "151+", min: 151, max: Infinity },
  ];

  return ranges.map((range) => {
    const filtered = trades.filter((t) => t.quantity >= range.min && t.quantity <= range.max);
    return {
      range: range.label,
      count: filtered.length,
      avgPnl: filtered.length > 0
        ? parseFloat((filtered.reduce((s, t) => s + t.pnl, 0) / filtered.length).toFixed(2))
        : 0,
    };
  });
}
