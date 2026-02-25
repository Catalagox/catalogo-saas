"use client";

import Image from "next/image";
import Link from "next/link";

interface CategoryCardProps {
  title: string;
  description?: string;
  imageSrc?: string;
  href: string;
}

export default function CategoryCard({
  title,
  description,
  imageSrc,
  href,
}: CategoryCardProps) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col items-center bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-4"
    >
      {imageSrc && (
        <div className="w-full h-40 relative mb-4 rounded-xl overflow-hidden">
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      {description && (
        <p className="text-gray-500 text-sm text-center mt-2">{description}</p>
      )}
    </Link>
  );
}