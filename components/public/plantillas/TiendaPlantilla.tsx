"use client";

import PlantillaClasica from "./PlantillaClasica";
import PlantillaModerna from "./PlantillaModerna";

import type {
  CategoriaTienda,
  ConfigDiseno,
  PlantillaId,
} from "@/lib/tienda-diseno/types";

interface TiendaPlantillaProps {
  plantilla: PlantillaId;
  categorias: CategoriaTienda[];
  config: ConfigDiseno;
  countryCode: string;
  rutaBase: string;
  onTrackCategoria?: (categoriaId: string) => void | Promise<void>;
}

export default function TiendaPlantilla({
  plantilla,
  ...props
}: TiendaPlantillaProps) {
  switch (plantilla) {
    case "clasica":
      return <PlantillaClasica {...props} />;

    case "moderna":
      return <PlantillaModerna {...props} />;

    default: {
      const plantillaNoImplementada: never = plantilla;

      throw new Error(
        `La plantilla "${plantillaNoImplementada}" no está implementada.`,
      );
    }
  }
}