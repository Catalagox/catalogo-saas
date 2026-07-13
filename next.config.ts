import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        // 🔥 CORRECCIÓN: Reemplaza esto con tu dominio real de Supabase 
        // O usa '*.supabase.co' si quieres permitir subdominios de Supabase.
        hostname: "*.supabase.co", 
      },
    ],
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