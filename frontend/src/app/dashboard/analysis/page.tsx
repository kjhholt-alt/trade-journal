"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Sparkles,
  TrendingUp,
  TrendingDown,
  LineChart,
  Target,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
    "Holding losing trades too long -- average loss duration 3x average win duration",
  ],
  patterns: [
    "Tuesday and Thursday are your most profitable days (avg +$340/day)",
    "Trades entered in first 30 minutes have 15% higher win rate",
    "Short positions on tech stocks outperform long positions by 2:1",
    "Win rate drops significantly after 3+ trades in a single session",
  ],
  recommendations: [
    "Set a daily trade limit of 3 trades to prevent overtrading",
    "Focus morning session only -- your edge disappears after lunch",
    "Size down by 25% after 2 consecutive wins to prevent overconfidence",
    "Add a mandatory 15-minute cooldown period after any losing trade",
    "Consider focusing exclusively on your top 3 performing tickers",
  ],
};

const sections = [
  {
    key: "strengths" as const,
    title: "Strengths",
    icon: <TrendingUp className="w-4 h-4" />,
    color: "emerald",
    gradient: "from-emerald-500/10 to-green-500/10",
    borderColor: "border-emerald-800/30",
    iconBg: "bg-emerald-500/15 text-emerald-400",
    bulletColor: "bg-emerald-400",
  },
  {
    key: "weaknesses" as const,
    title: "Weaknesses",
    icon: <TrendingDown className="w-4 h-4" />,
    color: "red",
    gradient: "from-red-500/10 to-orange-500/10",
    borderColor: "border-red-800/30",
    iconBg: "bg-red-500/15 text-red-400",
    bulletColor: "bg-red-400",
  },
  {
    key: "patterns" as const,
    title: "Patterns Detected",
    icon: <LineChart className="w-4 h-4" />,
    color: "blue",
    gradient: "from-blue-500/10 to-cyan-500/10",
    borderColor: "border-blue-800/30",
    iconBg: "bg-blue-500/15 text-blue-400",
    bulletColor: "bg-blue-400",
  },
  {
    key: "recommendations" as const,
    title: "Recommendations",
    icon: <Target className="w-4 h-4" />,
    color: "purple",
    gradient: "from-purple-500/10 to-brand-500/10",
    borderColor: "border-purple-800/30",
    iconBg: "bg-purple-500/15 text-purple-400",
    bulletColor: "bg-purple-400",
  },
];

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
        await new Promise((r) => setTimeout(r, 1500));
        setAnalysis(MOCK_ANALYSIS);
      }
    } catch {
      await new Promise((r) => setTimeout(r, 1500));
      setAnalysis(MOCK_ANALYSIS);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Analysis</h1>
          <p className="text-gray-400 text-sm mt-1">
            Get AI-powered coaching on your trading patterns
          </p>
        </div>
        <Button onClick={runAnalysis} disabled={loading} size="lg">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Run New Analysis
            </>
          )}
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {!analysis && !loading && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="border-dashed">
              <CardContent className="py-16 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-brand-600/20 to-purple-600/20 flex items-center justify-center border border-brand-600/20">
                  <Brain className="w-9 h-9 text-brand-400" />
                </div>
                <p className="text-gray-300 text-lg font-medium mb-2">No analysis yet</p>
                <p className="text-gray-500 text-sm max-w-sm mx-auto">
                  Click &quot;Run New Analysis&quot; to get AI-powered insights
                  on your trading patterns and personalized coaching advice.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card>
              <CardContent className="py-16 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-brand-600/20 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
                </div>
                <p className="text-gray-300 text-lg font-medium mb-2">Analyzing your trades...</p>
                <p className="text-gray-500 text-sm">
                  Our AI is reviewing your patterns and generating coaching advice
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {analysis && !loading && (
          <motion.div
            key="results"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            className="grid md:grid-cols-2 gap-5"
          >
            {sections.map((s) => (
              <motion.div
                key={s.key}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              >
                <Card className={cn("h-full", s.borderColor)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", s.iconBg)}>
                        {s.icon}
                      </div>
                      <CardTitle>{s.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {analysis[s.key].map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-gray-300 leading-relaxed">
                          <div className={cn("w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0", s.bulletColor)} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
