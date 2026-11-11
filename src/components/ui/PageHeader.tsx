import React from "react";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  badge?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  badge,
}: PageHeaderProps) {
  return (
    <section className="border-b border-[var(--color-soft-sand)] bg-white py-16 md:py-24">
      <div className="section-padding">
        <div className="max-w-3xl">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold tracking-[0.2em] text-[var(--color-brown-gold)] uppercase">
              {eyebrow}
            </span>
            {badge && (
              <span className="rounded-full border border-[var(--color-soft-sand)] bg-[var(--color-pale-gold)]/70 px-3 py-0.5 text-xs font-medium text-[var(--color-dark-brown)]">
                {badge}
              </span>
            )}
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-[var(--color-dark-brown)] sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-[var(--color-muted-brown)] md:text-lg">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
