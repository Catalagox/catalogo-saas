
import type { Metadata } from "next";

const SITE_URL = "https://catalagox.com";
const SITE_NAME = "Catalagox";
const DEFAULT_IMAGE = "/og-image.png";

interface MetadataOptions {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
  imageAlt?: string;
  index?: boolean;
}

export function createPageMetadata({
  title,
  description,
  path,
  keywords = [],
  image = DEFAULT_IMAGE,
  imageAlt = "Catalagox - Plataforma para crear tiendas online",
  index = true,
}: MetadataOptions): Metadata {
  const url = new URL(path, SITE_URL).toString();

  return {
    metadataBase: new URL(SITE_URL),

    title,
    description,

    keywords: [
      "Catalagox",
      "tienda online",
      "catálogo digital",
      "vender por Internet",
      ...keywords,
    ],

    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,

    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },

    alternates: {
      canonical: url,
    },

    robots: {
      index,
      follow: true,
      googleBot: {
        index,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    openGraph: {
      type: "website",
      locale: "es_AR",
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },

    icons: {
      icon: [
        { url: "/favicon.ico" },
        {
          url: "/favicon-96x96.png",
          sizes: "96x96",
          type: "image/png",
        },
      ],
      apple: "/apple-touch-icon.png",
    },

    manifest: "/site.webmanifest",
  };
}
