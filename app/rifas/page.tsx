'use client';

import React from 'react';
import Link from 'next/link';

export default function RifasLandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between">
      {/* Header / Navbar */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black text-green-600">Catalagox</span>
          <span className="text-xs bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded-full">Rifas</span>
        </div>
        <Link 
          href="/rifas/registro"
          className="text-xs font-bold text-gray-700 hover:text-green-600 transition-colors"
        >
          Iniciar Sesión
        </Link>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 py-16 text-center space-y-8 flex-1 flex flex-col justify-center items-center">
        <span className="bg-green-100 text-green-800 text-xs font-extrabold uppercase px-4 py-1.5 rounded-full tracking-wider border border-green-200">
          Crea tu rifa online en minutos
        </span>
        
        <h1 className="text-4xl sm:text-6xl font-black text-gray-900 leading-tight">
          La forma más rápida y segura de vender tus talonarios digitales
        </h1>

        <p className="text-gray-600 text-base sm:text-lg max-w-2xl leading-relaxed">
          Organiza sorteos profesionales, gestiona números ocupados en tiempo real y recibe pagos directo en tu cuenta sin complicaciones.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4">
          <Link
            href="/rifas/registro"
            className="bg-green-600 hover:bg-green-500 text-white font-black text-base px-8 py-4 rounded-2xl shadow-lg shadow-green-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-center"
          >
            🚀 Crear mi Rifa Ahora
          </Link>
          <Link
            href="/rifas/admin"
            className="bg-white hover:bg-gray-100 text-gray-800 font-bold text-base px-8 py-4 rounded-2xl border border-gray-200 transition-all text-center"
          >
            Ir a mis Sorteos
          </Link>
        </div>

        {/* Ventajas rápidas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 text-left w-full border-t border-gray-200">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
            <span className="text-2xl">⚡</span>
            <h3 className="font-bold text-gray-900 text-sm">Creación Express</h3>
            <p className="text-xs text-gray-500">Sube la foto de tu premio, asigna el precio por número y publica en 2 minutos.</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
            <span className="text-2xl">📱</span>
            <h3 className="font-bold text-gray-900 text-sm">Control en Tiempo Real</h3>
            <p className="text-xs text-gray-500">Mira de inmediato quién reservó o pagó cada número con alertas de estado visuales.</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
            <span className="text-2xl">🔗</span>
            <h3 className="font-bold text-gray-900 text-sm">Enlace Personalizado</h3>
            <p className="text-xs text-gray-500">Comparte el link directo de tu sorteo en WhatsApp e Instagram con tus clientes.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Catalagox Rifas - Todos los derechos reservados.
      </footer>
    </div>
  );
}