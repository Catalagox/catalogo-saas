export default function supabaseLoader({ src, width, quality }) {
  // Imágenes locales de public y otros formatos.
  if (!/^https?:\/\//i.test(src)) {
    return src;
  }

  let url;

  try {
    url = new URL(src);
  } catch {
    return src;
  }

  const esSupabase =
    url.hostname.endsWith(".supabase.co");

  if (!esSupabase) {
    return src;
  }

  const rutaPublica = "/storage/v1/object/public/";
  const rutaOptimizada = "/storage/v1/render/image/public/";

  if (url.pathname.startsWith(rutaPublica)) {
    url.pathname = url.pathname.replace(
      rutaPublica,
      rutaOptimizada,
    );
  }

  // Solo transformamos imágenes públicas de Storage.
  if (!url.pathname.startsWith(rutaOptimizada)) {
    return src;
  }

  url.searchParams.set("width", String(width));
  url.searchParams.set("quality", String(quality ?? 75));

  return url.toString();
}