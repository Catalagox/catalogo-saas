export default function supabaseLoader({ src, width, quality }) {
  if (src.includes('supabase.co')) {
    let optimizedUrl = src;
    
    // Cambia la ruta pública a la ruta de renderizado de Supabase
    if (src.includes('/storage/v1/object/public/')) {
      optimizedUrl = src.replace(
        '/storage/v1/object/public/',
        '/storage/v1/render/image/public/'
      );
    }
    
    return `${optimizedUrl}?width=${width}&quality=${quality || 75}`;
  }
  return src;
}