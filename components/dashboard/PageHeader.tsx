"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { BackButton } from "./BackButton";

interface PageHeaderProps {
  title: string;
  category?: string;
  icon?: LucideIcon;
  showBackButton?: boolean;
  children?: ReactNode;
}

export function PageHeader({
  title,
  category,
  icon: Icon,
  showBackButton = true,
  children,
}: PageHeaderProps) {
  const mostrarFilaSuperior = showBackButton || category || Icon;

  return (
    <div className="mb-6 flex min-w-0 flex-col gap-4 border-b border-[var(--border-card)] pb-5 text-[var(--text-primary)] sm:flex-row sm:items-center sm:justify-between md:mb-8">
      <div className="flex min-w-0 flex-col gap-1.5">
        {mostrarFilaSuperior && (
          <div className="flex flex-wrap items-center gap-3">
            {showBackButton && <BackButton label="" />}

            {(category || Icon) && (
              <div className="flex min-w-0 items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                {Icon && (
                  <Icon
                    aria-hidden="true"
                    className="h-3.5 w-3.5 shrink-0"
                  />
                )}

                {category && (
                  <span className="break-words">{category}</span>
                )}
              </div>
            )}
          </div>
        )}

        <h1 className="break-words text-2xl font-extrabold tracking-tight text-[var(--text-primary)] md:text-3xl">
          {title}
        </h1>
      </div>

      {children != null && (
        <div className="flex min-w-0 flex-wrap items-center gap-3 sm:justify-end">
          {children}
        </div>
      )}
    </div>
  );
}