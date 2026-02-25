"use client";

import React, { ReactNode } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
}

export default function Modal({ isOpen, onClose, title, children, size = "md" }: ModalProps) {
  if (!isOpen) return null;

  // Tamaños predefinidos
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={clsx(
          "bg-white rounded-2xl shadow-lg p-6 relative w-full mx-4",
          sizeClasses[size]
        )}
        onClick={(e) => e.stopPropagation()} // Evita cerrar al hacer click dentro
      >
        {/* Header */}
        {title && (
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-800 transition"
            >
              ✕
            </button>
          </div>
        )}

        {/* Contenido */}
        <div>{children}</div>
      </div>
    </div>,
    document.body
  );
}