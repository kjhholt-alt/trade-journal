import { Mail, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">
              Trade<span className="text-brand-400">Journal</span>
            </span>
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="max-w-sm w-full glow-sm">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-brand-600/20 to-purple-600/20 flex items-center justify-center border border-brand-600/20">
              <Mail className="w-8 h-8 text-brand-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Check Your Email</h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              A sign-in link has been sent to your email address.
              Click the link to access your dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
