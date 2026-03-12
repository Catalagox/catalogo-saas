"use client";

import React from "react";

type ButtonOutlineProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
};

export default function ButtonOutline({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
}: ButtonOutlineProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        border
        border-gray-700
        text-white
        px-6
        py-2
        rounded-lg
        font-medium
        transition
        hover:bg-gray-800
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
}