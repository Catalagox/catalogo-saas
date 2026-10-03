"use client";

import { useRef, useState } from "react";
import QRCode from "react-qr-code";
import { Check, Copy, Download, ExternalLink } from "lucide-react";

type QRCodeCardProps = {
  slug: string;
};

const botonSecundario =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[var(--border-card)] bg-[var(--bg-secondary)] px-4 py-2.5 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-card-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50";

export default function QRCodeCard({ slug }: QRCodeCardProps) {
  const [copiado, setCopiado] = useState(false);
  const [copiando, setCopiando] = useState(false);
  const [descargando, setDescargando] = useState(false);
  const [error, setError] = useState("");

  const qrContainerRef = useRef<HTMLDivElement>(null);

  const slugLimpio = slug.trim();
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.catalagox.com"
  ).replace(/\/+$/, "");

  const link = `${baseUrl}/${encodeURIComponent(slugLimpio)}`;

  const copiarLink = async () => {
    if (copiando) return;

    setCopiando(true);
    setCopiado(false);
    setError("");

    try {
      await navigator.clipboard.writeText(link);
      setCopiado(true);
    } catch {
      setError(
        "No pudimos copiar el enlace. Puedes seleccionarlo y copiarlo manualmente.",
      );
    } finally {
      setCopiando(false);
    }
  };

  const descargarQR = async () => {
    if (descargando) return;

    setDescargando(true);
    setError("");

    let svgUrl: string | null = null;

    try {
      const svg = qrContainerRef.current?.querySelector("svg");

      if (!svg) {
        throw new Error("No encontramos el código QR.");
      }

      const copia = svg.cloneNode(true) as SVGSVGElement;
      copia.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      copia.setAttribute("width", "1024");
      copia.setAttribute("height", "1024");
      copia.removeAttribute("style");

      const contenido = new XMLSerializer().serializeToString(copia);
      const archivoSVG = new Blob([contenido], {
        type: "image/svg+xml;charset=utf-8",
      });

      svgUrl = URL.createObjectURL(archivoSVG);

      const imagen = new Image();

      await new Promise<void>((resolve, reject) => {
        imagen.onload = () => resolve();
        imagen.onerror = () =>
          reject(new Error("No pudimos preparar el código QR."));
        imagen.src = svgUrl!;
      });

      const canvas = document.createElement("canvas");
      const margen = 128;
      const tamanoQR = 1024;

      canvas.width = tamanoQR + margen * 2;
      canvas.height = tamanoQR + margen * 2;

      const contexto = canvas.getContext("2d");

      if (!contexto) {
        throw new Error("No pudimos generar la imagen.");
      }

      contexto.fillStyle = "#ffffff";
      contexto.fillRect(0, 0, canvas.width, canvas.height);
      contexto.drawImage(imagen, margen, margen, tamanoQR, tamanoQR);

      const enlace = document.createElement("a");
      enlace.href = canvas.toDataURL("image/png");
      enlace.download = "QR_Tienda.png";

      document.body.appendChild(enlace);
      enlace.click();
      enlace.remove();
    } catch (err) {
      console.error("Error descargando QR:", err);
      setError("No pudimos descargar el QR. Inténtalo nuevamente.");
    } finally {
      if (svgUrl) URL.revokeObjectURL(svgUrl);
      setDescargando(false);
    }
  };

  if (!slugLimpio) {
    return (
      <div className="mb-8 w-full max-w-md rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6">
        <p className="text-sm text-[var(--text-secondary)]">
          Configura el enlace de tu tienda para generar su código QR.
        </p>
      </div>
    );
  }

  return (
    <section
      aria-label="Código QR y enlace público de tu tienda"
      className="mb-8 w-full max-w-md rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-5 text-[var(--text-primary)] shadow-sm sm:p-6"
    >
      <h2 className="text-xl font-bold">
        Tu QR y enlace público
      </h2>

      <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
        Comparte tu tienda con un enlace o descarga el QR para imprimirlo.
      </p>

      <div className="my-6 flex justify-center">
        <div
          ref={qrContainerRef}
          className="w-full max-w-[232px] rounded-xl bg-white p-4"
        >
          <QRCode
            value={link}
            size={200}
            bgColor="#ffffff"
            fgColor="#000000"
            title="Código QR de tu tienda"
            style={{
              display: "block",
              width: "100%",
              height: "auto",
            }}
          />
        </div>
      </div>

      <p className="mb-5 break-all rounded-xl border border-[var(--border-card)] bg-[var(--bg-secondary)] p-3 text-center text-sm">
        {link}
      </p>

      <div className="flex flex-col gap-3">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Ver tienda, se abre en una pestaña nueva"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-bold text-[var(--color-text-inverse)] transition-colors hover:bg-[var(--color-primary-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
        >
          <ExternalLink size={18} aria-hidden="true" />
          Ver tienda
        </a>

        <button
          type="button"
          onClick={() => void copiarLink()}
          disabled={copiando}
          className={botonSecundario}
        >
          {copiado ? (
            <Check size={18} aria-hidden="true" />
          ) : (
            <Copy size={18} aria-hidden="true" />
          )}

          {copiando
            ? "Copiando..."
            : copiado
              ? "Enlace copiado"
              : "Copiar enlace"}
        </button>

        <button
          type="button"
          onClick={() => void descargarQR()}
          disabled={descargando}
          className={botonSecundario}
        >
          <Download size={18} aria-hidden="true" />
          {descargando ? "Preparando..." : "Descargar QR"}
        </button>
      </div>

      <p role="status" className="sr-only">
        {copiado ? "Enlace copiado correctamente." : ""}
      </p>

      {error && (
        <p
          role="alert"
          className="mt-3 text-sm leading-relaxed text-[var(--color-danger)]"
        >
          {error}
        </p>
      )}
    </section>
  );
}