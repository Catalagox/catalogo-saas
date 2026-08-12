"use client";

import { useMemo } from "react";
import { FaInstagram, FaFacebookF, FaTiktok, FaYoutube } from "react-icons/fa";

interface MenuFooterProps {
  instagram?: string | null;
  facebook?: string | null;
  tiktok?: string | null;
  youtube?: string | null;
  nombreEmpresa?: string;
}

// Helper para validar y normalizar URLs
const formatUrl = (url?: string | null): string | null => {
  if (!url || typeof url !== "string") return null;
  const cleanUrl = url.trim();
  if (!cleanUrl) return null;

  if (cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://")) {
    return cleanUrl;
  }

  return `https://${cleanUrl}`;
};

export default function MenuFooter({
  instagram,
  facebook,
  tiktok,
  youtube,
  nombreEmpresa,
}: MenuFooterProps) {
  const currentYear = new Date().getFullYear();

  // Redes procesadas y memoizadas
  const redes = useMemo(() => {
    const lista = [
      {
        nombre: "Instagram",
        href: formatUrl(instagram),
        icon: <FaInstagram size={18} />,
      },
      {
        nombre: "Facebook",
        href: formatUrl(facebook),
        icon: <FaFacebookF size={16} />,
      },
      {
        nombre: "TikTok",
        href: formatUrl(tiktok),
        icon: <FaTiktok size={16} />,
      },
      {
        nombre: "YouTube",
        href: formatUrl(youtube),
        icon: <FaYoutube size={18} />,
      },
    ];

    return lista.filter((red): red is { nombre: string; href: string; icon: JSX.Element } => Boolean(red.href));
  }, [instagram, facebook, tiktok, youtube]);

  return (
    <footer className="mt-0 pt-10 pb-12 bg-black text-white">
      <div className="max-w-3xl mx-auto px-6 flex flex-col items-center">
        {/* TÍTULO Y REDES SOCIALES */}
        {redes.length > 0 && (
          <>
            <p className="text-sm font-semibold tracking-wide text-white mb-5">
              Sígueme
            </p>

            <div className="flex items-center gap-4">
              {redes.map((red) => (
                <a
                  key={red.nombre}
                  href={red.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Síguenos en ${red.nombre}`}
                  className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-white bg-white/5 hover:bg-white/10 hover:scale-110 active:scale-95 transition-all duration-200"
                >
                  {red.icon}
                </a>
              ))}
            </div>
          </>
        )}

        {/* COPYRIGHT */}
        <p className="text-[11px] mt-8 text-white/50 text-center select-none">
          © {currentYear} {nombreEmpresa ? `${nombreEmpresa}. ` : ""}Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}