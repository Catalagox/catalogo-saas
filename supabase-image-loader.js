const projectId = 'yhlqooguctlzorinsxde'

export default function supabaseLoader({ src, width, quality }) {
  if (src.includes('supabase.co')) {
    return `${src}?width=${width}&quality=${quality || 75}`
  }
  return src
}