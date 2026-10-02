"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  label?: string;
  className?: string;
}

export function BackButton({
  label = "Volver",
  className = "",
}: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      aria-label={label || "Volver"}
      className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[var(--border-card)] bg-[var(--bg-secondary)] px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] transition-all hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] active:scale-95 ${className}`}
    >
      <ArrowLeft size={16} aria-hidden="true" />
      {label && <span>{label}</span>}
    </button>
  );
}