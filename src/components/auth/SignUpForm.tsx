"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  AlertCircle,
  Building2,
  User,
  Mail,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export function SignUpForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [useCase, setUseCase] = useState("Commercial Client");
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Simple NIST-style password strength score (0 to 4)
  function getPasswordStrength(pwd: string): { score: number; label: string; color: string } {
    if (!pwd) return { score: 0, label: "Enter password", color: "bg-stone-200" };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: "Weak (min 8 chars)", color: "bg-red-500" };
      case 2:
        return { score: 2, label: "Fair", color: "bg-amber-500" };
      case 3:
        return { score: 3, label: "Good", color: "bg-blue-500" };
      case 4:
        return { score: 4, label: "Strong", color: "bg-emerald-600" };
      default:
        return { score: 0, label: "Too short", color: "bg-red-400" };
    }
  }

  const strength = getPasswordStrength(password);

  function handleQuickDemoFill() {
    setFullName("Sample Reviewer");
    setOrganization("Sample Organization");
    setEmail(`partner.${Date.now().toString().slice(-4)}@hornhorizon.et`);
    setPassword("EagleCustomer!2026");
    setUseCase("Commercial Client");
    setAgreedTerms(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!agreedTerms) {
      setError("Please accept the Terms of Service and Privacy Policy to proceed.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          organization,
          email,
          password,
          useCase,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Account registration failed.");
        setLoading(false);
        return;
      }

      // Successful registration -> route directly to portal with onboarding welcome param
      router.push("/portal?onboarding=true");
      router.refresh();
    } catch {
      setError("Network error while creating your account. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-lg">
      <div className="rounded-2xl border border-[var(--color-soft-sand)] bg-white p-8 md:p-10 shadow-lg">
        {/* Card Header */}
        <div className="mb-6">
          <div className="flex items-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-pale-gold)] px-3 py-1 text-[11px] font-semibold text-[var(--color-dark-brown)]">
              <ShieldCheck className="h-3.5 w-3.5 text-[var(--color-brown-gold)]" />
              Customer &amp; Partner Platform
            </span>
          </div>

          <h2 className="mt-3 text-2xl font-bold tracking-tight text-[var(--color-dark-brown)] md:text-3xl">
            Create Customer Account
          </h2>
          <p className="mt-1.5 text-xs text-[var(--color-muted-brown)] leading-relaxed">
            Gain immediate access to project milestone tracking, deliverable review, and developer sandbox tools.
          </p>
        </div>

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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="fullName"
                className="mb-1 block text-xs font-semibold text-[var(--color-dark-brown)] uppercase"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute top-3 left-3 h-4 w-4 text-[var(--color-muted-brown)]" />
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Abebe Kebede"
                  className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] py-2.5 pr-3.5 pl-9 text-sm text-[var(--color-deep-brown)] focus:border-[var(--color-brown-gold)] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="organization"
                className="mb-1 block text-xs font-semibold text-[var(--color-dark-brown)] uppercase"
              >
                Organization / Company
              </label>
              <div className="relative">
                <Building2 className="absolute top-3 left-3 h-4 w-4 text-[var(--color-muted-brown)]" />
                <input
                  id="organization"
                  type="text"
                  required
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. Horizon Fintech"
                  className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] py-2.5 pr-3.5 pl-9 text-sm text-[var(--color-deep-brown)] focus:border-[var(--color-brown-gold)] focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-xs font-semibold text-[var(--color-dark-brown)] uppercase"
            >
              Work Email
            </label>
            <div className="relative">
              <Mail className="absolute top-3 left-3 h-4 w-4 text-[var(--color-muted-brown)]" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] py-2.5 pr-3.5 pl-9 text-sm text-[var(--color-deep-brown)] focus:border-[var(--color-brown-gold)] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="useCase"
              className="mb-1 block text-xs font-semibold text-[var(--color-dark-brown)] uppercase"
            >
              Primary Platform Objective
            </label>
            <select
              id="useCase"
              value={useCase}
              onChange={(e) => setUseCase(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3.5 py-2.5 text-sm text-[var(--color-deep-brown)] focus:border-[var(--color-brown-gold)] focus:bg-white focus:outline-none"
            >
              <option value="Commercial Client">Commercial Client (Custom Software / Web Platform)</option>
              <option value="Technology Partner">Strategic Technology Partner</option>
              <option value="Developer Sandbox">Developer Sandbox &amp; SDK Evaluation</option>
              <option value="AI & Automation Inquiries">AI &amp; Automation Discovery</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-xs font-semibold text-[var(--color-dark-brown)] uppercase"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute top-3 left-3 h-4 w-4 text-[var(--color-muted-brown)]" />
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] py-2.5 pr-3.5 pl-9 text-sm text-[var(--color-deep-brown)] focus:border-[var(--color-brown-gold)] focus:bg-white focus:outline-none"
              />
            </div>

            {/* Password Strength Indicator */}
            {password && (
              <div className="mt-2 space-y-1">
                <div className="flex h-1.5 w-full gap-1 overflow-hidden rounded-full bg-stone-100">
                  <div
                    className={`h-full transition-all duration-300 ${strength.color}`}
                    style={{ width: `${(strength.score / 4) * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-[var(--color-muted-brown)]">
                  <span>Strength: {strength.label}</span>
                  <span>Min 8 characters</span>
                </div>
              </div>
            )}
          </div>

          {/* Terms and Privacy Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 text-xs text-[var(--color-muted-brown)] cursor-pointer">
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-[var(--color-soft-sand)] text-[var(--color-brown-gold)] focus:ring-[var(--color-brown-gold)]"
              />
              <span>
                I agree to Eagle Technology&apos;s{" "}
                <Link href="/terms" target="_blank" className="font-semibold text-[var(--color-brown-gold)] hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" target="_blank" className="font-semibold text-[var(--color-brown-gold)] hover:underline">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-brown-gold)] px-4 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-[var(--accent-hover)] disabled:opacity-60"
          >
            {loading ? (
              "Creating Customer Account..."
            ) : (
              <>
                Create Account &amp; Enter Platform
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 border-t border-[var(--color-soft-sand)] pt-5 text-center text-xs text-[var(--color-muted-brown)]">
          Already registered?{" "}
          <Link href="/login" className="font-semibold text-[var(--color-brown-gold)] hover:underline">
            Sign In to Platform
          </Link>
          <div className="mt-3">
            <button
              type="button"
              onClick={handleQuickDemoFill}
              className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[var(--color-muted-brown)] hover:text-[var(--color-brown-gold)] transition-colors"
            >
              <Sparkles className="h-3 w-3 text-[var(--color-brown-gold)]" />
              Demo Pre-fill (Sample Partner)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
