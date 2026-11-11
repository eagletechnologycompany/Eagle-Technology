import React from "react";
import { Button } from "@/components/ui/Button";
import { EagleLogoMark } from "@/components/ui/EagleLogo";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center bg-[var(--color-warm-off-white)] py-20">
      <div className="section-padding max-w-xl text-center">
        <div className="mb-6 flex justify-center">
          <EagleLogoMark
            size={84}
            color="var(--color-dark-brown)"
            accentColor="var(--color-brown-gold)"
          />
        </div>
        <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-brown-gold)] uppercase">
          404 · Page Not Found
        </p>
        <h1 className="mt-3 text-3xl font-bold text-[var(--color-dark-brown)] sm:text-4xl">
          This page could not be found
        </h1>
        <p className="mt-4 text-base text-[var(--color-muted-brown)]">
          The page you requested may have moved or does not exist. Return to the Eagle
          Technology homepage or explore our solutions.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button href="/">Return Home</Button>
          <Button href="/solutions" variant="outline">
            Explore Solutions
          </Button>
        </div>
      </div>
    </section>
  );
}
