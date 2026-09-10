"use client";

import { PackageCheck, PackageX, AlertTriangle } from "lucide-react";

interface StockBadgeProps {
  stock?: number | null;
  disponible?: boolean;
  limiteStockBajo?: number;
  mostrarTextoCompleto?: boolean;
}

export default function StockBadge({
  stock,
  disponible = true,
  limiteStockBajo = 5,
  mostrarTextoCompleto = true,
}: StockBadgeProps) {
  // Si está deshabilitado manualmente o stock es 0
  if (!disponible || stock === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
        <PackageX size={14} />
        {mostrarTextoCompleto ? "Agotado" : "Sin stock"}
      </span>
    );
  }

  // Si no se gestiona stock numérico (stock es null o undefined) pero está disponible
  if (stock === null || stock === undefined) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
        <PackageCheck size={14} />
        {mostrarTextoCompleto ? "Disponible" : "En stock"}
      </span>
    );
  }

  // Quedan pocas unidades
  if (stock <= limiteStockBajo) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-pulse">
        <AlertTriangle size={14} />
        {mostrarTextoCompleto
          ? `¡Últimas ${stock} unidades!`
          : `${stock} dispon.`}
      </span>
    );
  }

  // Stock normal disponible
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
      <PackageCheck size={14} />
      {mostrarTextoCompleto
        ? `${stock} unidades disponibles`
        : `${stock} en stock`}
    </span>
  );
}