import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    // Permite que Next.js optimice imágenes de Supabase
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co", // Los dos asteriscos (**) permiten cualquier proyecto de Supabase
        port: "",
        pathname: "/storage/v1/object/public/**", // Ruta estándar del Storage de Supabase
      },
    ],
    // Formatos modernos de imagen automáticos (los convierte según el navegador)
    formats: ["image/avif", "image/webp"],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "geolocation=(), microphone=()" },
        ],
      },
    ];
  },

  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;