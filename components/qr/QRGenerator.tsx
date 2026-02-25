"use client";

import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { supabase } from "@/lib/supabaseClient";

type Catalogo = {
  id: string;
  nombre: string;
};

export default function QRGenerator() {
  const [catalogos, setCatalogos] = useState<Catalogo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarCatalogos();
  }, []);

  const cargarCatalogos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("catalogos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    if (data) setCatalogos(data);
    setLoading(false);
  };

  if (loading) return <p className="text-center text-gray-500 mt-10">Cargando catálogos...</p>;

  if (catalogos.length === 0)
    return <p className="text-center text-gray-500 mt-10">No hay catálogos para generar QR.</p>;

  const handleDownload = (id: string, nombre: string) => {
    const canvas = document.getElementById(`qr-${id}`) as HTMLCanvasElement;
    if (!canvas) return;
    const pngUrl = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `QR_${nombre}.png`;
    downloadLink.click();
  };

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {catalogos.map((cat) => (
        <div
          key={cat.id}
          className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center transition hover:shadow-xl hover:-translate-y-1"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center truncate">{cat.nombre}</h3>

          {/* QR CODE */}
          <QRCodeCanvas
            id={`qr-${cat.id}`}
            value={`${window.location.origin}/menu/${cat.id}`}
            size={200}
            className="mb-4"
          />

          {/* BUTTON */}
          <button
            onClick={() => handleDownload(cat.id, cat.nombre)}
            className="px-5 py-2 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition"
          >
            Descargar QR
          </button>
        </div>
      ))}
    </div>
  );
}