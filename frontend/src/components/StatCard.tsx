"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
  delay?: number;
}

export default function StatCard({ title, value, subtitle, trend, icon, delay = 0 }: StatCardProps) {
  const trendConfig = {
    up: {
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      icon: <TrendingUp className="w-3.5 h-3.5" />,
    },
    down: {
      color: "text-red-400",
      bg: "bg-red-500/10",
      icon: <TrendingDown className="w-3.5 h-3.5" />,
    },
    neutral: {
      color: "text-gray-400",
      bg: "bg-gray-500/10",
      icon: <Minus className="w-3.5 h-3.5" />,
    },
  };

  const t = trend ? trendConfig[trend] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="hover:border-gray-700/80 transition-all duration-300">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <p className="text-sm font-medium text-gray-400">{title}</p>
            {icon && (
              <div className="w-8 h-8 rounded-lg bg-brand-600/10 flex items-center justify-center text-brand-400">
                {icon}
              </div>
            )}
          </div>
          <div className="flex items-end gap-2">
            <p className={cn("text-2xl font-bold", t?.color ?? "text-white")}>{value}</p>
            {t && (
              <div className={cn("flex items-center gap-1 px-1.5 py-0.5 rounded-md text-xs", t.bg, t.color)}>
                {t.icon}
              </div>
            )}
          </div>
          {subtitle && <p className="text-xs text-gray-500 mt-1.5">{subtitle}</p>}
        </CardContent>
      </Card>
    </motion.div>
  );
}
