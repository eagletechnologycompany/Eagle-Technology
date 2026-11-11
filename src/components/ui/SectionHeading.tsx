import React from "react";

interface SectionHeadingProps {
  label?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  theme?: "light" | "dark";
}

export function SectionHeading({
  label,
  title,
  description,
  align = "center",
  theme = "light",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";
  const titleColor = theme === "dark" ? "text-white" : "text-[var(--color-dark-brown)]";
  const descColor =
    theme === "dark" ? "text-[var(--color-soft-sand)]/80" : "text-[var(--color-muted-brown)]";

  return (
    <div className={`mb-12 max-w-2xl md:mb-16 ${alignClass}`}>
      {label && (
        <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-[var(--color-brown-gold)] uppercase">
          {label}
        </p>
      )}
      <h2 className={`text-3xl font-bold leading-tight md:text-4xl ${titleColor}`}>
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-base leading-relaxed md:text-lg ${descColor}`}>
          {description}
        </p>
      )}
    </div>
  );
}
