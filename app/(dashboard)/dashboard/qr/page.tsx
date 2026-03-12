"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import QRCode from "react-qr-code";
import { toPng } from "html-to-image";

export default function QRPage() {
  const [slug, setSlug] = useState<string | null>(null);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    cargarQR();
  }, []);

  const cargarQR = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("catalogos")
      .select("slug")
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setSlug(data.slug);
  };

  if (!slug) {
    return (
      <div className="flex justify-center py-20">
        Cargando QR...
      </div>
    );
  }

  // 🔑 URL correcta del menú
  const urlMenu = `https://catalagox.com//${slug}`;

  const copiarLink = async () => {
    await navigator.clipboard.writeText(urlMenu);
    alert("Link copiado");
  };

  const descargarQR = async () => {
    if (!qrRef.current) return;

    const dataUrl = await toPng(qrRef.current);

    const link = document.createElement("a");
    link.download = "qr-menu.png";
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="max-w-2xl mx-auto">

      <h1 className="text-3xl font-bold mb-8">
        QR de tu menú
      </h1>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">

        {/* QR */}
        <div className="bg-white p-5 rounded-xl w-fit mx-auto mb-6">
          <div ref={qrRef}>
            <QRCode value={urlMenu} size={220} />
          </div>
        </div>

        {/* LINK */}
        <p className="text-sm text-gray-400 mb-2">
          Link de tu menú
        </p>

        <p className="text-xs break-all bg-gray-800 p-3 rounded-lg mb-6">
          {urlMenu}
        </p>

        {/* BOTONES */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">

          <button
            onClick={copiarLink}
            className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg font-semibold"
          >
            Copiar link
          </button>

          <button
            onClick={descargarQR}
            className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg"
          >
            Descargar QR
          </button>

          <a
            href={urlMenu}
            target="_blank"
            className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg"
          >
            Ver menú
          </a>

        </div>

      </div>

    </div>
  );
}