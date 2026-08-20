'use client';

import React from 'react';

interface NumeroGridProps {
  cantidadTotal: number;
  numerosOcupadosMap: Map<number, 'ocupado' | 'reservado' | 'disponible'>;
  numerosSeleccionados: number[];
  onToggleNumero: (num: number) => void;
  allowClickOnOcupados?: boolean; // Permite que el Admin haga clic en números ocupados/reservados
}

export default function NumeroGrid({
  cantidadTotal,
  numerosOcupadosMap,
  numerosSeleccionados,
  onToggleNumero,
  allowClickOnOcupados = false, // Por defecto deshabilitado para vista pública
}: NumeroGridProps) {
  const arrayNumeros = Array.from({ length: cantidadTotal }, (_, i) => i + 1);

  return (
    <div className="w-full">
      {/* Leyenda de Estados */}
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-6 text-xs sm:text-sm font-medium">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 inline-block"></span>
          <span className="text-gray-300">Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-purple-600 inline-block"></span>
          <span className="text-gray-300">Reservado (Pendiente)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-red-500 inline-block"></span>
          <span className="text-gray-300">Pagado</span>
        </div>
        <div className="flex items-center gap-2 border-l border-gray-700 pl-4">
          <span className="w-3.5 h-3.5 rounded-full bg-indigo-500 inline-block ring-2 ring-indigo-400"></span>
          <span className="text-indigo-400 font-bold">Tu Selección</span>
        </div>
      </div>

      {/* Grid de Botones */}
      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2.5 max-h-96 overflow-y-auto p-2 border border-gray-800 rounded-2xl bg-gray-900/60 backdrop-blur">
        {arrayNumeros.map((num) => {
          const estadoRemoto = numerosOcupadosMap.get(num) || 'disponible';
          const estaPagado = estadoRemoto === 'ocupado';
          const estaReservado = estadoRemoto === 'reservado';
          const estaSeleccionado = numerosSeleccionados.includes(num);

          let btnClass = 'bg-gray-800 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 cursor-pointer';
          let isDisabled = false;

          if (estaPagado) {
            // ROJO: Confirmado y pagado
            btnClass = allowClickOnOcupados
              ? 'bg-red-950/40 hover:bg-red-900/60 border border-red-900/50 text-red-400 cursor-pointer'
              : 'bg-red-950/40 border border-red-900/50 text-red-500/60 cursor-not-allowed line-through';
            isDisabled = !allowClickOnOcupados;
          } else if (estaReservado) {
            // MORADO: Elegido por usuario pero falta el pago
            btnClass = allowClickOnOcupados
              ? 'bg-purple-950/40 hover:bg-purple-900/60 border border-purple-800/60 text-purple-300 cursor-pointer'
              : 'bg-purple-950/40 border border-purple-800/60 text-purple-400 cursor-not-allowed';
            isDisabled = !allowClickOnOcupados;
          } else if (estaSeleccionado) {
            // AZUL/ÍNDIGO: Elección actual del usuario que está comprando
            btnClass = 'bg-indigo-600 text-white font-bold border border-indigo-400 scale-105 shadow-lg shadow-indigo-500/30';
          }

          // Formateo visual (ej: 001, 010, 100)
          const numFormateado = String(num).padStart(3, '0');

          return (
            <button
              key={num}
              type="button"
              disabled={isDisabled}
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