"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Upload, Brain, LayoutDashboard, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <nav className="sticky top-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center shadow-lg shadow-brand-600/20 group-hover:shadow-brand-500/30 transition-shadow">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">
              Trade<span className="text-brand-400">Journal</span>
            </span>
          </Link>

          <div className="flex items-center gap-1">
            {isDashboard ? (
              <>
                <NavLink href="/dashboard" active={pathname === "/dashboard"}>
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">Overview</span>
                </NavLink>
                <NavLink href="/dashboard/upload" active={pathname === "/dashboard/upload"}>
                  <Upload className="w-4 h-4" />
                  <span className="hidden sm:inline">Upload</span>
                </NavLink>
                <NavLink href="/dashboard/analysis" active={pathname === "/dashboard/analysis"}>
                  <Brain className="w-4 h-4" />
                  <span className="hidden sm:inline">AI Analysis</span>
                </NavLink>
              </>
            ) : (
              <>
                <a
                  href="#features"
                  className="px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Features
                </a>
                <Button asChild size="sm" className="ml-2">
                  <Link href="/dashboard">
                    <BarChart3 className="w-4 h-4 mr-1.5" />
                    Dashboard
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
        active
          ? "bg-brand-600/15 text-brand-400"
          : "text-gray-400 hover:text-white hover:bg-gray-800/50"
      )}
    >
      {children}
    </Link>
  );
}
