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
      <div className="flex justify-center py-20 text-[var(--text-secondary)]">
        Cargando QR...
      </div>
    );
  }

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
      <h1 className="text-3xl font-bold mb-8 text-[var(--text-primary)]">
        QR de tu menú
      </h1>

      <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-8 text-center">
        {/* QR */}
        <div className="bg-white p-5 rounded-xl w-fit mx-auto mb-6">
          <div ref={qrRef}>
            <QRCode value={urlMenu} size={220} />
          </div>
        </div>

        {/* LINK */}
        <p className="text-sm text-[var(--text-secondary)] mb-2">
          Link de tu menú
        </p>

        <p className="text-xs break-all bg-[var(--bg-tertiary)] border border-[var(--border-card)] text-[var(--text-secondary)] p-3 rounded-lg mb-6">
          {urlMenu}
        </p>

        {/* BOTONES */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={copiarLink}
            className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-text-inverse)] px-4 py-2 rounded-lg font-semibold transition"
          >
            Copiar link
          </button>

          <button
            onClick={descargarQR}
            className="bg-[var(--bg-tertiary)] hover:bg-[var(--bg-card-hover)] text-[var(--text-primary)] px-4 py-2 rounded-lg transition"
          >
            Descargar QR
          </button>

          <a
            href={urlMenu}
            target="_blank"
            className="bg-[var(--bg-tertiary)] hover:bg-[var(--bg-card-hover)] text-[var(--text-primary)] px-4 py-2 rounded-lg transition"
          >
            Ver menú
          </a>
        </div>
      </div>
    </div>
  );
}
