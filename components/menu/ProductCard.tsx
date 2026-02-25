"use client";

import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  title: string;
  description?: string;
  imageSrc?: string;
  price?: number;
  href: string;
}

export default function ProductCard({
  title,
  description,
  imageSrc,
  price,
  href,
}: ProductCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
    >
      {imageSrc && (
        <div className="relative h-48 w-full">
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          {description && (
            <p className="text-gray-500 text-sm mt-1 line-clamp-2">{description}</p>
          )}
        </div>
        {price !== undefined && (
          <p className="text-black font-semibold mt-2">${price.toFixed(2)}</p>
        )}
        <div className="mt-4">
          <button className="w-full py-2 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition">
            Ver producto
          </button>
        </div>
      </div>
    </Link>
  );
}