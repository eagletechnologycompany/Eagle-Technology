"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, AlertCircle, ArrowLeft, Info, Eye, EyeOff } from "lucide-react";
import { EagleLogo } from "@/components/ui/EagleLogo";

export function LoginForm({ sessionExpired }: { sessionExpired: boolean }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Invalid username/email or password.");
        setLoading(false);
        return;
      }
      if (data.founder?.roleId === "client") {
        router.push("/portal");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch {
      setError("Network error while attempting to sign in. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-[var(--color-soft-sand)] bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <EagleLogo
            size={120}
            color="var(--color-dark-brown)"
            accentColor="var(--color-brown-gold)"
          />
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[var(--color-pale-gold)] px-3 py-1 text-[11px] font-semibold text-[var(--color-dark-brown)]">
            <Lock className="h-3 w-3 text-[var(--color-brown-gold)]" aria-hidden="true" />
            Client &amp; Platform Access
          </div>

          {/* Dual Tab Switcher */}
          <div className="mt-4 grid w-full grid-cols-2 rounded-xl bg-[var(--color-warm-off-white)] p-1 text-xs font-semibold">
            <span className="rounded-lg bg-white py-1.5 text-[var(--color-dark-brown)] shadow-xs">
              Sign In
            </span>
            <Link
              href="/signup"
              className="rounded-lg py-1.5 text-[var(--color-muted-brown)] transition-colors hover:text-[var(--color-dark-brown)]"
            >
              Create Account
            </Link>
          </div>

          <h1 className="mt-4 text-2xl font-bold text-[var(--color-dark-brown)]">
            Platform Sign In
          </h1>
          <p className="mt-1 text-xs text-[var(--color-muted-brown)]">
            Authorized access for registered clients, project stakeholders, and invited team members.
          </p>
        </div>

        {sessionExpired && !error && (
          <div
            role="status"
            className="mb-5 flex items-start gap-2.5 rounded-xl border border-[var(--color-brown-gold)]/40 bg-[var(--color-pale-gold)]/55 p-3.5 text-xs text-[var(--color-dark-brown)]"
          >
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-brown-gold)]" />
            <span>Your session has expired. Please sign in to resume your active workspace.</span>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-300 bg-red-50 p-3.5 text-xs text-red-900"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-700" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="mb-1.5 block text-xs font-semibold tracking-wide text-[var(--color-dark-brown)] uppercase"
            >
              Email or Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="name@company.com or account ID"
              className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3.5 py-2.5 text-sm text-[var(--color-deep-brown)] focus:border-[var(--color-brown-gold)] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-xs font-semibold tracking-wide text-[var(--color-dark-brown)] uppercase"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your account password"
                className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] py-2.5 pr-10 pl-3.5 text-sm text-[var(--color-deep-brown)] focus:border-[var(--color-brown-gold)] focus:bg-white focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-2.5 right-2.5 text-[var(--color-muted-brown)] hover:text-[var(--color-dark-brown)]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[var(--color-brown-gold)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In to Platform"}
          </button>
        </form>

        <div className="mt-6 rounded-xl border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] p-3.5 text-[11px] leading-relaxed text-[var(--color-muted-brown)]">
          <p className="font-semibold text-[var(--color-dark-brown)]">
            Account Provisioning &amp; Recovery
          </p>
          <p className="mt-1">
            New commercial clients may register at{" "}
            <Link href="/signup" className="font-semibold text-[var(--color-brown-gold)] underline">
              Create Account
            </Link>
            . Founder and operational staff accounts are provisioned strictly via administrator invitation.
          </p>
        </div>
      </div>

      <div className="mt-5 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-muted-brown)] hover:text-[var(--color-dark-brown)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Return to Public Website
        </Link>
      </div>
    </div>
  );
}
