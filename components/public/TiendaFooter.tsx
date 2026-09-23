"use client";

import { useMemo } from "react";
import type { ReactNode } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";

interface TiendaFooterProps {
  instagram?: string | null;
  facebook?: string | null;
  tiktok?: string | null;
  youtube?: string | null;
  nombreTienda?: string;
}

interface RedSocial {
  nombre: string;
  href: string;
  icono: ReactNode;
}

interface ConfiguracionRed {
  nombre: string;
  valor?: string | null;
  urlBase: string;
  icono: ReactNode;
}

/*
 * Acepta estos formatos:
 *
 * https://instagram.com/usuario
 * instagram.com/usuario
 * @usuario
 * usuario
 */
function normalizarUrlSocial(
  valor: string | null | undefined,
  urlBase: string,
): string | null {
  if (
    typeof valor !== "string" ||
    !valor.trim()
  ) {
    return null;
  }

  const valorLimpio = valor.trim();

  /*
   * Rechazamos protocolos diferentes a HTTP y HTTPS.
   */
  if (
    /^[a-z][a-z0-9+.-]*:/i.test(valorLimpio) &&
    !/^https?:\/\//i.test(valorLimpio)
  ) {
    return null;
  }

  let urlCandidata: string;

  if (/^https?:\/\//i.test(valorLimpio)) {
    urlCandidata = valorLimpio;
  } else if (
    valorLimpio.startsWith("www.") ||
    valorLimpio.includes(".com") ||
    valorLimpio.includes(".net") ||
    valorLimpio.includes(".co/")
  ) {
    urlCandidata = `https://${valorLimpio}`;
  } else {
    /*
     * Si solamente escribieron el usuario,
     * eliminamos @ y barras sobrantes.
     */
    const usuario = valorLimpio
      .replace(/^@/, "")
      .replace(/^\/+|\/+$/g, "");

    if (!usuario) {
      return null;
    }

    urlCandidata =
      `${urlBase}${encodeURIComponent(usuario)}`;
  }

  try {
    const url = new URL(urlCandidata);

    if (
      url.protocol !== "https:" &&
      url.protocol !== "http:"
    ) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

export default function TiendaFooter({
  instagram,
  facebook,
  tiktok,
  youtube,
  nombreTienda,
}: TiendaFooterProps) {
  const anioActual = new Date().getFullYear();

  const redes = useMemo<RedSocial[]>(() => {
    const configuraciones: ConfiguracionRed[] = [
      {
        nombre: "Instagram",
        valor: instagram,
        urlBase: "https://instagram.com/",
        icono: <FaInstagram size={19} />,
      },
      {
        nombre: "Facebook",
        valor: facebook,
        urlBase: "https://facebook.com/",
        icono: <FaFacebookF size={17} />,
      },
      {
        nombre: "TikTok",
        valor: tiktok,
        urlBase: "https://tiktok.com/@",
        icono: <FaTiktok size={17} />,
      },
      {
        nombre: "YouTube",
        valor: youtube,
        urlBase: "https://youtube.com/@",
        icono: <FaYoutube size={19} />,
      },
    ];

    return configuraciones.flatMap(
      ({
        nombre,
        valor,
        urlBase,
        icono,
      }) => {
        const href = normalizarUrlSocial(
          valor,
          urlBase,
        );

        if (!href) {
          return [];
        }

        return [
          {
            nombre,
            href,
            icono,
          },
        ];
      },
    );
  }, [
    instagram,
    facebook,
    tiktok,
    youtube,
  ]);

  return (
    <footer className="mt-0 bg-[var(--color-footer)] pb-12 pt-10 text-white">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-6">
        {/* REDES SOCIALES DE LA TIENDA */}
        {redes.length > 0 && (
          <div className="flex flex-col items-center">
            <p className="mb-5 text-sm font-semibold tracking-wide text-white">
              Síguenos
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              {redes.map((red) => (
                <a
                  key={red.nombre}
                  href={red.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visitar ${red.nombre} de ${
                    nombreTienda || "la tienda"
                  }`}
                  title={red.nombre}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white outline-none transition-all duration-200 hover:scale-110 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-footer)] active:scale-95"
                >
                  {red.icono}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* DERECHOS DE LA TIENDA */}
        <p className="mt-8 select-none text-center text-[11px] leading-relaxed text-white/50">
          © {anioActual}
          {nombreTienda
            ? ` ${nombreTienda}.`
            : ""}{" "}
          Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}