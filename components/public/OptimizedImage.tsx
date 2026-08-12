"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";

interface OptimizedImageProps extends Omit<ImageProps, "onLoad"> {
  containerClassName?: string;
}

export default function OptimizedImage({
  src,
  alt,
  className = "",
  containerClassName = "",
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      className={`relative aspect-square overflow-hidden bg-neutral-200 ${containerClassName}`}
    >
      {/* 🚀 EFECTO SHIMMER EN FONDO CLARO */}
      {isLoading && (
        <div className="absolute inset-0 z-10 overflow-hidden bg-neutral-200">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/70 to-transparent" />
        </div>
      )}

      <Image
        src={src}
        alt={alt}
        {...props}
        onLoad={() => setIsLoading(false)}
        className={`
          object-cover
          transition-opacity
          duration-300
          ${isLoading ? "opacity-0" : "opacity-100"}
          ${className}
        `}
      />
    </div>
  );
}