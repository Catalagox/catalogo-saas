// components/ui/Price.tsx

import {
  countriesRegistry,
  isCountryCode,
} from "@/lib/countries";

interface PriceProps {
  amount: number;
  countryCode: string;
  className?: string;
}

export default function Price({
  amount,
  countryCode,
  className = "",
}: PriceProps) {
  const normalizedCountryCode = (
    countryCode || "PE"
  ).toUpperCase();

  const countryData = isCountryCode(normalizedCountryCode)
    ? countriesRegistry[normalizedCountryCode]
    : countriesRegistry.PE;

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