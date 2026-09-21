"use client";

import { useState } from "react";

interface GoogleButtonProps {
  onClick?: () => Promise<void> | void;
  disabled?: boolean;
}

export default function GoogleButton({
  onClick,
  disabled = false,
}: GoogleButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!onClick || loading || disabled) return;

    try {
      setLoading(true);
      await onClick();
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = loading || disabled;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      className="
        group
        relative
        flex
        w-full
        items-center
        justify-center
        gap-3
        rounded-xl
        border
        border-gray-300
        bg-white
        py-3
        font-medium
        shadow-sm
        transition-all
        duration-200
        ease-in-out
        hover:-translate-y-[1px]
        hover:shadow-md
        active:translate-y-0
        disabled:cursor-not-allowed
        disabled:opacity-70
        disabled:hover:translate-y-0
        disabled:hover:shadow-sm
      "
    >
      <div className="relative flex h-5 w-5 items-center justify-center">
        <svg
          aria-hidden="true"
          className={`absolute transition-all duration-200 ${
            loading
              ? "scale-75 opacity-0"
              : "scale-100 opacity-100"
          }`}
          viewBox="0 0 48 48"
          width="20"
          height="20"
        >
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.69 1.22 9.19 3.6l6.85-6.85C35.91 2.24 30.28 0 24 0 14.62 0 6.51 5.39 2.56 13.27l7.98 6.19C12.46 13.13 17.77 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.1 24.5c0-1.63-.15-3.2-.43-4.7H24v9h12.42c-.54 2.91-2.19 5.37-4.66 7.03l7.18 5.59C43.98 36.98 46.1 31.18 46.1 24.5z"
          />
          <path
            fill="#FBBC05"
            d="M10.54 28.46a14.47 14.47 0 010-8.92l-7.98-6.19A23.95 23.95 0 000 24c0 3.77.9 7.33 2.56 10.65l7.98-6.19z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.92-2.13 15.89-5.78l-7.18-5.59c-2 1.35-4.56 2.14-8.71 2.14-6.23 0-11.54-3.63-13.46-8.96l-7.98 6.19C6.51 42.61 14.62 48 24 48z"
          />
        </svg>

        <div
          aria-hidden="true"
          className={`absolute h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-black transition-all duration-200 ${
            loading
              ? "scale-100 opacity-100"
              : "scale-75 opacity-0"
          }`}
        />
      </div>

      <span className="text-gray-800">
        {loading ? "Conectando..." : "Continuar con Google"}
      </span>
    </button>
  );
}
