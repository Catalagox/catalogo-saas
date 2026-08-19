import React from 'react';

export const metadata = {
  title: 'Administración - CatalagoX Rifas',
};

export default function AdminRifasLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/60 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-black text-lg bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
              CATALAGOX
            </span>
            <span className="text-xs bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded-full font-bold uppercase">
              Admin Panel
            </span>
          </div>
          <a
            href="/rifas"
            target="_blank"
            rel="noreferrer"
            className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-3 py-1.5 rounded-lg transition"
          >
            Ver vista pública ↗
          </a>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}