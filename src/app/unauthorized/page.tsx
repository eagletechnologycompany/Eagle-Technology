import type { Metadata } from "next";
import Link from "next/link";
import { ShieldOff } from "lucide-react";

export const metadata: Metadata = {
  title: "Unauthorized Access — Eagle Technology",
  robots: { index: false, follow: false },
};

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-warm-off-white)] px-4">
      <div className="max-w-md rounded-2xl border border-[var(--color-soft-sand)] bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-700">
          <ShieldOff className="h-6 w-6" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-[var(--color-dark-brown)]">
          Access Restricted
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted-brown)]">
          Your founding role does not include permission to access this operational
          resource or action. Server-side permission enforcement blocked this request.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/dashboard"
            className="rounded-lg bg-[var(--color-brown-gold)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--accent-hover)]"
          >
            Back to Overview
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-[var(--color-soft-sand)] px-4 py-2 text-sm font-semibold text-[var(--color-dark-brown)] hover:bg-[var(--color-pale-gold)]"
          >
            Switch Role Account
          </Link>
        </div>
      </div>
    </main>
  );
}
