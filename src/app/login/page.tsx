import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentFounder } from "@/server/auth/session";
import { LoginForm } from "@/components/dashboard/LoginForm";

export const metadata: Metadata = {
  title: "Founder Sign In — Eagle Technology",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ expired?: string }>;
}) {
  const founder = await getCurrentFounder();
  if (founder) {
    redirect("/dashboard");
  }

  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-warm-off-white)] px-4 py-12">
      <LoginForm sessionExpired={params.expired === "1"} />
    </main>
  );
}
