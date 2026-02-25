"use client";

import Image from "next/image";
import Link from "next/link";

interface MenuPreviewProps {
  title: string;
  imageSrc?: string;
  itemCount?: number;
  href: string;
}

export default function MenuPreview({
  title,
  imageSrc,
  itemCount = 0,
  href,
}: MenuPreviewProps) {
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
          {itemCount > 0 && (
            <p className="text-gray-500 text-sm mt-1">{itemCount} items</p>
          )}
        </div>
        <div className="mt-4">
          <button className="w-full py-2 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition">
            Ver menú
          </button>
        </div>
      </div>
    </Link>
  );
}