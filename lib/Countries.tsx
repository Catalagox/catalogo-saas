"use client";

import React from "react";

// Registro de todos los países de América con sus monedas y prefijos
export const countriesRegistry: Record<string, { name: string; phoneCode: string; currency: string; symbol: string }> = {
  AR: { name: "Argentina", phoneCode: "54", currency: "ARS", symbol: "$" },
  BO: { name: "Bolivia", phoneCode: "591", currency: "BOB", symbol: "Bs" },
  BR: { name: "Brasil", phoneCode: "55", currency: "BRL", symbol: "R$" },
  CA: { name: "Canadá", phoneCode: "1", currency: "CAD", symbol: "C$" },
  CL: { name: "Chile", phoneCode: "56", currency: "CLP", symbol: "$" },
  CO: { name: "Colombia", phoneCode: "57", currency: "COP", symbol: "$" },
  CR: { name: "Costa Rica", phoneCode: "506", currency: "CRC", symbol: "₡" },
  CU: { name: "Cuba", phoneCode: "53", currency: "CUP", symbol: "$" },
  EC: { name: "Ecuador", phoneCode: "593", currency: "USD", symbol: "$" },
  SV: { name: "El Salvador", phoneCode: "503", currency: "USD", symbol: "$" },
  US: { name: "Estados Unidos", phoneCode: "1", currency: "USD", symbol: "$" },
  GT: { name: "Guatemala", phoneCode: "502", currency: "GTQ", symbol: "Q" },
  HN: { name: "Honduras", phoneCode: "504", currency: "HNL", symbol: "L" },
  MX: { name: "México", phoneCode: "52", currency: "MXN", symbol: "$" },
  NI: { name: "Nicaragua", phoneCode: "505", currency: "NIO", symbol: "C$" },
  PA: { name: "Panamá", phoneCode: "507", currency: "PAB", symbol: "B/." },
  PY: { name: "Paraguay", phoneCode: "595", currency: "PYG", symbol: "₲" },
  PE: { name: "Perú", phoneCode: "51", currency: "PEN", symbol: "S/" },
  PR: { name: "Puerto Rico", phoneCode: "1", currency: "USD", symbol: "$" },
  DO: { name: "República Dominicana", phoneCode: "1", currency: "DOP", symbol: "RD$" },
  UY: { name: "Uruguay", phoneCode: "598", currency: "UYU", symbol: "$U" },
  VE: { name: "Venezuela", phoneCode: "58", currency: "VES", symbol: "Bs.S" },
  JM: { name: "Jamaica", phoneCode: "1876", currency: "JMD", symbol: "J$" },
  HT: { name: "Haití", phoneCode: "509", currency: "HTG", symbol: "G" },
};

interface SelectorPaisesProps {
  value: string;
  onChange: (codigo: string) => void;
}

// Componente Selector reutilizable para tus formularios
export default function SelectorPaises({ value, onChange }: SelectorPaisesProps) {
  // Ordenamos los países alfabéticamente por nombre para que sea más fácil de buscar para el usuario
  const paisesOrdenados = Object.entries(countriesRegistry).sort((a, b) =>
    a[1].name.localeCompare(b[1].name)
  );

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-card)] rounded-lg p-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--color-primario)] transition-colors"
    >
      {paisesOrdenados.map(([code, country]) => (
        <option key={code} value={code}>
          {country.name} ({country.symbol})
        </option>
      ))}
    </select>
  );
}