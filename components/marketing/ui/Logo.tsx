"use client";

import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  // Se conserva para que los usos existentes sigan funcionando.
  scrolled?: boolean;
  size?: "sm" | "md" | "lg";
  href?: string;
  variant?: "marketing" | "dashboard";
}

const sizes = {
  sm: {
    box: "h-10 w-10",
    text: "text-lg",
  },
  md: {
    box: "h-14 w-14",
    text: "text-2xl",
  },
  lg: {
    box: "h-14 w-14",
    text: "text-3xl",
  },
};

export default function Logo({
  size = "md",
  href = "/",
  variant = "marketing",
}: LogoProps) {
  return (
    <Link
      href={href}
      aria-label="Catalagox, ir al inicio"
      className="inline-flex shrink-0 items-center gap-1 rounded-lg transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
    >
      <div className={`relative shrink-0 ${sizes[size].box}`}>
        <Image
          src="/Logotipo-fondo-trasparente4.png"
          alt=""
          fill
          sizes={size === "sm" ? "40px" : "56px"}
          className="object-contain"
          priority
        />
      </div>

      <span
        className={`font-black tracking-tighter ${sizes[size].text}`}
        style={{
          color: variant === "dashboard" ? "#22c55e" : "#000000",
        }}
      >
        Catalagox
      </span>
    </Link>
  );
}