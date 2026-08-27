'use client';

import React, { useState } from 'react';

interface Props {
  slug: string;
}

export default function BotonCompartir({ slug }: Props) {
  const [copiado, setCopiado] = useState(false);

  const handleShare = async () => {
    // Genera la URL pública
    const urlPublica = `${window.location.origin}/rifas/${slug}`;

    // Si el navegador soporta compartir nativo (Móviles / Safari)
    if (navigator.share) {
      try {
        await navigator.share({
          title: '¡Participa en mi rifa!',
          text: 'Elige tu número y participa ahora:',
          url: urlPublica,
        });
        return;
      } catch (err) {
        // El usuario canceló la acción o falló la API nativa, cae al clipboard
      }
    }

    // Copiar al portapapeles si no se usa share nativo
    try {
      await navigator.clipboard.writeText(urlPublica);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch (err) {
      console.error('Error al copiar el enlace:', err);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-bold transition shadow-md shadow-indigo-600/20 cursor-pointer flex items-center gap-2"
    >
      <span>🔗</span>
      <span>{copiado ? '¡Enlace Copiado!' : 'Compartir Rifa'}</span>
    </button>
  );
}