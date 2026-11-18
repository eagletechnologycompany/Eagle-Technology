"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, AlertCircle, ArrowLeft, Info } from "lucide-react";
import { EagleLogo } from "@/components/ui/EagleLogo";

export function LoginForm({ sessionExpired }: { sessionExpired: boolean }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
        setError(data.error || "Sign in failed.");
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
      setError("Network error while attempting to sign in.");
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
            Private Customer &amp; Founder Platform
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
            Secure access for Eagle Technology founders, registered customers, and developer platform participants.
          </p>
        </div>

        {sessionExpired && !error && (
          <div
            role="status"
            className="mb-5 flex items-start gap-2.5 rounded-xl border border-[var(--color-brown-gold)]/40 bg-[var(--color-pale-gold)]/55 p-3.5 text-xs text-[var(--color-dark-brown)]"
          >
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-brown-gold)]" />
            <span>Your session expired or requires authentication. Please sign in to continue.</span>
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
              Role Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ceo, frontend, backend, design, ai-automation, or client"
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
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your account password"
              className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3.5 py-2.5 text-sm text-[var(--color-deep-brown)] focus:border-[var(--color-brown-gold)] focus:bg-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[var(--color-brown-gold)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In to Workspace"}
          </button>
        </form>

        {/* Demo Reviewer Role Fillers */}
        <div className="mt-5 border-t border-[var(--color-soft-sand)] pt-4">
          <p className="mb-2 text-[10px] font-bold text-[var(--color-muted-brown)] uppercase tracking-wider">
            Reviewer Role Quick Fill:
          </p>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => {
                setUsername("ceo");
                setPassword("EagleFounders!2026");
              }}
              className="rounded-md border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-2 py-1.5 text-left text-[11px] font-semibold text-[var(--color-dark-brown)] hover:bg-[var(--color-pale-gold)] transition-colors"
            >
              👑 Founder &amp; CEO
            </button>
            <button
              type="button"
              onClick={() => {
                setUsername("client");
                setPassword("EagleClient!2026");
              }}
              className="rounded-md border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-2 py-1.5 text-left text-[11px] font-semibold text-[var(--color-dark-brown)] hover:bg-[var(--color-pale-gold)] transition-colors"
            >
              💼 Client (Portal)
            </button>
            <button
              type="button"
              onClick={() => {
                setUsername("backend");
                setPassword("EagleFounders!2026");
              }}
              className="rounded-md border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-2 py-1.5 text-left text-[11px] font-semibold text-[var(--color-dark-brown)] hover:bg-[var(--color-pale-gold)] transition-colors"
            >
              ⚙️ Backend Dev
            </button>
            <button
              type="button"
              onClick={() => {
                setUsername("ai-automation");
                setPassword("EagleFounders!2026");
              }}
              className="rounded-md border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-2 py-1.5 text-left text-[11px] font-semibold text-[var(--color-dark-brown)] hover:bg-[var(--color-pale-gold)] transition-colors"
            >
              🤖 AI Specialist
            </button>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] p-3.5 text-[11px] leading-relaxed text-[var(--color-muted-brown)]">
          <p className="font-semibold text-[var(--color-dark-brown)]">
            Password Reset &amp; Account Provisioning
          </p>
          <p className="mt-1">
            Automated email password resets are disabled until official email
            infrastructure is configured. Contact the Founder &amp; CEO for account
            activation or credential recovery.
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
