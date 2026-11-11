import React from "react";
import Link from "next/link";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
}

const variantStyles = {
  primary:
    "bg-[var(--color-brown-gold)] text-white hover:bg-[var(--accent-hover)] shadow-sm",
  secondary:
    "bg-[var(--color-pale-gold)] text-[var(--color-dark-brown)] hover:bg-[var(--color-soft-sand)]",
  outline:
    "border-2 border-[var(--color-brown-gold)] text-[var(--color-brown-gold)] hover:bg-[var(--color-brown-gold)] hover:text-white",
};

const sizeStyles = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  disabled = false,
  onClick,
}: ButtonProps) {
  const base = `inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={base}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={base} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}
