"use client";

import { useRouter } from "next/navigation";

interface Props {
  colorFondo: string;
  colorIcono: string;
}

export default function BackButton({ colorFondo, colorIcono }: Props) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="absolute top-6 left-6 z-20 w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md transition-all active:scale-90"
      style={{
        backgroundColor: colorFondo + "cc", // transparencia elegante
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2.5}
        stroke={colorIcono}
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 19.5L8.25 12l7.5-7.5"
        />
      </svg>
    </button>
  );
}