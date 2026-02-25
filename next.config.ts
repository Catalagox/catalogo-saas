import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Optimización de imágenes
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Permite imágenes de cualquier dominio
      },
    ],
  },

  // Cabeceras HTTP para seguridad
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "geolocation=(), microphone=()" },
        ],
      },
    ];
  },

  // Reescrituras de rutas
  async rewrites() {
    return [
      {
        source: "/menu/:slug",
        destination: "/app/menu/[slug]",
      },
    ];
  },

  // Validación estricta de TypeScript
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;