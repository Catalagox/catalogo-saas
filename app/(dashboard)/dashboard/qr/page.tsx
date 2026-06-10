"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import QRCode from "react-qr-code";
import { toPng } from "html-to-image";
import {
  Share2,
  Download,
  ExternalLink,
  Copy,
  Check,
  X,
} from "lucide-react";

export default function QRPage() {
  const [slug, setSlug] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

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
      console.error("ERROR CARGANDO QR:", error);
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

  // ✅ URL LIMPIA DEL CATÁLOGO
  const urlMenu = `https://catalagox.com/${slug}`;

  const textoCompartir =
    "¡Hola! Te invito a ver nuestro catálogo digital actualizado aquí:";

  // 🛠️ FUNCIÓN DE COMPARTIR OPTIMIZADA PARA WHATSAPP NATIVO
  const handleShare = async () => {
    if (navigator.share) {
      try {
        // 🔥 FIX: Al juntar el texto y la URL en el mismo campo 'text' y dejar la URL AL FINAL,
        // obligamos al sistema y a WhatsApp a procesar el link correctamente para generar la previsualización de la imagen.
        await navigator.share({
          title: "Mi Catálogo Digital",
          text: `${textoCompartir}\n\n${urlMenu}`, 
          // Dejamos 'url' vacío o repetido según el sistema, pero ponerlo en el text asegura el render en WhatsApp móvil
        });
      } catch (error) {
        console.error("Error al compartir de forma nativa", error);
      }
    } else {
      setShowShareModal(true);
    }
  };

  const copiarLink = async () => {
    try {
      await navigator.clipboard.writeText(urlMenu);

      setCopiado(true);

      setTimeout(() => {
        setCopiado(false);
      }, 2000);
    } catch (error) {
      console.error(error);
      alert("No se pudo copiar el enlace");
    }
  };

  const descargarQR = async () => {
    if (!qrRef.current) return;

    try {
      const dataUrl = await toPng(qrRef.current, {
        cacheBust: true,
        pixelRatio: 3,
      });

      const link = document.createElement("a");

      link.download = `qr-${slug}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("ERROR DESCARGANDO QR:", error);
      alert("Error al descargar QR");
    }
  };

  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(
      `${textoCompartir}\n\n${urlMenu}`
    )}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      urlMenu
    )}`,
  };

  return (
    <div className="max-w-2xl mx-auto px-4 relative">
      <h1 className="text-3xl font-bold mb-8 text-[var(--text-primary)]">
        QR de tu menú
      </h1>

      <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-6 sm:p-8 text-center shadow-sm">
        {/* QR */}
        <div className="bg-white p-5 rounded-2xl w-fit mx-auto mb-6 shadow-lg">
          <div ref={qrRef}>
            <QRCode
              value={urlMenu}
              size={220}
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>
        </div>

        {/* LINK */}
        <p className="text-sm text-[var(--text-secondary)] mb-2">
          Link de tu catálogo
        </p>

        <p className="text-xs break-all bg-[var(--bg-tertiary)] border border-[var(--border-card)] text-[var(--text-secondary)] p-3 rounded-lg mb-6 max-w-md mx-auto">
          {urlMenu}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto w-full">
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-text-inverse)] px-4 py-3 rounded-xl font-semibold transition shadow-sm w-full"
          >
            <Share2 size={18} />
            <span>Compartir</span>
          </button>

          <button
            onClick={descargarQR}
            className="flex items-center justify-center gap-2 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-card-hover)] text-[var(--text-primary)] border border-[var(--border-card)] px-4 py-3 rounded-xl font-medium transition w-full"
          >
            <Download size={18} />
            <span>Descargar</span>
          </button>

          <a
            href={urlMenu}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-card-hover)] text-[var(--text-primary)] border border-[var(--border-card)] px-4 py-3 rounded-xl font-medium transition w-full"
          >
            <ExternalLink size={18} />
            <span>Ver catálogo</span>
          </a>
        </div>
      </div>

      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--bg-card)] border border-[var(--border-card)] p-6 rounded-2xl max-w-sm w-full shadow-2xl relative text-center">
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1 bg-[var(--bg-tertiary)] rounded-full transition"
            >
              <X size={16} />
            </button>

            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-5">
              Compartir catálogo
            </h3>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <a
                href={shareLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 p-3 rounded-xl border border-[var(--border-card)] hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition"
              >
                <span className="text-2xl">🟢</span>
                <span className="text-xs font-semibold">WhatsApp</span>
              </a>

              <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 p-3 rounded-xl border border-[var(--border-card)] hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition"
              >
                <span className="text-2xl">🔵</span>
                <span className="text-xs font-semibold">Facebook</span>
              </a>
            </div>

            <p className="text-xs text-[var(--text-secondary)] mb-4 text-left bg-[var(--bg-tertiary)] p-3 rounded-xl">
              💡 Para <b>Instagram</b> y <b>TikTok</b>, copia el enlace y
              pégalo directamente en tu biografía.
            </p>

            <button
              onClick={copiarLink}
              className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-semibold transition ${
                copiado
                  ? "bg-emerald-600 text-white"
                  : "bg-[var(--bg-tertiary)] hover:bg-[var(--bg-card-hover)] text-[var(--text-primary)] border border-[var(--border-card)]"
              }`}
            >
              {copiado ? <Check size={16} /> : <Copy size={16} />}
              {copiado ? "¡Copiado con éxito!" : "Copiar enlace"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}