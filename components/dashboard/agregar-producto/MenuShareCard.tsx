"use client";

import QRCode from "react-qr-code";

export default function MenuShareCard({ slug }: { slug: string }) {

  const menuUrl = `http://localhost:3000/menu/${slug}`;

  const copiar = () => {
    navigator.clipboard.writeText(menuUrl);
    alert("Link copiado");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-md">

      <h2 className="text-xl font-bold mb-4">
        Compartir menú
      </h2>

      <div className="flex justify-center mb-4">
        <QRCode value={menuUrl} size={200} />
      </div>

      <p className="text-sm mb-4 break-all">
        {menuUrl}
      </p>

      <div className="flex flex-col gap-3">

        <a
          href={`/menu/${slug}`}
          target="_blank"
          className="bg-green-600 text-white py-2 rounded-lg text-center"
        >
          Ver menú
        </a>

        <button
          onClick={copiar}
          className="border py-2 rounded-lg"
        >
          Copiar link
        </button>

      </div>

    </div>
  );
}