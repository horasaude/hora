/**
 * Link de incorporação (iframe) a partir do link colado: YouTube, Vimeo e Google Drive.
 * Outros endereços devolvem null (sem prévia).
 */
export function linkDeIncorporacao(entrada: string): string | null {
  let url: URL
  try {
    url = new URL(entrada.trim())
  } catch {
    return null
  }
  if (url.protocol !== 'https:') return null
  const host = url.hostname.replace(/^www\.|^m\./, '')
  const partes = url.pathname.split('/').filter(Boolean)
  const id = (valor: string | null | undefined) =>
    valor && /^[\w-]{6,}$/.test(valor) ? valor : null

  if (host === 'youtu.be') return youtube(id(partes[0]))
  if (host === 'youtube-nocookie.com' && partes[0] === 'embed') return youtube(id(partes[1]))
  if (host === 'youtube.com') {
    if (partes[0] === 'watch') return youtube(id(url.searchParams.get('v')))
    if (['shorts', 'embed', 'live'].includes(partes[0] ?? '')) return youtube(id(partes[1]))
    return null
  }
  if (host === 'vimeo.com') {
    const numero = partes.find((p) => /^\d+$/.test(p))
    return numero ? `https://player.vimeo.com/video/${numero}` : null
  }
  if (host === 'player.vimeo.com' && partes[0] === 'video' && /^\d+$/.test(partes[1] ?? '')) {
    return `https://player.vimeo.com/video/${partes[1]}`
  }
  if (host === 'drive.google.com' && partes[0] === 'file' && partes[1] === 'd') {
    const arquivo = id(partes[2])
    return arquivo ? `https://drive.google.com/file/d/${arquivo}/preview` : null
  }
  return null
}

function youtube(id: string | null): string | null {
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
}
