"use client";

import { Share2, Check } from "lucide-react";
import { useState } from "react";

export default function BotonCompartir({ titulo }: { titulo: string }) {
  const [copiado, setCopiado] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: titulo,
          url: window.location.href,
        });
      } catch {
        // El usuario canceló la acción de compartir
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center"
      title="Compartir producto"
      aria-label="Compartir producto"
    >
      {copiado ? <Check size={18} className="text-emerald-400" /> : <Share2 size={18} />}
    </button>
  );
}