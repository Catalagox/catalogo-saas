'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import GoogleButton from '@/components/marketing/ui/GoogleButton';
import { loginConGoogle, supabase } from '@/lib/rifas/supabase';

export default function FormularioLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const redireccionarSegunRifa = async (userId: string) => {
    // Buscamos la rifa más reciente del usuario. Usamos .limit(1) para evitar errores si tiene más de una.
    const { data: rifas, error } = await supabase
      .from('rifas')
      .select('id, slug')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error consultando rifa:', error.message || error);
    }

    if (rifas && rifas.length > 0) {
      // Tomamos el id de la primera rifa encontrada
      const identificador = rifas[0].id; // Si prefieres usar slug en la URL, cambia por: rifas[0].slug || rifas[0].id
      
      router.push(`/rifas/admin/${identificador}`);
      router.refresh(); // Fundamental en Next.js App Router para refrescar el estado global de la sesión
    } else {
      router.push('/rifas/admin/crear');
      router.refresh();
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error('Correo o contraseña incorrectos.');
      }

      if (data?.session?.user) {
        await redireccionarSegunRifa(data.session.user.id);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al iniciar sesión.');
      setLoading(false); // Solo desactivamos loading si hay error, para evitar destellos durante la redirección exitosa
    }
  };

  const handleGoogleAuth = async () => {
    try {
      // Asegúrate de tener esta ruta configurada para manejar el post-login de Google, 
      // o cámbiala por la ruta base de tu panel.
      const redirectUrl = `${window.location.origin}/rifas/admin/callback`;
      await loginConGoogle(redirectUrl);
    } catch (err: any) {
      setErrorMsg('No se pudo autenticar con Google: ' + err.message);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm max-w-md mx-auto space-y-5">
      <div className="text-center space-y-1">
        <h3 className="text-xl font-black text-gray-900">Iniciar Sesión</h3>
        <p className="text-xs text-gray-500 font-medium">
          Ingresa a tu cuenta para administrar tu rifa
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
          {errorMsg}
        </div>
      )}

      <GoogleButton onClick={handleGoogleAuth} />

      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="flex-shrink mx-3 text-xs uppercase font-bold text-gray-400">
          O con tu correo
        </span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
            Correo Electrónico
          </label>
          <input
            type="email"
            required
            placeholder="ejemplo@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
            Contraseña
          </label>
          <input
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-green-600/20 disabled:bg-gray-300 cursor-pointer"
        >
          {loading ? 'Ingresando...' : 'Iniciar Sesión'}
        </button>
      </form>

      <div className="text-center pt-2 border-t border-gray-100">
        <a
          href="/rifas/registro"
          className="text-xs text-green-600 hover:text-green-700 font-bold underline"
        >
          ¿No tienes cuenta? Regístrate aquí
        </a>
      </div>
    </div>
  );
}