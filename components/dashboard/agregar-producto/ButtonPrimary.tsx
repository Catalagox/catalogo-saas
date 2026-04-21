"use client";

import React from "react";

type ButtonPrimaryProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
};

export default function ButtonPrimary({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
}: ButtonPrimaryProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        bg-[var(--color-primary)]
        text-[var(--text-primary)]
        font-semibold
        px-6
        py-2
        rounded-lg
        transition
        hover:bg-[var(--color-primary-hover)]
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
}
