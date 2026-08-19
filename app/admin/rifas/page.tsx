'use client';

import React, { useEffect, useState } from 'react';
import { Rifa, RifaNumero, RifaParticipanteConNumeros } from '@/lib/rifas/types';
import { getRifaActiva, getNumerosOcupados, getParticipantesAdmin } from '@/lib/rifas/supabase';
import AdminParticipanteModal from '@/components/rifas/AdminParticipanteModal';

export default function AdminRifasPage() {
  const [rifa, setRifa] = useState<Rifa | null>(null);
  const [numerosMap, setNumerosMap] = useState<Map<number, RifaNumero>>(new Map());
  const [participantes, setParticipantes] = useState<RifaParticipanteConNumeros[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedParticipante, setSelectedParticipante] = useState<RifaParticipanteConNumeros | null>(null);

  const cargarDatos = async () => {
    setLoading(true);
    const dataRifa = await getRifaActiva();

    if (dataRifa) {
      setRifa(dataRifa);
      const [listaNumeros, listaParticipantes] = await Promise.all([
        getNumerosOcupados(dataRifa.id),
        getParticipantesAdmin(dataRifa.id),
      ]);

      const map = new Map<number, RifaNumero>();
      listaNumeros.forEach((n) => map.set(n.numero, n));
      setNumerosMap(map);
      setParticipantes(listaParticipantes);
    }

    setLoading(false);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!rifa) {
    return (
      <div className="max-w-4xl mx-auto my-12 p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl">
        <p className="text-slate-400">No hay ninguna rifa registrada en la base de datos.</p>
      </div>
    );
  }

  const cantidadOcupados = numerosMap.size;
  const cantidadDisponibles = rifa.cantidad_numeros - cantidadOcupados;
  const arrayNumeros = Array.from({ length: rifa.cantidad_numeros }, (_, i) => i + 1);

  const handleNumeroClick = (num: number) => {
    const regNumero = numerosMap.get(num);
    if (regNumero && regNumero.participante_id) {
      const part = participantes.find((p) => p.id === regNumero.participante_id);
      if (part) setSelectedParticipante(part);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Resumen de la Rifa */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-xs uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            {rifa.estado}
          </span>
          <h1 className="text-2xl font-bold text-white mt-2">{rifa.titulo}</h1>
          <p className="text-sm text-slate-400">Premio: {rifa.premio}</p>
        </div>

        <div className="flex gap-4 sm:gap-6 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
          <div>
            <p className="text-xs text-slate-500 uppercase font-medium">Total</p>
            <p className="text-lg font-bold text-slate-200">{rifa.cantidad_numeros}</p>
          </div>
          <div className="border-l border-slate-800 pl-4 sm:pl-6">
            <p className="text-xs text-slate-500 uppercase font-medium">Disponibles</p>
            <p className="text-lg font-bold text-emerald-400">{cantidadDisponibles}</p>
          </div>
          <div className="border-l border-slate-800 pl-4 sm:pl-6">
            <p className="text-xs text-slate-500 uppercase font-medium">Ocupados</p>
            <p className="text-lg font-bold text-red-400">{cantidadOcupados}</p>
          </div>
        </div>
      </div>

      {/* Visor de Números */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">Mapa de Números</h2>
          <span className="text-xs text-slate-400">Haz clic en un número ocupado para ver quién lo tiene</span>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 max-h-80 overflow-y-auto p-2 bg-slate-950 rounded-2xl border border-slate-800">
          {arrayNumeros.map((num) => {
            const regNumero = numerosMap.get(num);
            const estaOcupado = Boolean(regNumero);

            return (
              <button
                key={num}
                type="button"
                onClick={() => handleNumeroClick(num)}
                className={`h-10 rounded-xl text-xs font-mono font-bold flex items-center justify-center transition ${
                  estaOcupado
                    ? 'bg-red-900/40 text-red-300 border border-red-700/50 hover:bg-red-800/60 cursor-pointer'
                    : 'bg-slate-900/60 text-slate-600 border border-slate-800 cursor-default'
                }`}
              >
                #{String(num).padStart(3, '0')}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabla de Participantes */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-white">Participantes Registrados ({participantes.length})</h2>

        {participantes.length === 0 ? (
          <p className="text-slate-500 text-sm">Aún no hay ningún participante registrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Participante</th>
                  <th className="py-3 px-4">País</th>
                  <th className="py-3 px-4">Teléfono</th>
                  <th className="py-3 px-4">Números</th>
                  <th className="py-3 px-4">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {participantes.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/50 transition">
                    <td className="py-3 px-4 font-medium text-white">{p.nombre}</td>
                    <td className="py-3 px-4">{p.pais}</td>
                    <td className="py-3 px-4 font-mono text-indigo-400">{p.telefono}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {p.numeros.map((n) => (
                          <span
                            key={n}
                            className="bg-slate-800 text-slate-200 text-xs font-mono font-bold px-2 py-0.5 rounded border border-slate-700"
                          >
                            #{String(n).padStart(3, '0')}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setSelectedParticipante(p)}
                        className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1 rounded-lg border border-slate-700"
                      >
                        Ver Detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Detalle */}
      <AdminParticipanteModal
        participante={selectedParticipante}
        onClose={() => setSelectedParticipante(null)}
      />
    </div>
  );
}