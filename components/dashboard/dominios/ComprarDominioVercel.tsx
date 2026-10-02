import { ExternalLink, Globe2 } from "lucide-react";

const proveedores = [
  {
    nombre: "Hostinger",
    url: "https://www.hostinger.com/es/comprar-dominio",
  },
  {
    nombre: "Vercel",
    url: "https://vercel.com/domains",
  },
  {
    nombre: "GoDaddy",
    url: "https://www.godaddy.com/es/dominios",
  },
  {
    nombre: "Namecheap",
    url: "https://www.namecheap.com/domains/domain-name-search/",
  },
];

export default function ComprarDominioVercel() {
  return (
    <section
      aria-labelledby="comprar-dominio-titulo"
      className="mt-6 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-5 text-[var(--text-primary)] sm:p-6"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--border-card)] bg-[var(--bg-secondary)]">
          <Globe2 size={22} aria-hidden="true" />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            ¿Todavía no tienes un dominio?
          </p>

          <h2
            id="comprar-dominio-titulo"
            className="mt-2 text-lg font-bold sm:text-xl"
          >
            Encuentra el dominio para tu tienda
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)]">
            Busca un nombre disponible en alguno de estos proveedores.
            Después de comprarlo, regresa a Catalogox para conectarlo
            con tu tienda.
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {proveedores.map((proveedor) => (
          <a
            key={proveedor.nombre}
            href={proveedor.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Buscar un dominio en ${proveedor.nombre}, se abre en una pestaña nueva`}
            className="group flex min-h-24 items-center justify-between gap-3 rounded-xl border border-[var(--border-card)] bg-[var(--bg-secondary)] p-4 transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--bg-card-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
          >
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                {proveedor.nombre}
              </h3>

              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                Buscar dominio
              </p>
            </div>

            <ExternalLink
              size={18}
              aria-hidden="true"
              className="shrink-0 text-[var(--text-secondary)] transition-colors group-hover:text-[var(--text-primary)]"
            />
          </a>
        ))}
      </div>

      <div className="mt-5 border-t border-[var(--border-card)] pt-4">
        <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
          Los enlaces se abren en una pestaña nueva. La compra, el pago
          y la renovación se gestionan directamente con el proveedor
          que elijas.
        </p>

        <p className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)]">
          Antes de comprar, revisa el precio inicial y el costo de
          renovación del dominio.
        </p>
      </div>
    </section>
  );
}