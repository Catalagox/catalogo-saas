"use client";

import React from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  className,
  ...props
}) => {
  const baseStyles = "rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200";

  const variantStyles = clsx({
    "bg-black text-white hover:bg-gray-800 focus:ring-black": variant === "primary",
    "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-500": variant === "secondary",
    "border border-black text-black hover:bg-black hover:text-white focus:ring-black": variant === "outline",
  });

  const sizeStyles = clsx({
    "px-3 py-1 text-sm": size === "sm",
    "px-5 py-2 text-md": size === "md",
    "px-6 py-3 text-lg": size === "lg",
  });

  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={clsx(baseStyles, variantStyles, sizeStyles, className, loading && "opacity-70 cursor-not-allowed")}
    >
      {loading ? "Cargando..." : children}
    </button>
  );
};

export default Button;