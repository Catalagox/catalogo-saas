"use client";

import Image from "next/image";

type Props = {
  src?: string;
  alt: string;
};

export default function ProductImage({ src, alt }: Props) {
  return (
    <div className="overflow-hidden">
      <Image
        src={src || "/placeholder.png"}
        alt={alt}
        width={500}
        height={300}
        className="w-full h-48 sm:h-56 object-cover transition-transform duration-300 hover:scale-105"
      />
    </div>
  );
}