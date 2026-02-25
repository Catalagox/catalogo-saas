"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import QRCode from "qrcode.react";

type Catalogo = {
  id: string;
  nombre: string;
};

export default function QRGenerator() {
  const [catalogos, setCatalogos] = useState<Catalogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    // Evita error de window en SSR
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
    }

    cargarCatalogos();
  }, []);

  const cargarCatalogos = async () => {
    const { data, error } = await supabase
      .from("catalogos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    if (data) {
      setCatalogos(data as Catalogo[]);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <p className="text-center mt-10">
        Cargando catálogos...
      </p>
    );
  }

  if (catalogos.length === 0) {
    return (
      <p className="text-center mt-10">
        No hay catálogos.
      </p>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {catalogos.map((cat) => (
        <div
          key={cat.id}
          className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center"
        >
          <h3 className="text-lg font-bold mb-4 text-center">
            {cat.nombre}
          </h3>

          <QRCode
            value={`${baseUrl}/menu/${cat.id}`}
            size={200}
          />
        </div>
      ))}
    </div>
  );
}