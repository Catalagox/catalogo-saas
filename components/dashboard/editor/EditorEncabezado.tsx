"use client";
import { useId, useRef, useState, type ChangeEvent } from "react";
import { Loader2 } from "lucide-react";
import imageCompression from "browser-image-compression";
import { supabase } from "@/lib/supabaseClient";
import EditorNavegacion from "@/components/dashboard/editor/EditorNavegacion";
import {
  esColorValido,
  normalizarConfig,
} from "@/lib/tienda-diseno/config";
import type {
  ConfigDiseno,
  ConfigEncabezado,
  CategoriaTienda,
} from "@/lib/tienda-diseno/types";
interface Props {
  catalogoId?: string;
  logo?: string | null;
  onLogoActualizado?: (logo: string) => void;
  onSubiendoImagenChange?: (subiendo: boolean) => void;
  categorias?: CategoriaTienda[];
  config: ConfigDiseno;
  onCambiarConfig: (config: ConfigDiseno) => void;
  disabled?: boolean;
}
const CLASE_INPUT =
  "min-h-11 w-full rounded-xl border border-[var(--border-card)] bg-[var(--bg-tertiary)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-60";
type CampoNumero = {
  [K in keyof ConfigEncabezado]:
    ConfigEncabezado[K] extends number ? K : never;
}[keyof ConfigEncabezado];
type CampoBooleano = {
  [K in keyof ConfigEncabezado]:
    ConfigEncabezado[K] extends boolean ? K : never;
}[keyof ConfigEncabezado];
type CampoColor = {
  [K in keyof ConfigEncabezado]:
    K extends `color_${string}` ? K : never;
}[keyof ConfigEncabezado];
type CampoSeleccion =
  | "posicion"
  | "alineacion_marca"
  | "sombra"
  | "fuente_nombre"
  | "peso_nombre"
  | "fuente_navegacion"
  | "peso_navegacion";
const FUENTES = [
  { value: "heredar", nombre: "Fuente general de la tienda" },
  { value: "sistema", nombre: "Moderna — sistema" },
  { value: "serif", nombre: "Clásica — serif" },
  { value: "monoespaciada", nombre: "Monoespaciada" },
] as const;
const PESOS = [
  { value: 400, nombre: "Normal" },
  { value: 500, nombre: "Medio" },
  { value: 600, nombre: "Seminegrita" },
  { value: 700, nombre: "Negrita" },
  { value: 800, nombre: "Extra negrita" },
  { value: 900, nombre: "Máximo" },
] as const;
function ControlNumero({
  nombre,
  value,
  min,
  max,
  onChange,
}: {
  nombre: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  const id = useId();
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="flex items-center justify-between gap-3 text-sm"
      >
        <span>{nombre}</span>
        <span className="shrink-0 text-[var(--text-secondary)]">
          {value} px
        </span>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(event) =>
          onChange(Number(event.target.value))
        }
        className="h-8 w-full cursor-pointer accent-[var(--color-primary)]"
      />
    </div>
  );
}
function ControlColor({
  nombre,
  value,
  onChange,
}: {
  nombre: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const id = useId();
  const hex = value.trim();
  const valido = esColorValido(value);
  const colorNativo = /^#[\da-f]{6}([\da-f]{2})?$/i.test(hex)
    ? hex.slice(0, 7)
    : /^#[\da-f]{3,4}$/i.test(hex)
      ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
      : "#ffffff";
  const cambiarPaleta = (color: string) => {
    const alpha = /^#[\da-f]{8}$/i.test(hex)
      ? hex.slice(7)
      : /^#[\da-f]{4}$/i.test(hex)
        ? `${hex[4]}${hex[4]}`
        : "";
    onChange(`${color}${alpha}`);
  };
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm">
        {nombre}
      </label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          aria-label={`Elegir ${nombre.toLowerCase()}`}
          value={colorNativo}
          onChange={(event) =>
            cambiarPaleta(event.target.value)
          }
          className="h-11 w-11 shrink-0 cursor-pointer rounded-lg"
        />
        <input
          id={id}
          type="text"
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          spellCheck={false}
          autoComplete="off"
          aria-invalid={!valido}
          aria-describedby={!valido ? `${id}-error` : undefined}
          className={`${CLASE_INPUT} min-w-0 font-mono`}
        />
      </div>
      {!valido && (
        <p
          id={`${id}-error`}
          className="text-xs text-[var(--color-danger)]"
        >
          Introduce un color válido, como #ffffff o transparent.
        </p>
      )}
    </div>
  );
}
function ControlBooleano({
  nombre,
  checked,
  onChange,
}: {
  nombre: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center justify-between gap-3 text-sm">
      <span>{nombre}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) =>
          onChange(event.target.checked)
        }
        className="h-5 w-5 shrink-0 accent-[var(--color-primary)]"
      />
    </label>
  );
}
function ControlSeleccion<T extends string | number>({
  nombre,
  value,
  opciones,
  onChange,
}: {
  nombre: string;
  value: T;
  opciones: ReadonlyArray<{
    value: T;
    nombre: string;
  }>;
  onChange: (value: T) => void;
}) {
  const id = useId();
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm">
        {nombre}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => {
          const opcion = opciones.find(
            (item) => String(item.value) === event.target.value,
          );
          if (opcion) onChange(opcion.value);
        }}
        className={CLASE_INPUT}
      >
        {opciones.map((opcion) => (
          <option
            key={String(opcion.value)}
            value={opcion.value}
          >
            {opcion.nombre}
          </option>
        ))}
      </select>
    </div>
  );
}
export default function EditorEncabezado({
  catalogoId,
  logo,
  onLogoActualizado,
  onSubiendoImagenChange,
  categorias = [],
  config,
  onCambiarConfig,
  disabled = false,
}: Props) {
  const id = useId();
  const [subiendoLogo, setSubiendoLogo] = useState(false);
  const [mensajeLogo, setMensajeLogo] = useState("");
  const [errorLogo, setErrorLogo] = useState("");
  const subidaRef = useRef(false);

  const subirLogo = async (event: ChangeEvent<HTMLInputElement>) => {
    const archivo = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!archivo || disabled || subidaRef.current || !catalogoId) return;
    setMensajeLogo("");
    setErrorLogo("");
    if (!["image/png", "image/jpeg", "image/webp"].includes(archivo.type)) {
      setErrorLogo("Selecciona una imagen PNG, JPG o WebP.");
      return;
    }
    if (archivo.size > 5 * 1024 * 1024) {
      setErrorLogo("La imagen debe pesar como máximo 5 MB.");
      return;
    }
    subidaRef.current = true;
    setSubiendoLogo(true);
    onSubiendoImagenChange?.(true);
    try {
      const { data: { user }, error: errorUsuario } = await supabase.auth.getUser();
      if (errorUsuario || !user) throw new Error("Inicia sesión nuevamente para subir el logo.");
      const { data: tienda, error: errorTienda } = await supabase
        .from("catalogos").select("id, logo")
        .eq("id", catalogoId).eq("user_id", user.id).single();
      if (errorTienda || !tienda) throw new Error("No pudimos comprobar tu tienda.");
      const comprimido = await imageCompression(archivo, {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 500,
        useWebWorker: true,
        fileType: archivo.type,
      });
      const extension = comprimido.type === "image/png" ? "png"
        : comprimido.type === "image/webp" ? "webp" : "jpg";
      const ruta = `${user.id}/${crypto.randomUUID()}.${extension}`;
      const { error: errorSubida } = await supabase.storage.from("logos")
        .upload(ruta, comprimido, { upsert: false, contentType: comprimido.type });
      if (errorSubida) throw errorSubida;
      const { data: imagen } = supabase.storage.from("logos").getPublicUrl(ruta);
      let consulta = supabase.from("catalogos").update({ logo: imagen.publicUrl })
        .eq("id", catalogoId).eq("user_id", user.id);
      consulta = tienda.logo === null ? consulta.is("logo", null) : consulta.eq("logo", tienda.logo);
      const { data: guardado, error: errorGuardado } = await consulta.select("id, logo").maybeSingle();
      if (errorGuardado) throw errorGuardado;
      if (!guardado || guardado.logo !== imagen.publicUrl) {
        throw new Error("El logo cambió desde otra ventana. Recarga el editor e inténtalo otra vez.");
      }
      onLogoActualizado?.(imagen.publicUrl);
      setMensajeLogo("Logo actualizado correctamente.");
      // Conserva el archivo anterior: otras ventanas pueden estar utilizándolo.
    } catch (error: unknown) {
      setErrorLogo(error instanceof Error ? error.message
        : typeof error === "object" && error !== null && "message" in error
          ? String(error.message) : "No pudimos subir el logo. Inténtalo nuevamente.");
    } finally {
      subidaRef.current = false;
      setSubiendoLogo(false);
      onSubiendoImagenChange?.(false);
    }
  };

  const valores = normalizarConfig(config).encabezado;
  // Conserva los valores que se están escribiendo.
  // La vista previa utiliza la configuración normalizada.
  const encabezado: ConfigEncabezado = {
    ...valores,
    ...config.encabezado,
  };
  const cambiar = (cambios: Partial<ConfigEncabezado>) => {
    if (disabled) return;
    onCambiarConfig({
      ...config,
      encabezado: {
        ...encabezado,
        ...cambios,
      },
    });
  };
  const numero = (
    campo: CampoNumero,
    nombre: string,
    min: number,
    max: number,
  ) => (
    <ControlNumero
      key={campo}
      nombre={nombre}
      value={valores[campo]}
      min={min}
      max={max}
      onChange={(value) => cambiar({ [campo]: value })}
    />
  );
  const color = (campo: CampoColor, nombre: string) => (
    <ControlColor
      key={campo}
      nombre={nombre}
      value={encabezado[campo]}
      onChange={(value) => cambiar({ [campo]: value })}
    />
  );
  const booleano = (
    campo: CampoBooleano,
    nombre: string,
  ) => (
    <ControlBooleano
      key={campo}
      nombre={nombre}
      checked={valores[campo]}
      onChange={(value) => cambiar({ [campo]: value })}
    />
  );
  function seleccion<K extends CampoSeleccion>(
    campo: K,
    nombre: string,
    opciones: ReadonlyArray<{
      value: ConfigEncabezado[K];
      nombre: string;
    }>,
  ) {
    return (
      <ControlSeleccion
        nombre={nombre}
        value={valores[campo]}
        opciones={opciones}
        onChange={(value) => cambiar({ [campo]: value })}
      />
    );
  }
  const claseGrupo =
    "rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] p-4";
  const claseTitulo =
    "cursor-pointer text-sm font-bold";
  return (
    <fieldset
      disabled={disabled || subiendoLogo}
      className="space-y-4"
    >
      <legend className="sr-only">
        Configuración del encabezado
      </legend>
      <details open className={claseGrupo}>
        <summary className={claseTitulo}>
          Distribución y tamaño
        </summary>
        <div className="mt-4 space-y-4">
          {seleccion("posicion", "Posición del encabezado", [
            { value: "fijo", nombre: "Permanecer visible al desplazarse" },
            { value: "normal", nombre: "Desplazarse con la página" },
          ])}
          {seleccion("alineacion_marca", "Posición de la marca", [
            { value: "izquierda", nombre: "Izquierda" },
            { value: "centro", nombre: "Centro" },
          ])}
          {numero("alto_escritorio", "Altura en computadora", 56, 180)}
          {numero("alto_movil", "Altura en teléfono", 56, 140)}
          {numero("ancho_contenido", "Ancho máximo del contenido", 960, 1920)}
          {numero("padding_horizontal", "Espacio lateral en computadora", 0, 96)}
          {numero("padding_horizontal_movil", "Espacio lateral en teléfono", 0, 32)}
          <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
            La altura es un mínimo. El encabezado puede crecer
            si el logo o los accesos necesitan más espacio.
          </p>
        </div>
      </details>
      <details className={claseGrupo}>
        <summary className={claseTitulo}>
          Colores, borde y sombra
        </summary>
        <div className="mt-4 space-y-4">
          {color("color_fondo", "Fondo del encabezado")}
          {color("color_texto", "Texto general del encabezado")}
          {color("color_borde", "Color del borde inferior")}
          {numero("grosor_borde", "Grosor del borde inferior", 0, 8)}
          {seleccion("sombra", "Sombra al desplazarse", [
            { value: "ninguna", nombre: "Sin sombra" },
            { value: "suave", nombre: "Suave" },
            { value: "media", nombre: "Media" },
          ])}
        </div>
      </details>
      <details className={claseGrupo}>
        <summary className={claseTitulo}>
          Logo
        </summary>
        <div className="mt-4 space-y-4">
          {logo && (
            <div className="flex min-h-24 items-center justify-center rounded-xl border border-[var(--border-card)] bg-[var(--bg-tertiary)] p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo} alt="Logo actual de tu tienda" className="max-h-24 max-w-full object-contain" />
            </div>
          )}
          <label htmlFor={`${id}-logo`} className="block text-sm font-semibold">
            {logo ? "Cambiar logotipo" : "Subir logotipo"}
          </label>
          <input
            id={`${id}-logo`}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            disabled={disabled || subiendoLogo || !catalogoId || !onLogoActualizado}
            onChange={(event) => void subirLogo(event)}
            className="block w-full min-w-0 text-xs text-[var(--text-secondary)] file:mr-2 file:rounded-lg file:border-0 file:bg-[var(--color-primary)] file:px-3 file:py-3 file:font-semibold file:text-[var(--color-text-inverse)] disabled:opacity-50"
          />
          {subiendoLogo && (
            <p role="status" className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
              <Loader2 size={16} className="animate-spin" aria-hidden="true" /> Preparando y subiendo logo…
            </p>
          )}
          {mensajeLogo && <p role="status" className="text-xs text-[var(--text-primary)]">{mensajeLogo}</p>}
          {errorLogo && <p role="alert" className="text-xs text-[var(--color-danger)]">{errorLogo}</p>}
          <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
            PNG, JPG o WebP, hasta 5 MB. El logo se actualiza al subirlo, también en tu tienda pública.
          </p>
          {booleano("mostrar_logo", "Mostrar logo")}
          {numero("ancho_logo", "Ancho en computadora", 40, 360)}
          {numero("alto_logo", "Altura en computadora", 24, 140)}
          {numero("ancho_logo_movil", "Ancho en teléfono", 40, 200)}
          {numero("alto_logo_movil", "Altura en teléfono", 24, 100)}
          <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
            El logo conserva sus proporciones. Ajusta su tamaño
            para computadora y teléfono con estos controles.
          </p>
        </div>
      </details>
      <details className={claseGrupo}>
        <summary className={claseTitulo}>
          Nombre y tipografía
        </summary>
        <div className="mt-4 space-y-4">
          {booleano("mostrar_nombre", "Mostrar nombre junto al logo")}
          {seleccion("fuente_nombre", "Tipo de letra", FUENTES)}
          {seleccion("peso_nombre", "Grosor de la letra", PESOS)}
          {numero("tamano_nombre", "Tamaño en computadora", 12, 48)}
          {numero("tamano_nombre_movil", "Tamaño en teléfono", 12, 32)}
          {color("color_nombre", "Color del nombre")}
          <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
            Si no tienes un logo cargado y “Mostrar logo” está
            activado, se muestra el nombre como respaldo.
          </p>
        </div>
      </details>
      <details className={claseGrupo}>
        <summary className={claseTitulo}>
          Accesos e iconos
        </summary>
        <div className="mt-4 space-y-4">
          {booleano("mostrar_menu", "Mostrar menú en teléfono y tablet")}
          {booleano("mostrar_buscador", "Mostrar buscador")}
          {booleano("mostrar_carrito", "Mostrar carrito")}
          {booleano("mostrar_pedidos", "Mostrar mis pedidos")}
          {numero("tamano_iconos", "Tamaño en computadora", 16, 36)}
          {numero("tamano_iconos_movil", "Tamaño en teléfono", 16, 32)}
          {numero("separacion_iconos", "Separación entre accesos", 0, 32)}
          {color("color_menu", "Color del icono del menú")}
          {color("color_busqueda", "Color del icono de búsqueda")}
          {color("color_carrito", "Color del carrito")}
          {color("color_pedidos", "Color de mis pedidos")}
        </div>
      </details>
      <details className={claseGrupo}>
        <summary className={claseTitulo}>
          Barra de búsqueda
        </summary>
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <label
              htmlFor={`${id}-buscador`}
              className="block text-sm"
            >
              Texto de la barra
            </label>
            <input
              id={`${id}-buscador`}
              type="text"
              value={encabezado.texto_buscador}
              maxLength={80}
              placeholder="Buscar productos..."
              onChange={(event) =>
                cambiar({
                  texto_buscador: event.target.value,
                })
              }
              className={CLASE_INPUT}
            />
          </div>
          {color("color_fondo_buscador", "Fondo de la barra")}
          {color("color_texto_buscador", "Color del texto")}
          {color("color_borde_buscador", "Color del borde")}
          {numero("grosor_borde_buscador", "Grosor del borde", 0, 6)}
          {numero("radio_buscador", "Redondeado de las esquinas", 0, 40)}
          <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
            Estos ajustes corresponden a la barra del encabezado.
            En teléfono se utiliza el icono de búsqueda.
          </p>
        </div>
      </details>
      <details className={claseGrupo}>
        <summary className={claseTitulo}>
          Estilo de la navegación
        </summary>
        <div className="mt-4 space-y-4">
          {booleano("mostrar_navegacion", "Mostrar navegación")}
          {color("color_fondo_navegacion", "Fondo de la barra")}
          {color("color_texto_navegacion", "Color de las letras")}
          {seleccion("fuente_navegacion", "Tipo de letra", FUENTES)}
          {seleccion("peso_navegacion", "Grosor de la letra", PESOS)}
          {numero("tamano_navegacion", "Tamaño de la letra", 12, 24)}
          {numero("separacion_navegacion", "Separación entre enlaces", 8, 64)}
          {color("color_borde_navegacion", "Color del borde")}
          {numero("grosor_borde_navegacion", "Grosor del borde", 0, 8)}
          <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
            La barra muestra los enlaces configurados en el menú.
            En teléfono se puede desplazar horizontalmente.
          </p>
        </div>
      </details>
      <EditorNavegacion
        catalogoId={catalogoId}
        categorias={categorias}
        config={config}
        onCambiarConfig={onCambiarConfig}
        disabled={disabled}
      />
    </fieldset>
  );
}
