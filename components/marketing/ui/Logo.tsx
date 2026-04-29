"use client";

import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  scrolled?: boolean;
  size?: "sm" | "md" | "lg";
  href?: string;
}

export default function Logo({
  scrolled = false,
  size = "md",
  href = "/",
}: LogoProps) {
  const textColor = scrolled ? "text-slate-900" : "text-white";

  const sizes = {
    sm: {
      box: "w-10 h-10",
      text: "text-lg",
    },
    md: {
      box: "w-14 h-14",
      text: "text-2xl",
    },
    lg: {
      box: "w-16 h-16",
      text: "text-3xl",
    },
  };

  return (
    <Link
      href={href}
      className="flex items-center gap-1 group transition-transform hover:scale-105"
    >
      <div className={`relative ${sizes[size].box} overflow-hidden`}>
        <Image
          src="/Logotipo-fondo-trasparente.png"
          alt="CatalogX"
          fill
          className="object-contain"
          priority
        />
      </div>

      <span
        className={`font-black tracking-tighter transition-colors ${sizes[size].text} ${textColor}`}
      >
        Catalogo<span className="text-[var(--color-primary)]">X</span>
      </span>
    </Link>
  );
}
