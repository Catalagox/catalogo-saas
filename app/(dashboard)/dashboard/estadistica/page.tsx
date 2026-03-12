"use client";

import {
  BarChart3,
  TrendingUp,
  QrCode,
  Tags,
} from "lucide-react";

export default function EstadisticasPage() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold">
            Estadísticas
          </h1>

          <p className="text-gray-400 mt-2">
            Analiza cómo los clientes interactúan con tu menú digital.
          </p>
        </div>

        {/* CARDS */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {/* VISTAS MENU */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">

            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="text-orange-500" />
              <span className="text-xs text-gray-400">
                Total
              </span>
            </div>

            <h2 className="text-3xl font-bold">
              0
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              Vistas del menú
            </p>

          </div>

          {/* PRODUCTOS VISTOS */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">

            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="text-green-500" />
              <span className="text-xs text-gray-400">
                Popular
              </span>
            </div>

            <h2 className="text-3xl font-bold">
              0
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              Productos vistos
            </p>

          </div>

          {/* QR ESCANEADO */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">

            <div className="flex items-center justify-between mb-4">
              <QrCode className="text-blue-500" />
              <span className="text-xs text-gray-400">
                QR
              </span>
            </div>

            <h2 className="text-3xl font-bold">
              0
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              Escaneos del QR
            </p>

          </div>

          {/* CATEGORIAS */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">

            <div className="flex items-center justify-between mb-4">
              <Tags className="text-purple-500" />
              <span className="text-xs text-gray-400">
                Menú
              </span>
            </div>

            <h2 className="text-3xl font-bold">
              0
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              Categorías visitadas
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}