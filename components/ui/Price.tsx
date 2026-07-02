// components/ui/Price.tsx
"use client";

import React from "react";
import { countriesRegistry } from "@/lib/Countries";

interface PriceProps {
  amount: number;
  countryCode: string; // The code coming from Supabase (e.g., "PE", "MX")
  className?: string;  // For custom Tailwind classes
}

export default function Price({ amount, countryCode, className = "" }: PriceProps) {
  // Look up the country in your registry. If missing or not found, defaults to "PE".
  const countryData = countriesRegistry[(countryCode || "PE").toUpperCase()] || countriesRegistry["PE"];

  // Format the number to handle correct decimals and separators
  const formattedAmount = Number(amount).toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <span className={className}>
      {countryData.symbol}&nbsp;{formattedAmount}
    </span>
  );
}