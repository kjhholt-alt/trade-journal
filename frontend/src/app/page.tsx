"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import {
  FileSpreadsheet,
  Brain,
  BarChart3,
  ArrowRight,
  Check,
  TrendingUp,
  Shield,
  Zap,
  Target,
  Clock,
  LineChart,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleWaitlist(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubmitted(true);
        setEmail("");
      }
    } catch {
      // silently fail for MVP
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-brand-600/5 rounded-full blur-3xl" />
        <div className="absolute top-20 right-0 w-72 h-72 bg-purple-600/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={fadeUp}>
              <Badge variant="default" className="mb-6 px-4 py-1.5 text-sm">
                <Zap className="w-3.5 h-3.5 mr-1.5" />
                Free during beta -- join now
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]"
            >
              AI-Powered
              <br />
              <span className="text-gradient">Trade Journal</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Import your trades from any broker. Get AI-driven coaching that
              identifies your strengths, weaknesses, and hidden patterns.
              Become a consistently profitable trader.
            </motion.p>

            <motion.div variants={fadeUp}>
              {submitted ? (
                <div className="glass rounded-xl p-5 max-w-md mx-auto glow-sm">
                  <div className="flex items-center justify-center gap-2 text-emerald-400">
                    <Check className="w-5 h-5" />
                    <p className="font-medium">
                      You are on the list! We will notify you at launch.
                    </p>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleWaitlist}
                  className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                >
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="h-12 text-base"
                  />
                  <Button type="submit" disabled={loading} size="lg" className="shrink-0">
                    {loading ? "..." : "Join Waitlist"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </form>
              )}
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm text-gray-500"
            >
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-gray-600" />
                No credit card required
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-gray-600" />
                2 min setup
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-gray-600" />
                50+ traders in beta
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-950/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.div variants={fadeUp}>
              <Badge variant="secondary" className="mb-4">Core Features</Badge>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
            >
              Everything you need to improve
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-gray-400 max-w-xl mx-auto text-lg"
            >
              From importing your first trade to getting AI coaching,
              we handle the entire workflow.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-6"
          >
            <FeatureCard
              icon={<FileSpreadsheet className="w-6 h-6" />}
              title="CSV Import"
              description="Import trades from TD Ameritrade, Robinhood, and other brokers. Automatic column mapping handles formatting."
              gradient="from-blue-500/10 to-cyan-500/10"
              iconColor="text-blue-400"
            />
            <FeatureCard
              icon={<Brain className="w-6 h-6" />}
              title="AI Analysis"
              description="Powered by Claude, our AI analyzes your patterns, identifies recurring mistakes, and gives actionable coaching."
              gradient="from-purple-500/10 to-pink-500/10"
              iconColor="text-purple-400"
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6" />}
              title="Visual Dashboards"
              description="P&L curves, win rate by ticker, time-of-day heatmaps, and position sizing -- all beautifully visualized."
              gradient="from-brand-500/10 to-indigo-500/10"
              iconColor="text-brand-400"
            />
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.div variants={fadeUp}>
              <Badge variant="secondary" className="mb-4">How It Works</Badge>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
            >
              Three steps to better trading
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-8"
          >
            <StepCard
              step={1}
              icon={<FileSpreadsheet className="w-5 h-5" />}
              title="Upload your trades"
              description="Export a CSV from your broker and drag it into TradeJournal. We parse and organize everything automatically."
            />
            <StepCard
              step={2}
              icon={<LineChart className="w-5 h-5" />}
              title="Review your data"
              description="See your P&L curves, win rates, and timing patterns in an interactive dashboard built for traders."
            />
            <StepCard
              step={3}
              icon={<Target className="w-5 h-5" />}
              title="Get AI coaching"
              description="Our AI finds patterns you miss -- overtrading signals, optimal entry times, position sizing issues, and more."
            />
          </motion.div>
        </div>
      </section>

      {/* Free Beta CTA */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/10 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="max-w-2xl mx-auto text-center"
          >
            <motion.div variants={fadeUp}>
              <Badge variant="success" className="mb-6 px-4 py-1.5 text-sm">
                Free During Beta
              </Badge>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
            >
              Start improving today
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-gray-400 mb-10 text-lg"
            >
              Full access to every feature. No credit card. No catch.
            </motion.p>

            <motion.div variants={fadeUp}>
              <Card className="max-w-sm mx-auto border-brand-800/30 glow-sm">
                <CardContent className="p-8 text-center">
                  <div className="mb-6">
                    <span className="text-5xl font-extrabold text-white">Free</span>
                    <p className="text-gray-500 mt-1">during beta</p>
                  </div>
                  <ul className="text-left space-y-3 mb-8">
                    {[
                      "Unlimited trade imports",
                      "AI-powered analysis",
                      "All chart types",
                      "Multi-broker support",
                      "Export reports",
                    ].map((feature) => (
                      <li key={feature} className="flex items-center gap-2.5 text-gray-300 text-sm">
                        <div className="w-5 h-5 rounded-full bg-brand-600/20 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-brand-400" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button asChild size="lg" className="w-full">
                    <a href="/dashboard">
                      Get Started Free
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-brand-500 to-brand-700 rounded-md flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-400">TradeJournal AI</span>
            </div>
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} TradeJournal AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  gradient,
  iconColor,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  iconColor: string;
}) {
  return (
    <motion.div variants={fadeUp}>
      <Card className="group hover:border-gray-700/80 transition-all duration-300 hover:glow-sm h-full">
        <CardContent className="p-6">
          <div
            className={cn(
              "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-5",
              gradient,
              iconColor
            )}
          >
            {icon}
          </div>
          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-brand-300 transition-colors">
            {title}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function StepCard({
  step,
  icon,
  title,
  description,
}: {
  step: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div variants={fadeUp} className="relative">
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-600/20 to-purple-600/20 flex items-center justify-center text-brand-400 border border-brand-600/20">
            {icon}
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center shadow-lg shadow-brand-600/30">
            {step}
          </div>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">{description}</p>
      </div>
    </motion.div>
  );
}
