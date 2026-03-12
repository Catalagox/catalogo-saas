"use client";

import { useState, useRef } from "react";
import QRCode from "react-qr-code";

type QRCodeCardProps = {
  slug: string;
};

export default function QRCodeCard({ slug }: QRCodeCardProps) {
  const [copiado, setCopiado] = useState(false);
  const qrContainerRef = useRef<HTMLDivElement | null>(null);

  const link = `${process.env.NEXT_PUBLIC_SITE_URL}/menu/${slug}`;

  const copiarLink = () => {
    navigator.clipboard.writeText(link);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const descargarQR = () => {
    if (!qrContainerRef.current) return;

    // Buscamos el SVG dentro del contenedor
    const svg = qrContainerRef.current.querySelector("svg");
    if (!svg) return;

    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);

    const img = new Image();
    img.src = "data:image/svg+xml;base64," + btoa(svgStr);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = pngFile;
      a.download = "QR_Menu.png";
      a.click();
    };
  };

  return (
    <div className="bg-gray-900 p-6 rounded-xl mb-8 max-w-md">
      <h2 className="text-xl font-semibold mb-4">Tu QR / Link Público</h2>

      <div className="flex flex-col md:flex-row gap-6 items-center">
        {/* Contenedor para el QR */}
        <div ref={qrContainerRef} className="bg-white p-4 rounded-lg">
          <QRCode value={link} size={180} />
        </div>

        <div className="flex-1">
          <p className="mb-4 break-all text-gray-200">{link}</p>
          <div className="flex flex-wrap gap-4">
            <a
              href={link}
              target="_blank"
              className="bg-white text-black px-5 py-2 rounded-lg font-semibold"
            >
              Ver Menú
            </a>

            <button
              onClick={copiarLink}
              className="border px-5 py-2 rounded-lg"
            >
              {copiado ? "Copiado ✔" : "Copiar Link"}
            </button>

            <button
              onClick={descargarQR}
              className="border px-5 py-2 rounded-lg"
            >
              Descargar QR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}