"use client";

import type { ButtonHTMLAttributes } from "react";

type ButtonOutlineProps = ButtonHTMLAttributes<HTMLButtonElement>;

export default function ButtonOutline({
  children,
  type = "button",
  disabled = false,
  className = "",
  ...props
}: ButtonOutlineProps) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled}
      className={`
        inline-flex
        min-h-11
        items-center
        justify-center
        gap-2
        rounded-xl
        border
        border-[var(--border-card)]
        bg-[var(--bg-secondary)]
        px-6
        py-2.5
        text-sm
        font-semibold
        text-[var(--text-primary)]
        transition-colors
        enabled:hover:border-[var(--color-primary)]
        enabled:hover:bg-[var(--bg-card-hover)]
        focus-visible:outline-2
        focus-visible:outline-offset-2
        focus-visible:outline-[var(--color-primary)]
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${className}
      `}
    >
      {children}
    </button>
  );
}