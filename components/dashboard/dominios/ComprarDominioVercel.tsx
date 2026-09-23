import { ExternalLink } from "lucide-react";

export default function ComprarDominioVercel() {
  return (
    <section
      aria-labelledby="comprar-dominio-vercel-titulo"
      className="mt-6 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-5 sm:p-6"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">
            ¿Todavía no tienes un dominio?
          </p>

          <h2
            id="comprar-dominio-vercel-titulo"
            className="mt-2 text-lg font-bold text-[var(--text-primary)]"
          >
            Compra tu dominio en Vercel
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
            Busca un nombre disponible para tu negocio,
            cómpralo directamente en Vercel y luego regresa a
            Catalagox para conectarlo con tu tienda.
          </p>

          <p className="mt-3 text-xs leading-relaxed text-[var(--text-secondary)] opacity-80">
            La compra y administración del dominio se realizan
            directamente con Vercel. Catalagox no interviene en
            el pago ni en la renovación.
          </p>
        </div>

        <a
          href="https://vercel.com/domains"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Buscar un dominio en Vercel, se abre en una pestaña nueva"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[var(--border-card)] bg-[var(--bg-secondary)] px-5 py-3 text-sm font-bold text-[var(--text-primary)] transition hover:border-[var(--color-primary)] hover:bg-[var(--bg-card-hover)] active:scale-[0.98]"
        >
          Buscar dominio en Vercel

          <ExternalLink
            size={16}
            aria-hidden="true"
          />
        </a>
      </div>
    </section>
  );
}