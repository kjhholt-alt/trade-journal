"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import Navbar from "@/components/Navbar";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await signIn("email", { email, callbackUrl: "/dashboard" });
    setSent(true);
  }

  return (
    <>
      <Navbar />
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-white text-center mb-2">Sign In</h1>
          <p className="text-gray-400 text-center mb-8">
            Enter your email to receive a magic link
          </p>

          {sent ? (
            <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 text-center">
              <p className="text-green-400 font-medium">Check your email!</p>
              <p className="text-gray-400 text-sm mt-1">
                We sent a sign-in link to your email address.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg transition-colors"
              >
                Send Magic Link
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
