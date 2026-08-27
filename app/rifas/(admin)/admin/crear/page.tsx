'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, crearRifa, subirImagenRifa, actualizarRifa } from '@/lib/rifas/supabase';

export default function CrearNuevaRifaPage() {
  const router = useRouter();
  const [organizador, setOrganizador] = useState<{ id: string; email?: string; nombre?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // Estado del formulario
  const [titulo, setTitulo] = useState('');
  const [slug, setSlug] = useState('');
  const [premio, setPremio] = useState('');
  const [precioNumero, setPrecioNumero] = useState<number>(5);
  const [cantidadNumeros, setCantidadNumeros] = useState<number>(100);
  const [fechaSorteo, setFechaSorteo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    // Validar usuario autenticado desde Supabase Auth
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setOrganizador({
          id: user.id,
          email: user.email,
          nombre: user.user_metadata?.full_name || user.email?.split('@')[0],
        });
      }
    }
    checkUser();
  }, []);

  // Generación automática del Slug amigable
  const handleTituloChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setTitulo(text);
    const autoSlug = text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    setSlug(autoSlug);
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSaveAndPublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fechaISO = fechaSorteo
        ? new Date(`${fechaSorteo}T12:00:00`).toISOString()
        : new Date().toISOString();

      // 1. Crear el registro en la base de datos (obtiene el ID real generado)
      const nuevaRifa = await crearRifa({
        titulo,
        slug,
        premio,
        precio_numero: Number(precioNumero),
        cantidad_numeros: Number(cantidadNumeros),
        fecha_sorteo: fechaISO,
        descripcion,
        estado: 'activa',
        imagen_url: null,
      });

      // 2. Si el usuario adjuntó una imagen, subirla vinculada al ID real y actualizar el registro
      if (selectedFile && nuevaRifa?.id) {
        const uploadedUrl = await subirImagenRifa(selectedFile, nuevaRifa.id);
        if (uploadedUrl) {
          await actualizarRifa(nuevaRifa.id, { imagen_url: uploadedUrl });
        }
      }

      // 3. Redirección al panel de administración del organizador
      router.push(`/rifas/admin/${nuevaRifa.id}`);
    } catch (err: any) {
      console.error('Error al crear la rifa:', err);
      alert(
        'Error al publicar la rifa: ' +
          (err.message || 'Verifica que el Slug sea único y tengas una sesión activa.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
        <div>
          <span className="text-xs font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full uppercase">
            Paso 2 de 2
          </span>
          <h1 className="text-2xl font-black text-gray-900 mt-2">
            Configura los datos de tu Sorteo
          </h1>
          {organizador && (
            <p className="text-xs text-gray-500 mt-1">
              Organizador activo: <strong>{organizador.nombre}</strong> ({organizador.email})
            </p>
          )}
        </div>

        <form onSubmit={handleSaveAndPublish} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Nombre o Título del Sorteo
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Gran Rifa de un iPhone 15 Pro Max"
                value={titulo}
                onChange={handleTituloChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Enlace Personalizado (Slug)
              </label>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm font-mono text-gray-500">
                <span>catalagox.com/rifas/</span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="bg-transparent text-gray-900 focus:outline-none font-bold w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Premio Principal
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Moto Bera 150cc 0km"
                  value={premio}
                  onChange={(e) => setPremio(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Precio por Número (USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={precioNumero}
                  onChange={(e) => setPrecioNumero(parseFloat(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Cantidad de Números
                </label>
                <select
                  value={cantidadNumeros}
                  onChange={(e) => setCantidadNumeros(parseInt(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value={100}>100 Números (00 - 99)</option>
                  <option value={200}>200 Números (000 - 199)</option>
                  <option value={500}>500 Números (000 - 499)</option>
                  <option value={1000}>1000 Números (000 - 999)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Fecha de Celebración
                </label>
                <input
                  type="date"
                  required
                  value={fechaSorteo}
                  onChange={(e) => setFechaSorteo(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Imagen del Premio
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelected}
                className="block w-full text-xs text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-green-100 file:text-green-800 hover:file:bg-green-200 cursor-pointer border border-gray-200 rounded-xl bg-gray-50 p-1"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Descripción del Sorteo
              </label>
              <textarea
                rows={3}
                placeholder="Explica detalladamente cómo se realizará la entrega del premio..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-500 active:scale-[0.99] disabled:bg-gray-300 text-white font-extrabold py-4 rounded-xl transition-all shadow-lg shadow-green-600/25 text-base cursor-pointer"
          >
            {loading ? 'Publicando Sorteo...' : '🎉 Publicar Rifa y Ver Panel'}
          </button>
        </form>
      </div>
    </div>
  );
}