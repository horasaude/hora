// Pixel da Meta (conjunto de dados "Comunidade ORA - Site", BM da Comunidade Ora). Só nas páginas
// públicas (vendas, checkout e obrigada); nunca dentro de /app, onde há dado de saúde.
// Liga desde a primeira visita; quem recusa no aviso de cookies fica com o pixel desligado.

export const PIXEL_META = '2586011068587810'
const RECUSA = 'ora:cookies-recusados'

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void
  queue: unknown[]
  loaded: boolean
  version: string
  push: unknown
}
declare global {
  interface Window {
    fbq?: Fbq
    _fbq?: Fbq
  }
}

export function cookiesRecusados(): boolean {
  try {
    return localStorage.getItem(RECUSA) === '1'
  } catch {
    return false
  }
}

export function recusarCookies(): void {
  try {
    localStorage.setItem(RECUSA, '1')
  } catch {
    // sem armazenamento, a recusa vale só nesta visita
  }
  window.fbq?.('consent', 'revoke')
}

/** Carrega o script da Meta uma vez (o trecho oficial, sem o noscript). */
function carregar(): Fbq {
  if (window.fbq) return window.fbq
  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args)
    else fbq.queue.push(args)
  } as Fbq
  fbq.push = fbq
  fbq.loaded = true
  fbq.version = '2.0'
  fbq.queue = []
  window.fbq = fbq
  window._fbq = fbq
  const s = document.createElement('script')
  s.async = true
  s.src = 'https://connect.facebook.net/en_US/fbevents.js'
  document.head.appendChild(s)
  fbq('init', PIXEL_META)
  return fbq
}

/** Evento padrão (PageView, Lead, InitiateCheckout, Purchase). O id serve para não contar em dobro
 * quando a API de Conversões mandar o mesmo evento pelo servidor. */
export function eventoMeta(nome: string, dados?: Record<string, unknown>, id?: string): void {
  if (typeof window === 'undefined' || cookiesRecusados()) return
  try {
    carregar()('track', nome, dados ?? {}, id ? { eventID: id } : undefined)
  } catch {
    // o pixel nunca pode atrapalhar a venda
  }
}
