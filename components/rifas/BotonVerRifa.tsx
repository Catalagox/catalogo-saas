"use client";

import React from "react";
import Link from "next/link";

interface BotonVerRifaProps {
  slug: string;
}

export default function BotonVerRifa({ slug }: BotonVerRifaProps) {
  return (
    <Link
      href={`/rifas/${slug}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs px-4 py-2 rounded-xl border border-emerald-200 transition-all cursor-pointer shadow-sm"
    >
      <span>👁️</span>
      <span>Ver Rifa Pública</span>
    </Link>
  );
}