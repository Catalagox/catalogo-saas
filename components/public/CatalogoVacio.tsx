import IlustracionTienda from "./IlustracionTienda";

export default function CatalogoVacio() {
  return (
    <section
      aria-labelledby="catalogo-vacio-titulo"
      className="mx-auto w-full px-4 py-10 sm:px-6 lg:px-8"
      style={{
        maxWidth: "var(--tienda-content-width, 1280px)",
      }}
    >
      <div className="mb-6">
        <h2
          id="catalogo-vacio-titulo"
          className="font-bold text-[var(--color-text)]"
          style={{
            fontSize: "var(--tienda-title-size, 28px)",
          }}
        >
          Nuestra colección
        </h2>

        <p className="mt-2 text-sm text-[var(--color-text)] opacity-70">
          Estamos preparando nuestros productos. Pronto encontrarás
          aquí nuestra colección.
        </p>
      </div>

      <div
        className="grid grid-cols-2 md:grid-cols-4"
        style={{
          gap: "var(--tienda-product-gap, 24px)",
        }}
      >
        {[1, 2, 3, 4].map((numero) => (
          <div
            key={numero}
            aria-hidden="true"
            className="overflow-hidden border-solid"
            style={{
              backgroundColor: "var(--color-card, #ffffff)",
              borderRadius: "var(--tienda-card-radius, 16px)",
              borderWidth: "var(--tienda-card-border-width, 1px)",
              borderColor: "var(--tienda-card-border-color, #e5e7eb)",
              boxShadow: "var(--tienda-card-shadow, none)",
            }}
          >
            <div className="aspect-square">
              <IlustracionTienda variante="producto" />
            </div>

            <div className="space-y-3 p-4">
              <div className="h-2.5 w-3/4 rounded-full bg-[var(--color-text)] opacity-15" />

              <div className="h-2 w-1/2 rounded-full bg-[var(--color-text)] opacity-10" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}