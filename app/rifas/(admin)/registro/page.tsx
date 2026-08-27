'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import GoogleButton from '@/components/marketing/ui/GoogleButton';
import { loginConGoogle, supabase } from '@/lib/rifas/supabase';

export default function FormularioRegistro() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Las contraseñas no coinciden.');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        if (
          error.message.toLowerCase().includes('already registered') ||
          error.message.toLowerCase().includes('already exists')
        ) {
          throw new Error('Este correo ya está registrado. Por favor, inicia sesión.');
        }
        throw error;
      }

      if (data?.session) {
        router.push('/rifas/admin/crear');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (!signInError) {
          router.push('/rifas/admin/crear');
        } else {
          setErrorMsg('Cuenta creada. Inicia sesión para continuar.');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al registrar la cuenta.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const redirectUrl = `${window.location.origin}/rifas/admin/crear`;
      await loginConGoogle(redirectUrl);
    } catch (err: any) {
      setErrorMsg('No se pudo autenticar con Google: ' + err.message);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm max-w-md mx-auto space-y-5">
      <div className="text-center space-y-1">
        <h3 className="text-xl font-black text-gray-900">Crear Cuenta de Organizador</h3>
        <p className="text-xs text-gray-500 font-medium">
          Regístrate para comenzar a crear tu primera rifa
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

      <form onSubmit={handleRegister} className="space-y-4">
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
            minLength={6}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
            Confirmar Contraseña
          </label>
          <input
            type="password"
            required
            minLength={6}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-green-600/20 disabled:bg-gray-300 cursor-pointer"
        >
          {loading ? 'Creando cuenta...' : 'Registrarme y Crear Rifa'}
        </button>
      </form>

      <div className="text-center pt-2 border-t border-gray-100">
        <a
          href="/rifas/login"
          className="text-xs text-green-600 hover:text-green-700 font-bold underline"
        >
          ¿Ya tienes una cuenta? Inicia sesión aquí
        </a>
      </div>
    </div>
  );
}