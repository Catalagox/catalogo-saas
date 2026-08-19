import React from 'react';

export const metadata = {
  title: 'CatalogoX Rifas Internacionales',
  description: 'Participa en nuestras rifas internacionales y gana grandes premios.',
};

export default function RifasLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 selection:bg-green-500 selection:text-white">
      {/* Header Independiente */}
      <header className="border-b border-gray-200 bg-white/90 backdrop-blur-md sticky top-0 z-50">
  <div className="max-w-5xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2">
    <a 
      href="https://catalogox.com" 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 sm:gap-2 min-w-0 group transition-opacity hover:opacity-90"
    >
      <span className="bg-gradient-to-r from-green-600 to-emerald-500 text-transparent bg-clip-text font-black text-lg sm:text-xl tracking-wider truncate">
        CATALOGOX
      </span>
      <span className="text-[10px] sm:text-xs bg-green-100 text-green-800 border border-green-200 px-1.5 sm:px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider whitespace-nowrap">
        Rifas
      </span>
    </a>
    <span className="text-[11px] sm:text-xs font-medium text-gray-500 flex items-center gap-1 whitespace-nowrap shrink-0">
      <span>🌎</span> <span className="hidden xs:inline">Rifa</span> Internacional
    </span>
  </div>
</header>

      <main>{children}</main>

      {/* Footer Independiente */}
      <footer className="border-t border-gray-200 bg-white py-8 mt-16 text-center text-gray-500 text-xs space-y-2">
        <p>© {new Date().getFullYear()} CatalogoX Rifas. Todos los derechos reservados.</p>
        <p>
          Powered by{' '}
          <a 
            href="https://catalogox.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-green-600 font-semibold hover:underline"
          >
            catalogox.com
          </a>
        </p>
      </footer>
    </div>
  );
}