"use client";

import React, { InputHTMLAttributes } from "react";
import clsx from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="w-full flex flex-col">
      {label && (
        <label className="mb-2 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <input
        className={clsx(
          "w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-black transition",
          error ? "border-red-500 focus:ring-red-500" : "border-gray-300",
          className
        )}
        {...props}
      />

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}