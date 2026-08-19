'use client';

import React from 'react';

interface NumeroGridProps {
  cantidadTotal: number;
  numerosOcupadosMap: Map<number, 'ocupado' | 'reservado' | 'disponible'>;
  numerosSeleccionados: number[];
  onToggleNumero: (num: number) => void;
}

export default function NumeroGrid({
  cantidadTotal,
  numerosOcupadosMap,
  numerosSeleccionados,
  onToggleNumero,
}: NumeroGridProps) {
  const arrayNumeros = Array.from({ length: cantidadTotal }, (_, i) => i + 1);

  return (
    <div className="w-full">
      {/* Leyenda de Estados */}
      <div className="flex items-center justify-center gap-6 mb-6 text-sm font-medium">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 inline-block"></span>
          <span className="text-gray-300">Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-indigo-600 inline-block"></span>
          <span className="text-gray-300">Seleccionado</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-red-500/80 inline-block"></span>
          <span className="text-gray-400">Ocupado</span>
        </div>
      </div>

      {/* Grid de Botones */}
      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2.5 max-h-96 overflow-y-auto p-2 border border-gray-800 rounded-2xl bg-gray-900/60 backdrop-blur">
        {arrayNumeros.map((num) => {
          const estadoRemoto = numerosOcupadosMap.get(num);
          const estaOcupado = estadoRemoto === 'ocupado' || estadoRemoto === 'reservado';
          const estaSeleccionado = numerosSeleccionados.includes(num);

          let btnClass = 'bg-gray-800 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30';

          if (estaOcupado) {
            btnClass = 'bg-red-950/40 border border-red-900/50 text-red-500/50 cursor-not-allowed line-through';
          } else if (estaSeleccionado) {
            btnClass = 'bg-indigo-600 text-white font-bold border border-indigo-400 scale-105 shadow-lg shadow-indigo-500/30';
          }

          // Formateo visual (ej: 001, 010, 100)
          const numFormateado = String(num).padStart(3, '0');

          return (
            <button
              key={num}
              type="button"
              disabled={estaOcupado}
              onClick={() => onToggleNumero(num)}
              className={`h-11 rounded-xl text-xs sm:text-sm font-mono flex items-center justify-center transition-all active:scale-95 ${btnClass}`}
            >
              #{numFormateado}
            </button>
          );
        })}
      </div>
    </div>
  );
}