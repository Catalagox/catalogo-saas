export default function MenuFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 pt-10 pb-12 bg-[var(--color-footer)]">
      <div className="max-w-3xl mx-auto px-6 flex flex-col items-center">

        {/* LOGO */}
        <div className="mb-4 flex items-center gap-2 opacity-80">
          <div className="w-6 h-6 rounded-md flex items-center justify-center bg-[var(--color-text)]">
            <span className="text-[10px] font-bold text-[var(--color-footer)]">
              X
            </span>
          </div>

          <span className="font-bold tracking-tight text-sm text-[var(--color-text)]">
            CatalogoX
          </span>
        </div>

        {/* TEXTO */}
        <p className="text-sm text-center opacity-80 text-[var(--color-text)]">
          Menú digital generado con tecnología QR
        </p>

        {/* FEATURES */}
        <div className="mt-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-widest opacity-60 text-[var(--color-text)]">
          <span>Seguro</span>
          <span className="w-1 h-1 rounded-full bg-white/40"></span>
          <span>Rápido</span>
          <span className="w-1 h-1 rounded-full bg-white/40"></span>
          <span>Sin contacto</span>
        </div>

        {/* COPYRIGHT */}
        <p className="text-[10px] mt-4 opacity-50 text-[var(--color-text)]">
          © {currentYear} Todos los derechos reservados.
        </p>

      </div>
    </footer>
  );
}