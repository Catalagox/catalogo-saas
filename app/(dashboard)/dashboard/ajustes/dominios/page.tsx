"use client";

import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
} from "react";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Clipboard,
  ExternalLink,
  Globe2,
  Loader2,
  RefreshCw,
  Server,
  ShieldCheck,
} from "lucide-react";

import { PageHeader } from "@/components/dashboard/PageHeader";
import { supabase } from "@/lib/supabaseClient";

type EstadoDominio =
  | "pendiente"
  | "configurando"
  | "verificando"
  | "activo"
  | "error";

interface VerificacionVercel {
  type?: string;
  domain?: string;
  value?: string;
  reason?: string;
}

interface ConfiguracionVercel {
  verification?: VerificacionVercel[];

  conexion?: {
    verification?: VerificacionVercel[];
  };

  verificacion?: {
    verification?: VerificacionVercel[];
  };

  [key: string]: unknown;
}

interface Dominio {
  id: string;
  dominio: string;
  estado: EstadoDominio;
  es_principal: boolean;
  verificado: boolean;
  configuracion_vercel: ConfiguracionVercel | null;
  ultimo_error: string | null;
  verificado_en: string | null;
  created_at: string;
  updated_at: string;
}

interface ApiDominioResponse {
  ok?: boolean;
  verified?: boolean;
  message?: string;
  error?: string;
  dominio?: Dominio;
}

function normalizarDominio(valor: string) {
  return valor
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .split("/")[0]
    .split("?")[0]
    .split("#")[0]
    .replace(/\.$/, "");
}

function obtenerVerificaciones(
  configuracion: ConfiguracionVercel | null,
): VerificacionVercel[] {
  if (!configuracion) {
    return [];
  }

  if (Array.isArray(configuracion.verification)) {
    return configuracion.verification;
  }

  if (
    configuracion.verificacion &&
    Array.isArray(configuracion.verificacion.verification)
  ) {
    return configuracion.verificacion.verification;
  }

  if (
    configuracion.conexion &&
    Array.isArray(configuracion.conexion.verification)
  ) {
    return configuracion.conexion.verification;
  }

  return [];
}

function EstadoBadge({
  dominio,
}: {
  dominio: Dominio;
}) {
  if (dominio.verificado || dominio.estado === "activo") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-500">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Activo
      </span>
    );
  }

  if (dominio.estado === "error") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-500">
        <AlertCircle className="h-3.5 w-3.5" />
        Error
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-500">
      <RefreshCw className="h-3.5 w-3.5" />
      Pendiente de verificación
    </span>
  );
}

function FilaDns({
  tipo,
  nombre,
  valor,
  onCopiar,
  copiado,
}: {
  tipo: string;
  nombre: string;
  valor: string;
  onCopiar: (valor: string) => void;
  copiado: string;
}) {
  return (
    <div className="grid gap-3 border-b border-[var(--border-card)] px-4 py-4 last:border-b-0 md:grid-cols-[90px_1fr_2fr_auto] md:items-center">
      <div>
        <span className="inline-flex rounded-lg border border-[var(--border-card)] bg-[var(--bg-tertiary)] px-2.5 py-1 font-mono text-xs font-bold text-[var(--text-primary)]">
          {tipo}
        </span>
      </div>

      <div>
        <p className="mb-1 text-xs text-[var(--text-secondary)] md:hidden">
          Nombre
        </p>

        <code className="break-all text-sm text-[var(--text-primary)]">
          {nombre}
        </code>
      </div>

      <div>
        <p className="mb-1 text-xs text-[var(--text-secondary)] md:hidden">
          Valor
        </p>

        <code className="break-all text-sm text-[var(--text-primary)]">
          {valor}
        </code>
      </div>

      <button
        type="button"
        onClick={() => onCopiar(valor)}
        aria-label={`Copiar ${valor}`}
        className="inline-flex w-fit items-center gap-2 rounded-lg border border-[var(--border-card)] bg-[var(--bg-tertiary)] px-3 py-2 text-xs font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]"
      >
        {copiado === valor ? (
          <>
            <Check className="h-4 w-4 text-emerald-500" />
            Copiado
          </>
        ) : (
          <>
            <Clipboard className="h-4 w-4" />
            Copiar
          </>
        )}
      </button>
    </div>
  );
}

export default function DominiosPage() {
  const [dominioInput, setDominioInput] = useState("");
  const [dominioGuardado, setDominioGuardado] =
    useState<Dominio | null>(null);

  const [loading, setLoading] = useState(true);
  const [conectando, setConectando] = useState(false);
  const [verificando, setVerificando] = useState(false);

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [copiado, setCopiado] = useState("");

  const cargarDominio = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError(
          "No pudimos comprobar tu sesión. Inicia sesión nuevamente.",
        );
        return;
      }

      const { data: catalogo, error: catalogoError } =
        await supabase
          .from("catalogos")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

      if (catalogoError) {
        throw catalogoError;
      }

      if (!catalogo) {
        setError(
          "No encontramos una tienda asociada con tu cuenta.",
        );
        return;
      }

      const { data, error: dominioError } = await supabase
        .from("dominios")
        .select(`
          id,
          dominio,
          estado,
          es_principal,
          verificado,
          configuracion_vercel,
          ultimo_error,
          verificado_en,
          created_at,
          updated_at
        `)
        .eq("catalogo_id", catalogo.id)
        .limit(1)
        .maybeSingle();

      if (dominioError) {
        throw dominioError;
      }

      setDominioGuardado((data as Dominio | null) ?? null);
    } catch (cargarError) {
      console.error(
        "Error cargando el dominio:",
        cargarError,
      );

      setError(
        "No pudimos cargar la configuración del dominio.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void cargarDominio();
  }, [cargarDominio]);

  const conectarDominio = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const dominioLimpio = normalizarDominio(dominioInput);

    if (!dominioLimpio) {
      setError("Escribe el dominio que deseas conectar.");
      return;
    }

    try {
      setConectando(true);
      setError("");
      setMensaje("");

      const response = await fetch("/api/dominios/conectar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dominio: dominioLimpio,
        }),
      });

      const data =
        (await response.json()) as ApiDominioResponse;

      if (!response.ok || !data.ok || !data.dominio) {
        setError(
          data.error ||
            "No pudimos conectar el dominio.",
        );
        return;
      }

      setDominioGuardado(data.dominio);
      setDominioInput("");
      setMensaje(
        data.message ||
          "Dominio agregado correctamente.",
      );
    } catch (conectarError) {
      console.error(
        "Error conectando el dominio:",
        conectarError,
      );

      setError(
        "Ocurrió un problema de conexión. Inténtalo nuevamente.",
      );
    } finally {
      setConectando(false);
    }
  };

  const verificarDominio = async () => {
    if (!dominioGuardado) {
      return;
    }

    try {
      setVerificando(true);
      setError("");
      setMensaje("");

      const response = await fetch("/api/dominios/verificar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dominio: dominioGuardado.dominio,
        }),
      });

      const data =
        (await response.json()) as ApiDominioResponse;

      if (!response.ok || !data.ok) {
        setError(
          data.error ||
            "No pudimos verificar el dominio.",
        );

        await cargarDominio();
        return;
      }

      if (data.dominio) {
        setDominioGuardado(data.dominio);
      }

      setMensaje(
        data.message ||
          "Verificación completada.",
      );
    } catch (verificarError) {
      console.error(
        "Error verificando dominio:",
        verificarError,
      );

      setError(
        "Ocurrió un problema al verificar el dominio.",
      );
    } finally {
      setVerificando(false);
    }
  };

  const copiarValor = async (valor: string) => {
    try {
      await navigator.clipboard.writeText(valor);
      setCopiado(valor);

      window.setTimeout(() => {
        setCopiado("");
      }, 2000);
    } catch {
      setError(
        "No se pudo copiar el valor automáticamente.",
      );
    }
  };

  const verificaciones = obtenerVerificaciones(
    dominioGuardado?.configuracion_vercel ?? null,
  );

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-20 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)]" />

          <div className="h-64 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)]" />

          <div className="h-48 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)]" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        title="Dominio personalizado"
        category="Configuración"
        icon={Globe2}
        showBackButton
      />

      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
              <Globe2 className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)]">
                Usa tu propio dominio
              </h2>

              <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                Conecta un dominio que ya compraste para que tus
                clientes visiten tu tienda desde una dirección como{" "}
                <span className="font-medium text-[var(--text-primary)]">
                  mitienda.com
                </span>
                .
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {mensaje && (
          <div
            role="status"
            className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-500"
          >
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            <p>{mensaje}</p>
          </div>
        )}

        {!dominioGuardado ? (
          <form
            onSubmit={conectarDominio}
            className="space-y-5 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-5 sm:p-6"
          >
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)]">
                Conectar dominio
              </h2>

              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Escribe el dominio sin rutas adicionales.
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="dominio"
                className="text-sm font-medium text-[var(--text-primary)]"
              >
                Dominio
              </label>

              <div className="flex overflow-hidden rounded-xl border border-[var(--border-card)] bg-[var(--bg-tertiary)] focus-within:border-[var(--color-primary)]">
                <span className="flex items-center border-r border-[var(--border-card)] px-3 text-sm text-[var(--text-secondary)]">
                  https://
                </span>

                <input
                  id="dominio"
                  type="text"
                  inputMode="url"
                  autoComplete="url"
                  placeholder="mitienda.com"
                  value={dominioInput}
                  onChange={(event) =>
                    setDominioInput(event.target.value)
                  }
                  disabled={conectando}
                  className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)]/60"
                />
              </div>

              <p className="text-xs text-[var(--text-secondary)]">
                No escribas páginas adicionales como /productos.
              </p>
            </div>

            <button
              type="submit"
              disabled={conectando}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-bold text-[var(--color-text-inverse)] transition hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {conectando ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Conectando...
                </>
              ) : (
                <>
                  <Globe2 className="h-4 w-4" />
                  Conectar dominio
                </>
              )}
            </button>
          </form>
        ) : (
          <>
            <div className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-5 sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="mb-3">
                    <EstadoBadge dominio={dominioGuardado} />
                  </div>

                  <p className="break-all text-xl font-bold text-[var(--text-primary)]">
                    {dominioGuardado.dominio}
                  </p>

                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    Dominio principal de tu tienda
                  </p>
                </div>

                {dominioGuardado.verificado ? (
                  <a
                    href={`https://${dominioGuardado.dominio}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[var(--border-card)] bg-[var(--bg-tertiary)] px-4 py-2.5 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-[var(--bg-card-hover)]"
                  >
                    Visitar tienda
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={verificarDominio}
                    disabled={verificando}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-bold text-[var(--color-text-inverse)] transition hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {verificando ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Verificando...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4" />
                        Verificar dominio
                      </>
                    )}
                  </button>
                )}
              </div>

              {dominioGuardado.ultimo_error &&
                !dominioGuardado.verificado && (
                  <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-500">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                    <p>{dominioGuardado.ultimo_error}</p>
                  </div>
                )}
            </div>

            {!dominioGuardado.verificado && (
              <div className="overflow-hidden rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)]">
                <div className="border-b border-[var(--border-card)] p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <Server className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-primary)]" />

                    <div>
                      <h2 className="font-bold text-[var(--text-primary)]">
                        Configura los registros DNS
                      </h2>

                      <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                        Entra al proveedor donde compraste el
                        dominio y agrega los siguientes registros.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="hidden grid-cols-[90px_1fr_2fr_auto] gap-3 border-b border-[var(--border-card)] bg-[var(--bg-tertiary)] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)] md:grid">
                  <span>Tipo</span>
                  <span>Nombre</span>
                  <span>Valor</span>
                  <span>Acción</span>
                </div>

                {verificaciones.length > 0 ? (
                  verificaciones.map((registro, index) => (
                    <FilaDns
                      key={`${registro.type}-${registro.domain}-${index}`}
                      tipo={registro.type || "TXT"}
                      nombre={registro.domain || "@"}
                      valor={registro.value || ""}
                      onCopiar={copiarValor}
                      copiado={copiado}
                    />
                  ))
                ) : (
                  <>
                    <FilaDns
                      tipo="A"
                      nombre="@"
                      valor="76.76.21.21"
                      onCopiar={copiarValor}
                      copiado={copiado}
                    />

                    <FilaDns
                      tipo="CNAME"
                      nombre="www"
                      valor="cname.vercel-dns.com"
                      onCopiar={copiarValor}
                      copiado={copiado}
                    />
                  </>
                )}

                <div className="p-5 sm:p-6">
                  <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                    Los cambios DNS pueden tardar desde algunos
                    minutos hasta 48 horas. Cuando termines,
                    vuelve aquí y pulsa{" "}
                    <span className="font-semibold text-[var(--text-primary)]">
                      Verificar dominio
                    </span>
                    .
                  </p>
                </div>
              </div>
            )}

            {dominioGuardado.verificado && (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-500">
                    <ShieldCheck className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="font-bold text-emerald-500">
                      Dominio conectado y protegido
                    </h2>

                    <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                      Tu dominio está verificado. Vercel
                      administrará automáticamente el certificado
                      de seguridad HTTPS.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}