"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center font-bold text-white text-sm">
              TJ
            </div>
            <span className="text-lg font-semibold text-white">TradeJournal</span>
          </Link>

          <div className="flex items-center gap-6">
            {isDashboard ? (
              <>
                <Link
                  href="/dashboard"
                  className={`text-sm ${pathname === "/dashboard" ? "text-brand-400" : "text-gray-400 hover:text-white"}`}
                >
                  Overview
                </Link>
                <Link
                  href="/dashboard/upload"
                  className={`text-sm ${pathname === "/dashboard/upload" ? "text-brand-400" : "text-gray-400 hover:text-white"}`}
                >
                  Upload
                </Link>
                <Link
                  href="/dashboard/analysis"
                  className={`text-sm ${pathname === "/dashboard/analysis" ? "text-brand-400" : "text-gray-400 hover:text-white"}`}
                >
                  AI Analysis
                </Link>
              </>
            ) : (
              <>
                <a href="#features" className="text-sm text-gray-400 hover:text-white">
                  Features
                </a>
                <a href="#pricing" className="text-sm text-gray-400 hover:text-white">
                  Pricing
                </a>
                <Link
                  href="/dashboard"
                  className="text-sm bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Dashboard
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
