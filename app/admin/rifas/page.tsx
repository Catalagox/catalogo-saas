'use client';

import React, { useEffect, useState } from 'react';
import { Rifa, RifaNumero, RifaParticipanteConNumeros } from '@/lib/rifas/types';
import NumeroGrid from '@/components/rifas/NumeroGrid';
import { 
  getRifaActiva, 
  getNumerosOcupados, 
  getParticipantesAdmin, 
  actualizarRifa, 
  actualizarEstadoPagoParticipante,
  subirImagenRifa,
  confirmarPagoNumerosParticipante 
} from '@/lib/rifas/supabase';
import AdminParticipanteModal from '@/components/rifas/AdminParticipanteModal';

export default function AdminRifasPage() {
  const [rifa, setRifa] = useState<Rifa | null>(null);
  const [numerosMap, setNumerosMap] = useState<Map<number, RifaNumero>>(new Map());
  const [participantes, setParticipantes] = useState<RifaParticipanteConNumeros[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedParticipante, setSelectedParticipante] = useState<RifaParticipanteConNumeros | null>(null);

  // Estados para formulario de edición de la rifa
  const [editing, setEditing] = useState(false);
  const [savingRifa, setSavingRifa] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [premio, setPremio] = useState('');
  const [precioNumero, setPrecioNumero] = useState<number>(0);
  const [fechaSorteo, setFechaSorteo] = useState('');
  const [terminos, setTerminos] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');

  const cargarDatos = async () => {
    setLoading(true);
    const dataRifa = await getRifaActiva();

    if (dataRifa) {
      setRifa(dataRifa);
      setTitulo(dataRifa.titulo || '');
      setDescripcion(dataRifa.descripcion || '');
      setPremio(dataRifa.premio || '');
      setPrecioNumero(dataRifa.precio_numero || 0);

      if (dataRifa.fecha_sorteo) {
        const fechaLimpia = String(dataRifa.fecha_sorteo).split('T')[0];
        setFechaSorteo(fechaLimpia);
      } else {
        setFechaSorteo('');
      }

      setTerminos(dataRifa.terminos_condiciones || '');
      setImagenUrl(dataRifa.imagen_url || '');

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !rifa) return;

    try {
      setUploadingImg(true);
      const url = await subirImagenRifa(file, rifa.id);
      if (url) {
        setImagenUrl(url);
      }
    } catch (err) {
      alert('Error al subir la imagen. Verifica Supabase Storage.');
    } finally {
      setUploadingImg(false);
    }
  };

  const handleSaveRifa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rifa) return;

    setSavingRifa(true);
    try {
      const fechaISO = fechaSorteo ? new Date(`${fechaSorteo}T12:00:00`).toISOString() : null;

      await actualizarRifa(rifa.id, {
        titulo,
        descripcion,
        premio,
        precio_numero: Number(precioNumero),
        fecha_sorteo: fechaISO as any,
        terminos_condiciones: terminos,
        imagen_url: imagenUrl,
      });

      alert('¡Rifa actualizada correctamente!');
      setEditing(false);
      await cargarDatos();
    } catch (error: any) {
      alert('Error al guardar: ' + error.message);
    } finally {
      setSavingRifa(false);
    }
  };

  const handleToggleEstadoPago = async (participanteId: string, nuevoEstado: 'pagado' | 'pendiente') => {
    if (!rifa) return;
    
    if (nuevoEstado === 'pagado' && !window.confirm('¿Estás seguro de marcar como PAGADO? Esto pondrá los números en ROJO permanentemente.')) {
        return;
    }

    setLoading(true);
    try {
      await actualizarEstadoPagoParticipante(participanteId, nuevoEstado);

      if (nuevoEstado === 'pagado') {
          await confirmarPagoNumerosParticipante(rifa.id, participanteId);
          alert('✅ Pago confirmado. Los números ahora están en ROJO.');
      } else {
          alert('⚠️ Estado cambiado a pendiente.');
      }

      await cargarDatos();
    } catch (error: any) {
      console.error('Error al cambiar el estado de pago:', error);
      alert('❌ Error crítico: ' + error.message);
      await cargarDatos();
    } finally {
        setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-3 bg-gray-50 text-gray-800">
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 text-sm font-medium">Procesando cambios...</p>
      </div>
    );
  }

  if (!rifa) {
    return (
      <div className="max-w-4xl mx-auto my-12 p-8 text-center bg-white border border-gray-200 rounded-3xl shadow-sm">
        <p className="text-gray-500 font-medium">No hay ninguna rifa registrada en la base de datos.</p>
      </div>
    );
  }

  // Mapa simplificado con estados exactos para NumeroGrid
  const numerosEstadosMap = new Map<number, 'ocupado' | 'reservado' | 'disponible'>();
  numerosMap.forEach((val, key) => {
    numerosEstadosMap.set(key, val.estado as 'ocupado' | 'reservado' | 'disponible');
  });

  const cantidadOcupados = Array.from(numerosEstadosMap.values()).filter(e => e === 'ocupado').length;
  const cantidadReservados = Array.from(numerosEstadosMap.values()).filter(e => e === 'reservado').length;
  const cantidadDisponibles = rifa.cantidad_numeros - (cantidadOcupados + cantidadReservados);

  const handleNumeroClick = (num: number) => {
    const regNumero = numerosMap.get(num);
    if (regNumero && regNumero.participante_id) {
      const part = participantes.find((p) => p.id === regNumero.participante_id);
      if (part) {
        setSelectedParticipante(part);
      } else {
        alert(`El número #${num} está asignado al ID de participante ${regNumero.participante_id}, pero no se encontró en la lista.`);
      }
    } else {
      alert(`El número #${num} se encuentra libre/disponible.`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 bg-gray-50 min-h-screen text-gray-900">
      
      {/* Resumen de la Rifa & Acciones */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase font-bold text-green-800 bg-green-100 px-3 py-1 rounded-full border border-green-200">
              {rifa.estado}
            </span>
            <button
              onClick={() => setEditing(!editing)}
              className="text-xs font-semibold text-green-700 bg-green-50 border border-green-200 hover:bg-green-100 px-3 py-1 rounded-full transition-all"
            >
              {editing ? 'Cancelar Edición' : '✏️ Editar Configuración'}
            </button>
          </div>
          <h1 className="text-2xl font-black text-gray-900 mt-2">{rifa.titulo}</h1>
          <p className="text-sm text-gray-500">Premio: <strong className="text-gray-800">{rifa.premio}</strong></p>
        </div>

        <div className="flex gap-4 sm:gap-6 bg-gray-50 p-4 rounded-2xl border border-gray-200 text-center w-full md:w-auto justify-around">
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold">Total</p>
            <p className="text-lg font-black text-gray-800">{rifa.cantidad_numeros}</p>
          </div>
          <div className="border-l border-gray-200 pl-4 sm:pl-6">
            <p className="text-xs text-gray-400 uppercase font-bold">Disponibles</p>
            <p className="text-lg font-black text-green-600">{cantidadDisponibles}</p>
          </div>
          <div className="border-l border-gray-200 pl-4 sm:pl-6">
            <p className="text-xs text-gray-400 uppercase font-bold">Reservados</p>
            <p className="text-lg font-black text-purple-600">{cantidadReservados}</p>
          </div>
          <div className="border-l border-gray-200 pl-4 sm:pl-6">
            <p className="text-xs text-gray-400 uppercase font-bold">Pagados</p>
            <p className="text-lg font-black text-red-500">{cantidadOcupados}</p>
          </div>
        </div>
      </div>

      {/* Formulario de Edición de la Rifa */}
      {editing && (
        <form onSubmit={handleSaveRifa} className="bg-white border border-green-200 rounded-3xl p-6 space-y-6 shadow-lg shadow-green-600/5">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Editar Configuración de la Rifa</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Título</label>
              <input
                type="text"
                required
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Premio Principal</label>
              <input
                type="text"
                required
                value={premio}
                onChange={(e) => setPremio(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Precio por Número (USD)</label>
              <input
                type="number"
                step="0.01"
                required
                value={precioNumero}
                onChange={(e) => setPrecioNumero(parseFloat(e.target.value))}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fecha del Sorteo</label>
              <input
                type="date"
                required
                value={fechaSorteo}
                onChange={(e) => setFechaSorteo(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Imagen del Premio</label>
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-green-100 file:text-green-800 hover:file:bg-green-200 cursor-pointer"
                />
                <span className="text-xs text-gray-400 font-bold">O URL:</span>
                <input
                  type="url"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={imagenUrl}
                  onChange={(e) => setImagenUrl(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              {uploadingImg && <p className="text-xs text-green-600 mt-1 font-medium">Subiendo imagen...</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descripción</label>
              <textarea
                rows={3}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Términos y Condiciones</label>
              <textarea
                rows={3}
                placeholder="Escribe las reglas, condiciones de entrega o restricciones..."
                value={terminos}
                onChange={(e) => setTerminos(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-100 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={savingRifa || uploadingImg}
              className="px-6 py-2.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-green-600/20 disabled:bg-gray-300"
            >
              {savingRifa ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      )}

      {/* Visor de Números */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h2 className="text-lg font-bold text-gray-900">Mapa de Números (Haz clic en un número para ver el comprador)</h2>
        </div>

        <NumeroGrid
          cantidadTotal={rifa.cantidad_numeros}
          numerosOcupadosMap={numerosEstadosMap}
          numerosSeleccionados={[]} 
          onToggleNumero={handleNumeroClick} 
          allowClickOnOcupados={true}
        />
      </div>

      {/* Tabla de Participantes */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 space-y-4 shadow-sm overflow-hidden">
        <h2 className="text-lg font-bold text-gray-900">Participantes y Control de Pagos ({participantes.length})</h2>

        {participantes.length === 0 ? (
          <p className="text-gray-500 text-sm p-4 bg-gray-50 rounded-xl border">Aún no hay ningún participante registrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700 min-w-[600px]">
              <thead className="text-xs uppercase bg-gray-50 text-gray-500 border-b border-gray-200">
                <tr>
                  <th className="py-3.5 px-4">Participante</th>
                  <th className="py-3.5 px-4">Teléfono</th>
                  <th className="py-3.5 px-4">Números</th>
                  <th className="py-3.5 px-4">Estado Pago</th>
                  <th className="py-3.5 px-4">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {participantes.map((p) => (
                  <tr key={p.id} className={`hover:bg-gray-50/80 transition ${ (p as any).estado_pago === 'pagado' ? 'bg-green-50/50' : ''}`}>
                    <td className="py-3.5 px-4">
                        <div className='font-bold text-gray-900'>{p.nombre}</div>
                        <div className='text-xs text-gray-500'>{p.pais}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-green-700 font-medium whitespace-nowrap">{p.telefono}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {p.numeros.map((n) => (
                          <span
                            key={n}
                            className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                                (p as any).estado_pago === 'pagado' 
                                ? 'bg-red-100 text-red-800 border-red-200' 
                                : 'bg-purple-100 text-purple-800 border-purple-200'
                            }`}
                          >
                            #{String(n).padStart(String(rifa.cantidad_numeros).length, '0')}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={(p as any).estado_pago || 'pendiente'}
                        disabled={loading}
                        onChange={(e) => handleToggleEstadoPago(p.id, e.target.value as 'pagado' | 'pendiente')}
                        className={`text-xs font-bold px-3 py-2 rounded-xl border focus:outline-none transition-colors cursor-pointer shadow-sm ${
                          (p as any).estado_pago === 'pagado'
                            ? 'bg-green-600 text-white border-green-700'
                            : 'bg-purple-100 text-purple-900 border-purple-300 hover:bg-purple-200'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <option value="pendiente" className='bg-white text-gray-900'>⏳ Pendiente (Morado)</option>
                        <option value="pagado" className='bg-white text-gray-900'>✅ Pagado (Rojo)</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => setSelectedParticipante(p)}
                        className="text-xs font-semibold bg-white hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-xl border border-gray-200 transition-colors shadow-sm whitespace-nowrap"
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