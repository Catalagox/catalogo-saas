export default function MenuFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-zinc-100 bg-white pb-12">
      <div className="max-w-3xl mx-auto px-6 py-10 flex flex-col items-center">
        
        {/* Logo o Icono sutil */}
        <div className="mb-4 flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="w-6 h-6 bg-zinc-900 rounded-md flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">X</span>
          </div>
          <span className="text-zinc-900 font-bold tracking-tighter text-base">
            CatalagoX
          </span>
        </div>

        {/* Texto principal */}
        <p className="text-zinc-500 font-medium text-sm text-center">
          Menú digital generado con tecnología QR
        </p>
        
        {/* Disclaimer y Copyright */}
        <div className="mt-6 flex flex-col items-center gap-2">
          <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-300">
            <span>Seguro</span>
            <span className="w-1 h-1 rounded-full bg-zinc-200"></span>
            <span>Rápido</span>
            <span className="w-1 h-1 rounded-full bg-zinc-200"></span>
            <span>Sin contacto</span>
          </div>
          
          <p className="text-[10px] text-zinc-400 mt-4">
            © {currentYear} Todos los derechos reservados.
          </p>
        </div>

      </div>
    </footer>
  );
}