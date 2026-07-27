'use client';

import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { BackButton } from './BackButton';

interface PageHeaderProps {
  title: string;
  category?: string;
  icon?: LucideIcon;
  showBackButton?: boolean;
  children?: ReactNode; // Botones o widgets a la derecha
}

export function PageHeader({
  title,
  category,
  icon: Icon,
  showBackButton = true,
  children,
}: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-[var(--border-card)] pb-5 sm:flex-row sm:items-center sm:justify-between md:mb-8">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-3">
          {showBackButton && <BackButton label="" />}

          {category && (
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">
              {Icon && <Icon className="h-3.5 w-3.5" />}
              <span>{category}</span>
            </div>
          )}
        </div>

        <h1 className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)] md:text-3xl">
          {title}
        </h1>
      </div>

      {/* Zona para acciones (ej: Botón "Crear Producto", "IndicadorSuscripcion", etc.) */}
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
}