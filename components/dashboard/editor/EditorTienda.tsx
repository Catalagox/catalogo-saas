"use client";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Loader2,
  Monitor,
  MousePointer2,
  Save,
  Settings2,
  Smartphone,
  Upload,
  X,
} from "lucide-react";
import EditorSidebar from "@/components/dashboard/editor/EditorSidebar";
import EditorPreview from "@/components/dashboard/editor/EditorPreview";
import {
  VERSION_CONFIG,
  SECCIONES_EDITOR,
  normalizarConfig,
  validarConfig,
} from "@/lib/tienda-diseno/config";
import type {
  ConfigDiseno,
  DatosRenderTienda,
  SeccionEditor,
} from "@/lib/tienda-diseno/types";
interface EditorTiendaProps {
  datosIniciales: DatosRenderTienda;
  borradorUpdatedAt: string;
}
type Operacion = "guardar" | "publicar" | null;
function esObjeto(
  valor: unknown,
): valor is Record<string, unknown> {
  return (
    valor !== null &&
    typeof valor === "object" &&
    !Array.isArray(valor)
  );
}
function firmaConfig(config: ConfigDiseno): string {
  return JSON.stringify(
    Object.entries(config).sort(([a], [b]) => a.localeCompare(b)),
  );
}
export default function EditorTienda({
  datosIniciales,
  borradorUpdatedAt,
}: EditorTiendaProps) {
  const [config, setConfig] = useState<ConfigDiseno>(() => ({
    ...datosIniciales.config,
  }));
  const [firmaGuardada, setFirmaGuardada] = useState(() =>
    firmaConfig(datosIniciales.config),
  );
  const [updatedAt, setUpdatedAt] = useState(borradorUpdatedAt);
  const [versionPublicada, setVersionPublicada] =
    useState<string | null>(null);
  const [operacion, setOperacion] = useState<Operacion>(null);
  const operacionRef = useRef<Operacion>(null);
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const subiendoImagenRef = useRef(false);
  const [aviso, setAviso] = useState<{
    tipo: "exito" | "error";
    texto: string;
  } | null>(null);
  const [dispositivo, setDispositivo] = useState<
    "escritorio" | "movil"
  >("escritorio");
  const [modoSeleccion, setModoSeleccion] = useState(true);
  const [seccionSeleccionada, setSeccionSeleccionada] =
    useState<SeccionEditor | null>(null);
  const [panelAbierto, setPanelAbierto] = useState(false);
  const [panelAmpliado, setPanelAmpliado] = useState(false);
  const [alturaArrastre, setAlturaArrastre] = useState<number | null>(null);
  const [arrastrando, setArrastrando] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const gestoRef = useRef<{
    pointerId: number;
    inicioY: number;
    inicioAltura: number;
    altura: number;
    movido: boolean;
  } | null>(null);
  const omitirClickRef = useRef(false);

  const limitesPanel = () => {
    const pantalla = window.visualViewport?.height ?? window.innerHeight;
    return {
      minimo: 64 + Math.max(0, window.innerHeight - document.documentElement.clientHeight),
      medio: Math.max(180, pantalla * 0.52),
      maximo: Math.max(200, pantalla * 0.68),
    };
  };

  const iniciarArrastre = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (subiendoImagenRef.current || event.button !== 0) return;
    const altura = panelRef.current?.getBoundingClientRect().height ?? 64;
    gestoRef.current = {
      pointerId: event.pointerId,
      inicioY: event.clientY,
      inicioAltura: altura,
      altura,
      movido: false,
    };
    omitirClickRef.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
    setArrastrando(true);
    setAlturaArrastre(altura);
  };

  const moverPanel = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const gesto = gestoRef.current;
    if (!gesto || gesto.pointerId !== event.pointerId) return;
    const desplazamiento = gesto.inicioY - event.clientY;
    if (Math.abs(desplazamiento) > 5) gesto.movido = true;
    const { minimo, maximo } = limitesPanel();
    gesto.altura = Math.min(maximo, Math.max(minimo, gesto.inicioAltura + desplazamiento));
    setAlturaArrastre(gesto.altura);
  };

  const terminarArrastre = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const gesto = gestoRef.current;
    if (!gesto || gesto.pointerId !== event.pointerId) return;
    gestoRef.current = null;
    setArrastrando(false);
    setAlturaArrastre(null);
    omitirClickRef.current = gesto.movido;
    if (gesto.movido) {
      const { minimo, medio, maximo } = limitesPanel();
      const destino = [minimo, medio, maximo].reduce((mejor, altura) =>
        Math.abs(altura - gesto.altura) < Math.abs(mejor - gesto.altura) ? altura : mejor,
      );
      setPanelAbierto(destino !== minimo);
      setPanelAmpliado(destino === maximo);
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const ocupado = operacion !== null;
  const bloqueado = ocupado || subiendoImagen;
  const hayCambios = firmaConfig(config) !== firmaGuardada;
  const publicadoEnEstaSesion = versionPublicada === updatedAt;
  const configValida = useMemo(
    () => validarConfig(config).valido,
    [config],
  );
  const datosPreview = useMemo<DatosRenderTienda>(
    () => ({
      ...datosIniciales,
      config: normalizarConfig(config, datosIniciales.config),
    }),
    [datosIniciales, config],
  );
  const cambiarEstadoSubida = useCallback((subiendo: boolean) => {
    subiendoImagenRef.current = subiendo;
    setSubiendoImagen(subiendo);
    if (subiendo) setAviso(null);
  }, []);
  useEffect(() => {
    if (!hayCambios && !bloqueado) return;
    const antesDeSalir = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", antesDeSalir);
    return () => {
      window.removeEventListener("beforeunload", antesDeSalir);
    };
  }, [hayCambios, bloqueado]);
  useEffect(() => {
    if (!panelAbierto) return;
    const cerrarConEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || subiendoImagenRef.current) {
        return;
      }
      setPanelAbierto(false);
    };
    window.addEventListener("keydown", cerrarConEscape);
    return () => {
      window.removeEventListener("keydown", cerrarConEscape);
    };
  }, [panelAbierto]);
  const cambiarConfig = (nuevaConfig: ConfigDiseno) => {
    if (operacionRef.current) return;
    // Recibe también la URL de la imagen al finalizar la subida.
    setConfig(nuevaConfig);
    setAviso(null);
  };
  const seleccionarSeccion = (seccion: SeccionEditor) => {
    if (subiendoImagenRef.current) return;
    setSeccionSeleccionada(seccion);
    setPanelAmpliado(false);
    setPanelAbierto(true);
  };
  const seleccionarDesdeSidebar = (
    seccion: SeccionEditor | null,
  ) => {
    if (subiendoImagenRef.current) return;
    setSeccionSeleccionada(seccion);
  };
  const cerrarPanel = () => {
    if (subiendoImagenRef.current) return;
    setPanelAbierto(false);
  };
  const alternarPanel = () => {
    if (subiendoImagenRef.current) return;
    setPanelAmpliado(false);
    setPanelAbierto((actual) => !actual);
  };
  const guardarBorrador = async () => {
    if (
      operacionRef.current ||
      subiendoImagenRef.current ||
      !hayCambios
    ) {
      return;
    }
    const validacion = validarConfig(config);
    if (!validacion.valido) {
      setAviso({
        tipo: "error",
        texto: "Revisa la configuración antes de guardar el borrador.",
      });
      return;
    }
    operacionRef.current = "guardar";
    setOperacion("guardar");
    setAviso(null);
    try {
      const response = await fetch("/api/tienda-diseno/borrador", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plantilla: datosIniciales.plantilla,
          config: validacion.config,
          version_config: VERSION_CONFIG,
          expectedUpdatedAt: updatedAt,
        }),
      });
      const resultado: unknown = await response.json();
      if (!response.ok) {
        throw new Error(
          esObjeto(resultado) && typeof resultado.error === "string"
            ? resultado.error
            : "No pudimos guardar el borrador.",
        );
      }
      if (!esObjeto(resultado) || !esObjeto(resultado.borrador)) {
        throw new Error(
          "La respuesta del servidor no es válida. Recarga el editor.",
        );
      }
      const borrador = resultado.borrador;
      if (
        borrador.catalogo_id !== datosIniciales.tienda.id ||
        borrador.plantilla !== datosIniciales.plantilla ||
        borrador.version_config !== VERSION_CONFIG ||
        typeof borrador.updated_at !== "string" ||
        !Number.isFinite(Date.parse(borrador.updated_at))
      ) {
        throw new Error(
          "No pudimos confirmar el guardado. Recarga el editor.",
        );
      }
      const configGuardada = validarConfig(borrador.config);
      if (!configGuardada.valido) {
        throw new Error(
          "La configuración guardada no es válida. Recarga el editor.",
        );
      }
      setConfig(configGuardada.config);
      setFirmaGuardada(firmaConfig(configGuardada.config));
      setUpdatedAt(borrador.updated_at);
      setAviso({
        tipo: "exito",
        texto: "Borrador guardado. Ya puedes publicar esta versión.",
      });
    } catch (error) {
      setAviso({
        tipo: "error",
        texto:
          error instanceof Error
            ? error.message
            : "No pudimos guardar el borrador.",
      });
    } finally {
      operacionRef.current = null;
      setOperacion(null);
    }
  };
  const publicarDiseno = async () => {
    if (
      operacionRef.current ||
      subiendoImagenRef.current ||
      hayCambios ||
      !configValida ||
      publicadoEnEstaSesion
    ) {
      return;
    }
    operacionRef.current = "publicar";
    setOperacion("publicar");
    setAviso(null);
    try {
      const response = await fetch("/api/tienda-diseno/publicar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedUpdatedAt: updatedAt,
        }),
      });
      const resultado: unknown = await response.json();
      if (!response.ok) {
        throw new Error(
          esObjeto(resultado) && typeof resultado.error === "string"
            ? resultado.error
            : "No pudimos publicar el diseño.",
        );
      }
      if (!esObjeto(resultado) || !esObjeto(resultado.publicado)) {
        throw new Error(
          "No pudimos confirmar la publicación. Recarga el editor.",
        );
      }
      const publicado = resultado.publicado;
      const configPublicada = validarConfig(publicado.config);
      if (
        publicado.catalogo_id !== datosIniciales.tienda.id ||
        publicado.plantilla !== datosIniciales.plantilla ||
        publicado.version_config !== VERSION_CONFIG ||
        typeof publicado.publicado_at !== "string" ||
        !Number.isFinite(Date.parse(publicado.publicado_at)) ||
        !configPublicada.valido
      ) {
        throw new Error(
          "La respuesta de publicación no es válida. Recarga el editor.",
        );
      }
      if (firmaConfig(configPublicada.config) !== firmaGuardada) {
        throw new Error(
          "El diseño publicado no coincide con tu borrador. Recarga el editor para comprobarlo.",
        );
      }
      setVersionPublicada(updatedAt);
      setAviso({
        tipo: "exito",
        texto: "Diseño publicado. Tu tienda ya utiliza esta versión.",
      });
    } catch (error) {
      setAviso({
        tipo: "error",
        texto:
          error instanceof Error
            ? error.message
            : "No pudimos publicar el diseño.",
      });
    } finally {
      operacionRef.current = null;
      setOperacion(null);
    }
  };
  const claseControl =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50";
  const textoEstado = subiendoImagen
    ? "Preparando y subiendo imagen..."
    : operacion === "guardar"
      ? "Guardando borrador..."
      : operacion === "publicar"
        ? "Publicando diseño..."
        : hayCambios
          ? "Cambios sin guardar"
          : publicadoEnEstaSesion
            ? "Diseño publicado"
            : "Borrador guardado";
  return (
    <div className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden bg-[var(--bg-main)] text-[var(--text-primary)]">
      {/* Barra superior fija */}
      <header className="z-20 shrink-0 border-b border-[var(--border-card)] bg-[var(--bg-secondary)]">
        <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-3 sm:px-4">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Link
              href="/dashboard/tienda-online"
              aria-label="Volver a Tienda online"
              aria-disabled={bloqueado}
              title={
                subiendoImagen
                  ? "Espera a que termine la subida"
                  : "Volver a Tienda online"
              }
              onClick={(event) => {
                if (
                  operacionRef.current ||
                  subiendoImagenRef.current
                ) {
                  event.preventDefault();
                  return;
                }
                if (
                  hayCambios &&
                  !window.confirm(
                    "Tienes cambios sin guardar. ¿Quieres salir del editor?",
                  )
                ) {
                  event.preventDefault();
                }
              }}
              className={`${claseControl} shrink-0 border-[var(--border-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)] ${
                bloqueado ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              <ArrowLeft size={18} aria-hidden="true" />
            </Link>
            <div className="min-w-0">
              <h1 className="truncate text-sm font-bold sm:text-base">
                {datosIniciales.tienda.nombre}
              </h1>
              <p
                role="status"
                className="text-xs text-[var(--text-secondary)]"
              >
                {textoEstado}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              disabled={bloqueado || !hayCambios || !configValida}
              title={
                subiendoImagen
                  ? "Espera a que termine la subida de la imagen"
                  : "Guardar los cambios del borrador"
              }
              onClick={() => void guardarBorrador()}
              className={`${claseControl} border-[var(--border-card)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]`}
            >
              {operacion === "guardar" ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <Save size={17} aria-hidden="true" />
              )}
              <span className="sm:hidden">
                {operacion === "guardar" ? "Guardando..." : "Guardar"}
              </span>
              <span className="hidden sm:inline">
                {operacion === "guardar"
                  ? "Guardando..."
                  : "Guardar borrador"}
              </span>
            </button>
            <button
              type="button"
              disabled={
                bloqueado ||
                hayCambios ||
                !configValida ||
                publicadoEnEstaSesion
              }
              title={
                subiendoImagen
                  ? "Espera a que termine la subida de la imagen"
                  : hayCambios
                    ? "Guarda el borrador antes de publicar"
                    : "Publicar el borrador guardado"
              }
              onClick={() => void publicarDiseno()}
              className={`${claseControl} border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-text-inverse)] hover:bg-[var(--color-primary-hover)]`}
            >
              {operacion === "publicar" ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <Upload size={17} aria-hidden="true" />
              )}
              {operacion === "publicar"
                ? "Publicando..."
                : publicadoEnEstaSesion && !hayCambios
                  ? "Publicado"
                  : "Publicar"}
            </button>
          </div>
        </div>
        {/* Controles de vista */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border-card)] px-3 py-2 sm:px-4">
          <button
            type="button"
            aria-controls="editor-panel-configuracion"
            aria-expanded={panelAbierto}
            disabled={subiendoImagen}
            onClick={alternarPanel}
            className={`${claseControl} border-[var(--border-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] lg:hidden`}
          >
            <Settings2 size={17} aria-hidden="true" />
            {panelAbierto ? "Ocultar opciones" : "Personalizar"}
          </button>
          <div className="flex items-center gap-2 lg:ml-auto">
            <div
              role="group"
              aria-label="Tamaño de la vista previa"
              className="flex gap-1"
            >
              {(
                [
                  {
                    valor: "escritorio",
                    nombre: "Escritorio",
                    Icono: Monitor,
                  },
                  {
                    valor: "movil",
                    nombre: "Móvil",
                    Icono: Smartphone,
                  },
                ] as const
              ).map(({ valor, nombre, Icono }) => (
                <button
                  key={valor}
                  type="button"
                  aria-label={`Vista de ${nombre}`}
                  aria-pressed={dispositivo === valor}
                  title={nombre}
                  onClick={() => setDispositivo(valor)}
                  className={`${claseControl} ${
                    dispositivo === valor
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-text-inverse)]"
                      : "border-[var(--border-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]"
                  }`}
                >
                  <Icono size={18} aria-hidden="true" />
                </button>
              ))}
            </div>
            <button
              type="button"
              aria-label="Seleccionar secciones desde la vista previa"
              aria-pressed={modoSeleccion}
              disabled={subiendoImagen}
              onClick={() => setModoSeleccion((actual) => !actual)}
              title="Seleccionar secciones desde la vista previa"
              className={`${claseControl} ${
                modoSeleccion
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-text-inverse)]"
                  : "border-[var(--border-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]"
              }`}
            >
              <MousePointer2 size={17} aria-hidden="true" />
              <span className="hidden sm:inline">Seleccionar</span>
            </button>
          </div>
        </div>
      </header>
      {aviso && (
        <div
          role={aviso.tipo === "error" ? "alert" : "status"}
          className="flex shrink-0 items-start justify-between gap-3 border-b border-[var(--border-card)] bg-[var(--bg-card)] px-4 py-3"
        >
          <p
            className={`text-sm ${
              aviso.tipo === "error"
                ? "text-[var(--color-danger)]"
                : "text-[var(--text-primary)]"
            }`}
          >
            {aviso.texto}
          </p>
          <button
            type="button"
            aria-label="Cerrar mensaje"
            onClick={() => setAviso(null)}
            className="shrink-0 rounded-lg p-1 text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]"
          >
            <X size={17} aria-hidden="true" />
          </button>
        </div>
      )}
      <div className="relative flex min-h-0 min-w-0 flex-1 overflow-hidden">
        {/* El panel móvil permanece asomado; escritorio mantiene el sidebar. */}
        <div
          ref={panelRef}
          id="editor-panel-configuracion"
          role="region"
          aria-label="Opciones de personalización"
          style={{
            "--panel-altura": alturaArrastre !== null
              ? `${alturaArrastre}px`
              : panelAbierto
                ? panelAmpliado ? "68dvh" : "52dvh"
                : "calc(64px + env(safe-area-inset-bottom, 0px))",
          } as CSSProperties}
          className={`fixed inset-x-0 bottom-0 z-[100] flex h-[var(--panel-altura)] w-full min-h-0 flex-col overflow-hidden rounded-t-2xl border-t border-[var(--border-card)] bg-[var(--bg-secondary)] shadow-[0_-8px_30px_rgba(0,0,0,0.15)] lg:static lg:z-auto lg:h-full lg:w-80 lg:shrink-0 lg:rounded-none lg:border-t-0 lg:shadow-none ${arrastrando ? "" : "transition-[height] duration-200 ease-out motion-reduce:transition-none"}`}
        >
          <div className="flex h-16 shrink-0 items-center gap-1 border-b border-[var(--border-card)] px-2 lg:hidden">
            <button
              type="button"
              aria-label="Volver a todas las secciones"
              disabled={!seccionSeleccionada || subiendoImagen || ocupado}
              onClick={() => seleccionarDesdeSidebar(null)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]"
            >
              <ChevronLeft size={19} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-controls="editor-contenido-opciones"
              aria-expanded={panelAbierto}
              aria-label="Arrastra para subir o bajar las opciones, o pulsa para abrirlas"
              disabled={subiendoImagen}
              onPointerDown={iniciarArrastre}
              onPointerMove={moverPanel}
              onPointerUp={terminarArrastre}
              onPointerCancel={terminarArrastre}
              onClick={() => {
                if (omitirClickRef.current) {
                  omitirClickRef.current = false;
                  return;
                }
                alternarPanel();
              }}
              onKeyDown={(event) => {
                if (event.key === "ArrowUp") {
                  event.preventDefault();
                  setPanelAbierto(true);
                  setPanelAmpliado(panelAbierto);
                } else if (event.key === "ArrowDown") {
                  event.preventDefault();
                  if (panelAmpliado) setPanelAmpliado(false);
                  else cerrarPanel();
                }
              }}
              className="flex h-full min-w-0 flex-1 touch-none select-none flex-col items-center justify-center gap-2 rounded-xl cursor-grab active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] disabled:opacity-50"
            >
              <span aria-hidden="true" className="h-1 w-11 rounded-full bg-[var(--text-secondary)] opacity-40" />
              <span className="max-w-full truncate text-xs font-semibold">
                {SECCIONES_EDITOR.find((item) => item.id === seccionSeleccionada)?.nombre ?? "Personalizar tienda"}
              </span>
            </button>
            <button
              type="button"
              disabled={subiendoImagen}
              onClick={alternarPanel}
              aria-label={panelAbierto ? "Bajar opciones y ver la tienda" : "Subir opciones"}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]"
            >
              {panelAbierto ? <ChevronDown size={19} aria-hidden="true" /> : <ChevronUp size={19} aria-hidden="true" />}
            </button>
          </div>
          <div
            id="editor-contenido-opciones"
            className={`min-h-0 flex-1 overflow-hidden pb-[env(safe-area-inset-bottom,0px)] [&>aside>div:first-child]:hidden lg:[&>aside>div:first-child]:block lg:pb-0 ${!panelAbierto && !arrastrando ? "invisible lg:visible" : ""}`}
          >
            <EditorSidebar
              catalogoId={datosIniciales.tienda.id}
              config={config}
              categorias={datosIniciales.categorias}
              plantilla={datosIniciales.plantilla}
              seccionSeleccionada={seccionSeleccionada}
              onSeleccionarSeccion={seleccionarDesdeSidebar}
              onCambiarConfig={cambiarConfig}
              disabled={ocupado}
              onSubiendoImagenChange={cambiarEstadoSubida}
            />
          </div>
        </div>
        {/* Vista previa: mantiene su tamaño al abrir las opciones */}
        <div className="min-h-0 min-w-0 flex-1 overflow-hidden pb-[calc(64px+env(safe-area-inset-bottom,0px))] lg:pb-0">
          <EditorPreview
            datos={datosPreview}
            dispositivo={dispositivo}
            modoSeleccion={modoSeleccion}
            seccionSeleccionada={seccionSeleccionada}
            onSeleccionarSeccion={seleccionarSeccion}
          />
        </div>
      </div>
    </div>
  );
}
