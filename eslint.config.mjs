// eslint.config.ts
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  // Configuración recomendada de Next.js para rendimiento web
  ...nextVitals,
  // Configuración recomendada para TypeScript en Next.js
  ...nextTs,
  // Ignorar archivos/carpetas que no necesitamos revisar
  globalIgnores([
    ".next/**",         // Carpeta generada por Next.js
    "out/**",           // Carpeta de export estático
    "build/**",         // Carpeta de builds antiguos
    "node_modules/**",  // Dependencias
    "dist/**",          // Carpeta de distribución si existe
    "next-env.d.ts",    // Archivo generado automáticamente
    "*.config.js",      // Archivos de configuración (opcional)
  ]),
]);