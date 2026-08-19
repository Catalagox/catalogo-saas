'use client';

import React from 'react';
import { RifaParticipanteConNumeros } from '@/lib/rifas/types';

interface Props {
  participante: RifaParticipanteConNumeros | null;
  onClose: () => void;
}

export default function AdminParticipanteModal({ participante, onClose }: Props) {
  if (!participante) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="font-bold text-slate-100 text-lg">Detalle del Participante</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white font-bold p-1"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 text-sm">
          <div>
            <p className="text-xs text-slate-500 uppercase font-semibold">Nombre</p>
            <p className="text-slate-100 font-medium text-base">{participante.nombre}</p>
          </div>

          <div>
            <p className="text-xs text-slate-500 uppercase font-semibold">País</p>
            <p className="text-slate-200">{participante.pais}</p>
          </div>

          <div>
            <p className="text-xs text-slate-500 uppercase font-semibold">Teléfono</p>
            <p className="text-indigo-400 font-mono text-base font-semibold">{participante.telefono}</p>
          </div>

          <div>
            <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Números Asignados ({participante.numeros.length})</p>
            <div className="flex flex-wrap gap-1.5">
              {participante.numeros.map((num) => (
                <span
                  key={num}
                  className="bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-mono text-xs px-2.5 py-1 rounded-lg font-bold"
                >
                  #{String(num).padStart(3, '0')}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-slate-500 uppercase font-semibold">Fecha de Registro</p>
            <p className="text-slate-400 text-xs">
              {new Date(participante.created_at).toLocaleString('es-ES')}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 rounded-xl text-sm font-semibold transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}