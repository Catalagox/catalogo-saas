import type {
  ConfigCatalogo,
  ConfigTitulosCategoria,
} from "./types";

type Objeto = Record<string, unknown>;
type Validador = (valor: unknown) => boolean;

function esObjeto(valor: unknown): valor is Objeto {
  return (
    typeof valor === "object" &&
    valor !== null &&
    !Array.isArray(valor)
  );
}

function entero(
  valor: unknown,
  minimo: number,
  maximo: number,
): boolean {
  return (
    typeof valor === "number" &&
    Number.isInteger(valor) &&
    valor >= minimo &&
    valor <= maximo
  );
}

const booleano: Validador = (valor) =>
  typeof valor === "boolean";

function opciones(
  valores: readonly (string | number)[],
): Validador {
  return (valor) =>
    valores.some((opcion) => opcion === valor);
}

const TITULOS_INICIALES: ConfigTitulosCategoria = {
  mostrar: true,
  mostrar_cantidad: false,

  color: "#111827",
  fuente: "heredar",

  tamano: 32,
  tamano_movil: 28,
  peso: 700,

  alineacion: "izquierda",
  separacion_inferior: 24,
};

const CATALOGO_INICIAL: ConfigCatalogo = {
  heredar_fondo: true,
  color_fondo: "#fefefe",

  ancho_completo: true,
  ancho_maximo: 1280,

  margen_horizontal: 40,
  margen_horizontal_movil: 16,

  padding_superior: 40,
  padding_inferior: 40,

  columnas_escritorio: 4,
  columnas_tablet: 2,
  columnas_movil: 1,

  titulos: TITULOS_INICIALES,
};

export function crearConfigCatalogo(
  esColorValido: (valor: unknown) => valor is string,
) {
  const reglas: Record<
    Exclude<keyof ConfigCatalogo, "titulos">,
    Validador
  > = {
    heredar_fondo: booleano,
    color_fondo: esColorValido,

    ancho_completo: booleano,
    ancho_maximo: (valor) => entero(valor, 640, 1920),

    margen_horizontal: (valor) => entero(valor, 0, 120),
    margen_horizontal_movil: (valor) => entero(valor, 0, 40),

    padding_superior: (valor) => entero(valor, 0, 160),
    padding_inferior: (valor) => entero(valor, 0, 160),

    columnas_escritorio: opciones([2, 3, 4, 5]),
    columnas_tablet: opciones([1, 2, 3]),
    columnas_movil: opciones([1, 2]),
  };

  const reglasTitulos: Record<
    keyof ConfigTitulosCategoria,
    Validador
  > = {
    mostrar: booleano,
    mostrar_cantidad: booleano,

    color: esColorValido,
    fuente: opciones([
      "heredar",
      "sistema",
      "serif",
      "monoespaciada",
    ]),

    tamano: (valor) => entero(valor, 12, 80),
    tamano_movil: (valor) => entero(valor, 12, 56),
    peso: opciones([400, 500, 600, 700, 800, 900]),

    alineacion: opciones(["izquierda", "centro", "derecha"]),
    separacion_inferior: (valor) => entero(valor, 0, 96),
  };

  function normalizar(
    valor: unknown,
    respaldo?: unknown,
  ): ConfigCatalogo {
    const origen: Objeto = esObjeto(valor) ? valor : {};
    const base: Objeto = esObjeto(respaldo) ? respaldo : {};

    const resultado: ConfigCatalogo = {
      ...CATALOGO_INICIAL,
      titulos: { ...TITULOS_INICIALES },
    };

    function elegir<T>(
      clave: string,
      valida: Validador,
      inicial: T,
      datos: Objeto,
      datosRespaldo: Objeto,
    ): T {
      const candidato = valida(datos[clave])
        ? datos[clave]
        : valida(datosRespaldo[clave])
          ? datosRespaldo[clave]
          : inicial;

      return (
        typeof candidato === "string"
          ? candidato.trim()
          : candidato
      ) as T;
    }

    function asignar<K extends Exclude<keyof ConfigCatalogo, "titulos">>(
      campo: K,
    ) {
      resultado[campo] = elegir(
        campo,
        reglas[campo],
        CATALOGO_INICIAL[campo],
        origen,
        base,
      );
    }

    for (
      const campo of Object.keys(reglas) as Array<
        Exclude<keyof ConfigCatalogo, "titulos">
      >
    ) {
      asignar(campo);
    }

    const titulos: Objeto = esObjeto(origen.titulos)
      ? origen.titulos
      : {};

    const titulosRespaldo: Objeto = esObjeto(base.titulos)
      ? base.titulos
      : {};

    function asignarTitulo<K extends keyof ConfigTitulosCategoria>(
      campo: K,
    ) {
      resultado.titulos[campo] = elegir(
        campo,
        reglasTitulos[campo],
        TITULOS_INICIALES[campo],
        titulos,
        titulosRespaldo,
      );
    }

    for (
      const campo of Object.keys(reglasTitulos) as Array<
        keyof ConfigTitulosCategoria
      >
    ) {
      asignarTitulo(campo);
    }

    return resultado;
  }

  function validar(valor: unknown): string[] {
    // Los diseños anteriores no tienen este grupo.
    if (valor === undefined) return [];

    if (!esObjeto(valor)) {
      return ["El grupo catalogo debe ser un objeto."];
    }

    const errores: string[] = [];

    for (
      const campo of Object.keys(reglas) as Array<
        Exclude<keyof ConfigCatalogo, "titulos">
      >
    ) {
      // Los campos ausentes se completan al normalizar.
      if (valor[campo] === undefined) continue;

      if (!reglas[campo](valor[campo])) {
        errores.push(`El campo catalogo.${campo} no es válido.`);
      }
    }

    if (valor.titulos !== undefined) {
      if (!esObjeto(valor.titulos)) {
        errores.push("El grupo catalogo.titulos debe ser un objeto.");
      } else {
        const titulos = valor.titulos;

        for (
          const campo of Object.keys(reglasTitulos) as Array<
            keyof ConfigTitulosCategoria
          >
        ) {
          if (titulos[campo] === undefined) continue;

          if (!reglasTitulos[campo](titulos[campo])) {
            errores.push(
              `El campo catalogo.titulos.${campo} no es válido.`,
            );
          }
        }
      }
    }

    return errores;
  }

  return { normalizar, validar };
}