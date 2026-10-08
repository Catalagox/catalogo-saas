// lib/tienda-diseno/server.ts

import "server-only";

import { createClient } from "@/lib/supabase/server";
import {
  configDesdeCatalogo,
  esPlantillaId,
  normalizarConfig,
  VERSION_CONFIG,
} from "./config";
import type { ConfigDiseno, PlantillaId } from "./types";

export interface DisenoParaRenderizar {
  plantilla: PlantillaId;
  config: ConfigDiseno;
  version_config: number;
  origen: "publicado" | "catalogo";
}

function esObjeto(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

/**
 * Solo para la tienda pública.
 * Nunca consulta la tabla de borradores.
 *
 * catalogoActual permite conservar la apariencia antigua
 * si todavía no existe una fila de diseño publicado.
 */
export async function obtenerDisenoPublicado(
  catalogoId: string,
  catalogoActual: unknown,
): Promise<DisenoParaRenderizar> {
  if (!catalogoId) {
    throw new Error("No se recibió el identificador de la tienda.");
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tienda_diseno")
    .select("plantilla, config, version_config")
    .eq("catalogo_id", catalogoId)
    .maybeSingle();

  if (error) {
    console.error("Error cargando el diseño publicado:", error);
    throw new Error("No pudimos cargar el diseño de la tienda.");
  }

  const respaldo = configDesdeCatalogo(catalogoActual);

  if (!data) {
    return {
      plantilla: "clasica",
      config: respaldo,
      version_config: VERSION_CONFIG,
      origen: "catalogo",
    };
  }

  if (!esPlantillaId(data.plantilla)) {
    throw new Error(
      "La plantilla publicada no está disponible en esta versión.",
    );
  }

  if (data.version_config !== VERSION_CONFIG) {
    throw new Error(
      "La versión de configuración publicada no está disponible.",
    );
  }

  if (!esObjeto(data.config)) {
    throw new Error("La configuración publicada no es válida.");
  }

  return {
    plantilla: data.plantilla,
    config: normalizarConfig(data.config, respaldo),
    version_config: data.version_config,
    origen: "publicado",
  };
}