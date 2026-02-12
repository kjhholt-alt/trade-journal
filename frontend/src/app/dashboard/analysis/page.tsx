"use client";

import { useState } from "react";

interface AnalysisResult {
  strengths: string[];
  weaknesses: string[];
  patterns: string[];
  recommendations: string[];
}

const MOCK_ANALYSIS: AnalysisResult = {
  strengths: [
    "Strong win rate on momentum plays during morning session (9:30-11:00 AM)",
    "Consistent position sizing on AAPL and TSLA trades",
    "Good risk management on short positions with tight stop losses",
    "Profitable mean reversion setups with 68% success rate",
  ],
  weaknesses: [
    "Overtrading in the afternoon session (2:00-4:00 PM) leading to net losses",
    "FOMO entries on breakouts result in 60% loss rate",
    "Position sizes increase after winning streaks, amplifying subsequent losses",
    "Holding losing trades too long - average loss duration 3x average win duration",
  ],
  patterns: [
    "Tuesday and Thursday are your most profitable days (avg +$340/day)",
    "Trades entered in first 30 minutes have 15% higher win rate",
    "Short positions on tech stocks outperform long positions by 2:1",
    "Win rate drops significantly after 3+ trades in a single session",
  ],
  recommendations: [
    "Set a daily trade limit of 3 trades to prevent overtrading",
    "Focus morning session only - your edge disappears after lunch",
    "Size down by 25% after 2 consecutive wins to prevent overconfidence",
    "Add a mandatory 15-minute cooldown period after any losing trade",
    "Consider focusing exclusively on your top 3 performing tickers",
  ],
};

export default function AnalysisPage() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function runAnalysis() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai-review", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setAnalysis(data);
      } else {
        // Fall back to mock data if backend isn't available
        await new Promise((r) => setTimeout(r, 1500));
        setAnalysis(MOCK_ANALYSIS);
      }
    } catch {
      // Use mock data for demo
      await new Promise((r) => setTimeout(r, 1500));
      setAnalysis(MOCK_ANALYSIS);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Analysis</h1>
          <p className="text-gray-400 mt-1">
            Get AI-powered coaching on your trading patterns
          </p>
        </div>
        <button
          onClick={runAnalysis}
          disabled={loading}
          className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Analyzing...
            </>
          ) : (
            "Run New Analysis"
          )}
        </button>
      </div>

      {!analysis && !loading && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <p className="text-gray-400 text-lg mb-2">No analysis yet</p>
          <p className="text-gray-500 text-sm">
            Click &quot;Run New Analysis&quot; to get AI-powered insights on your trading
          </p>
        </div>
      )}

      {loading && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <svg className="animate-spin w-12 h-12 mx-auto text-brand-500 mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-gray-400 text-lg mb-2">Analyzing your trades...</p>
          <p className="text-gray-500 text-sm">
            Our AI is reviewing your trading patterns and generating coaching advice
          </p>
        </div>
      )}

      {analysis && !loading && (
        <div className="grid md:grid-cols-2 gap-6">
          <AnalysisSection
            title="Strengths"
            items={analysis.strengths}
            color="green"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            }
          />
          <AnalysisSection
            title="Weaknesses"
            items={analysis.weaknesses}
            color="red"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            }
          />
          <AnalysisSection
            title="Patterns Detected"
            items={analysis.patterns}
            color="blue"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
          />
          <AnalysisSection
            title="Recommendations"
            items={analysis.recommendations}
            color="purple"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            }
          />
        </div>
      )}
    </div>
  );
}

function AnalysisSection({
  title,
  items,
  color,
  icon,
}: {
  title: string;
  items: string[];
  color: "green" | "red" | "blue" | "purple";
  icon: React.ReactNode;
}) {
  const colorMap = {
    green: {
      bg: "bg-green-900/20",
      border: "border-green-800",
      icon: "text-green-400",
      bullet: "bg-green-400",
    },
    red: {
      bg: "bg-red-900/20",
      border: "border-red-800",
      icon: "text-red-400",
      bullet: "bg-red-400",
    },
    blue: {
      bg: "bg-blue-900/20",
      border: "border-blue-800",
      icon: "text-blue-400",
      bullet: "bg-blue-400",
    },
    purple: {
      bg: "bg-purple-900/20",
      border: "border-purple-800",
      icon: "text-purple-400",
      bullet: "bg-purple-400",
    },
  };

  const c = colorMap[color];

  return (
    <div className={`${c.bg} border ${c.border} rounded-xl p-6`}>
      <div className="flex items-center gap-2 mb-4">
        <div className={c.icon}>{icon}</div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
            <div className={`w-1.5 h-1.5 ${c.bullet} rounded-full mt-2 flex-shrink-0`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
