"use client";

import { useRouter, useParams } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  const params = useParams();

  const handleBack = () => {
    // Si el usuario navegó desde otra página interna del sitio, va hacia atrás
    if (window.history.length > 1 && document.referrer.includes(window.location.host)) {
      router.back();
    } else {
      // Si entró por enlace externo (WhatsApp), redirige a la raíz del catálogo
      const slug = params?.slug;
      if (slug) {
        router.push(`/${slug}`);
      } else {
        router.push("/");
      }
    }
  };

  return (
    <button
      onClick={handleBack}
      className="absolute top-6 left-6 z-20 w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md transition-all active:scale-90 bg-[var(--color-bg)]/80"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2.5}
        stroke="var(--color-text)"
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