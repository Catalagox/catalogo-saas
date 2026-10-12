"use client";

import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  scrolled?: boolean;
  size?: "sm" | "md" | "lg";
  href?: string;
  variant?: "marketing" | "dashboard";
}

const sizes = {
  sm: {
    wordmark: "h-9 w-36 sm:h-10 sm:w-40",
    imageWidth: "(min-width: 640px) 160px, 144px",
  },
  md: {
    wordmark: "h-10 w-40 sm:h-12 sm:w-48",
    imageWidth: "(min-width: 640px) 192px, 160px",
  },
  lg: {
    wordmark: "h-12 w-48 sm:h-14 sm:w-56",
    imageWidth: "(min-width: 640px) 224px, 192px",
  },
};

const logos = {
  marketing: "/Logotipo/logo-negro.png",
  dashboard: "/Logotipo/logo-verde.png",
};

export default function Logo({
  size = "md",
  href = "/",
  variant = "marketing",
}: LogoProps) {
  const selectedSize = sizes[size];

  const position =
  variant === "dashboard"
    ? "ml-0 sm:-ml-2"
    : "ml-0 sm:-ml-2";
    
  return (
    <Link
      href={href}
      aria-label="Catalagox, ir al inicio"
      className={`inline-flex shrink-0 items-center rounded-lg transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current ${position}`}
    >
      <div className={`relative shrink-0 ${selectedSize.wordmark}`}>
        <Image
          src={logos[variant]}
          alt=""
          fill
          sizes={selectedSize.imageWidth}
          className="object-contain object-left"
          priority
        />
      </div>
    </Link>
  );
}