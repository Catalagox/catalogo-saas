'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/marketing/layout/Header';
import Footer from '@/components/marketing/layout/Footer';

export default function RifasLandingUI() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-emerald-500 selection:text-white font-sans antialiased">
      <Header />

      <main className="flex-1 flex flex-col justify-center items-center relative overflow-hidden px-6 py-20 bg-slate-50/50">
        {/* Efectos de luces suaves de fondo */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-teal-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          {/* Badge destacada */}
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-full shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Crea tu rifa online en minutos
          </div>

          {/* Título Principal */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.15] text-slate-900">
            La forma más rápida y segura de vender tus{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">
              talonarios digitales
            </span>
          </h1>

          {/* Subtítulo */}
          <p className="text-slate-600 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Organiza sorteos profesionales, gestiona números en tiempo real y recibe pagos directo en tu cuenta sin complicaciones.
          </p>

          {/* Botones de llamada a la acción */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/rifas/registro"
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base px-8 py-4 rounded-xl shadow-lg shadow-emerald-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-center"
            >
              🚀 Crear mi Rifa Ahora
            </Link>
            <Link
              href="/rifas/admin"
              className="w-full sm:w-auto bg-white hover:bg-slate-100 text-slate-800 font-semibold text-base px-8 py-4 rounded-xl border border-slate-200 shadow-sm transition-all text-center"
            >
              Ir a mis Sorteos
            </Link>
          </div>

          {/* Tarjetas de características */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-16 text-left border-t border-slate-200">
            <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-200 transition-all">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Creación Express</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Sube la foto de tu premio, asigna el precio por número y publica en solo 2 minutos.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-200 transition-all">
              <div className="text-3xl mb-3">📱</div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Control en Tiempo Real</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Visualiza al instante reservas y pagos de cada número con alertas de estado.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-200 transition-all">
              <div className="text-3xl mb-3">🔗</div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Enlace Personalizado</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Comparte el link directo de tu sorteo por WhatsApp e Instagram fácilmente.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}