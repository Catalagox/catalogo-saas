'use client';

import React, { useEffect, useState } from 'react';
import { Rifa, RifaNumero } from '@/lib/rifas/types';
import { getRifaActiva, getNumerosOcupados, registrarParticipante } from '@/lib/rifas/supabase';
import { PAISES } from '@/components/rifas/paises';
import NumeroGrid from '@/components/rifas/NumeroGrid';

export default function RifasPage() {
  const [rifa, setRifa] = useState<Rifa | null>(null);
  const [numerosOcupadosMap, setNumerosOcupadosMap] = useState<Map<number, 'ocupado' | 'reservado' | 'disponible'>>(new Map());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State
  const [numerosSeleccionados, setNumerosSeleccionados] = useState<number[]>([]);
  const [nombre, setNombre] = useState('');
  const [paisCodigo, setPaisCodigo] = useState(PAISES[0].codigo);
  const [paisNombre, setPaisNombre] = useState(PAISES[0].nombre);
  const [telefono, setTelefono] = useState('');

  const cargarDatos = async () => {
    setLoading(true);
    const dataRifa = await getRifaActiva();
    if (dataRifa) {
      setRifa(dataRifa);
      const ocupadosList = await getNumerosOcupados(dataRifa.id);
      const map = new Map<number, 'ocupado' | 'reservado' | 'disponible'>();
      ocupadosList.forEach((item) => map.set(item.numero, item.estado));
      setNumerosOcupadosMap(map);
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleToggleNumero = (num: number) => {
    setErrorMsg(null);
    setNumerosSeleccionados((prev) =>
      prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num].sort((a, b) => a - b)
    );
  };

  const handlePaisChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = PAISES.find((p) => p.nombre === e.target.value);
    if (selected) {
      setPaisNombre(selected.nombre);
      setPaisCodigo(selected.codigo);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: rifa?.titulo || 'Gran Sorteo',
      text: `¡Participa en el sorteo de ${rifa?.premio || 'este gran premio'}!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Usuario canceló la acción de compartir
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('¡Enlace copiado al portapapeles!');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rifa) return;

    if (numerosSeleccionados.length === 0) {
      setErrorMsg('Debes seleccionar al menos un número.');
      return;
    }

    if (!nombre.trim() || !telefono.trim()) {
      setErrorMsg('Por favor completa todos los campos.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const telefonoCompleto = `${paisCodigo} ${telefono.trim()}`;
      await registrarParticipante({
        rifa_id: rifa.id,
        nombre: nombre.trim(),
        pais: paisNombre,
        telefono: telefonoCompleto,
        numeros: numerosSeleccionados,
      });

      setSuccessMsg(`¡Registro completado con éxito! Reservaste ${numerosSeleccionados.length} número(s).`);
      setNumerosSeleccionados([]);
      setNombre('');
      setTelefono('');
      
      await cargarDatos();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al procesar la solicitud.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 bg-white text-gray-800">
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 text-sm font-medium">Cargando información de la rifa...</p>
      </div>
    );
  }

  if (!rifa) {
    return (
      <div className="max-w-xl mx-auto my-12 px-4 py-8 bg-white border border-gray-200 rounded-3xl text-center shadow-sm">
        <h2 className="text-xl font-bold mb-2 text-gray-800">No hay rifas activas</h2>
        <p className="text-gray-500 text-sm">Vuelve a consultar más tarde para nuevas oportunidades.</p>
      </div>
    );
  }

  const cantidadOcupados = numerosOcupadosMap.size;
  const cantidadDisponibles = rifa.cantidad_numeros - cantidadOcupados;
  const precioTotal = numerosSeleccionados.length * rifa.precio_numero;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 px-3 sm:px-6 py-6 sm:py-10 space-y-6 max-w-4xl mx-auto">
      
      {/* Banner de Publicidad para catalogox.com */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-500 text-white p-3 sm:p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left shadow-md">
        <div>
          <p className="text-xs uppercase font-bold tracking-wider text-green-100">Publicidad</p>
          <p className="text-sm sm:text-base font-semibold">¿Quieres publicar tu propio catálogo o tienda online?</p>
        </div>
        <a 
          href="https://catalagox.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-white text-green-600 hover:bg-green-50 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm transition-all whitespace-nowrap shadow"
        >
          Visitar Catalagox.com 
        </a>
      </div>

      {/* Card Principal del Premio */}
      <div className="bg-white border border-gray-100 rounded-3xl p-5 sm:p-8 flex flex-col md:flex-row gap-6 items-center shadow-lg shadow-gray-100">
        {rifa.imagen_url && (
          <div className="w-full md:w-1/2 aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={rifa.imagen_url} alt={rifa.premio} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="w-full md:w-1/2 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs uppercase tracking-widest text-green-700 font-bold bg-green-50 px-3 py-1 rounded-full border border-green-200">
              Gran Sorteo Internacional
            </span>
            {/* Botón Compartir */}
            <button 
              onClick={handleShare}
              className="flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-100 hover:bg-green-200 px-3 py-1.5 rounded-full transition-colors active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684" />
              </svg>
              Compartir
            </button>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">{rifa.titulo}</h1>
          <p className="text-gray-600 text-sm leading-relaxed">{rifa.descripcion}</p>

          <div className="grid grid-cols-2 gap-4 py-3 border-y border-gray-100">
            <div>
              <p className="text-gray-400 text-xs uppercase font-medium">Precio por número</p>
              <p className="text-xl sm:text-2xl font-black text-green-600">${rifa.precio_numero.toFixed(2)} USD</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase font-medium">Fecha del sorteo</p>
              <p className="text-sm font-semibold text-gray-700 mt-1">
                {new Date(rifa.fecha_sorteo).toLocaleDateString('es-ES', { dateStyle: 'long' })}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-xs font-semibold">
            <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md">Total: {rifa.cantidad_numeros}</span>
            <span className="bg-green-100 text-green-800 px-2.5 py-1 rounded-md">Disponibles: {cantidadDisponibles}</span>
            <span className="bg-red-100 text-red-800 px-2.5 py-1 rounded-md">Ocupados: {cantidadOcupados}</span>
          </div>
        </div>
      </div>

      {/* Mensajes de Estado */}
      {successMsg && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-2xl text-green-800 text-sm flex justify-between items-center shadow-sm">
          <span className="font-medium">{successMsg}</span>
          <button onClick={() => setSuccessMsg(null)} className="font-bold ml-4 text-green-600 hover:text-green-900">✕</button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-sm flex justify-between items-center shadow-sm">
          <span className="font-medium">{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="font-bold ml-4 text-red-600 hover:text-red-900">✕</button>
        </div>
      )}

      {/* Selector de Números */}
      <div className="bg-white border border-gray-100 rounded-3xl p-5 sm:p-8 space-y-6 shadow-lg shadow-gray-100">
        <h2 className="text-xl font-bold text-gray-900 text-center">Elegí tus números</h2>
        
        <NumeroGrid
          cantidadTotal={rifa.cantidad_numeros}
          numerosOcupadosMap={numerosOcupadosMap}
          numerosSeleccionados={numerosSeleccionados}
          onToggleNumero={handleToggleNumero}
        />

        {/* Resumen de Selección */}
        {numerosSeleccionados.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-green-900 font-semibold">
                Números seleccionados ({numerosSeleccionados.length}):
              </p>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {numerosSeleccionados.map((num) => (
                  <span key={num} className="bg-green-600 text-white font-mono text-xs px-2 py-0.5 rounded-md font-bold">
                    #{String(num).padStart(3, '0')}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-center sm:text-right w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-green-200">
              <p className="text-xs text-green-700 uppercase font-medium">Total a pagar</p>
              <p className="text-xl font-black text-green-700">${precioTotal.toFixed(2)} USD</p>
            </div>
          </div>
        )}
      </div>

      {/* Formulario del Participante */}
      {numerosSeleccionados.length > 0 && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-3xl p-5 sm:p-8 space-y-6 shadow-xl shadow-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Completá tus datos para reservar</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Nombre completo</label>
              <input
                type="text"
                required
                placeholder="Ej: Juan Pérez"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-base sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">País</label>
                <select
                  value={paisNombre}
                  onChange={handlePaisChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2 py-3.5 text-base sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
                >
                  {PAISES.map((p) => (
                    <option key={p.nombre} value={p.nombre}>
                      {p.bandera} {p.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                  Teléfono ({paisCodigo})
                </label>
                <input
                  type="tel"
                  required
                  placeholder="412 1234567"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-base sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all font-mono"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-600 hover:bg-green-500 active:scale-[0.99] disabled:bg-gray-300 text-white font-extrabold py-4 rounded-xl transition-all shadow-lg shadow-green-600/25 text-base text-center"
          >
            {submitting ? 'Reservando números...' : 'Confirmar Selección'}
          </button>
        </form>
      )}
    </div>
  );
}