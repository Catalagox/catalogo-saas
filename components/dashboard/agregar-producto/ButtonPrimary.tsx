"use client";

import type { ButtonHTMLAttributes } from "react";

type ButtonPrimaryProps = ButtonHTMLAttributes<HTMLButtonElement>;

export default function ButtonPrimary({
  children,
  type = "button",
  disabled = false,
  className = "",
  ...props
}: ButtonPrimaryProps) {
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
        bg-[var(--color-primary)]
        px-6
        py-2.5
        text-sm
        font-bold
        text-[var(--color-text-inverse)]
        transition-colors
        enabled:hover:bg-[var(--color-primary-hover)]
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