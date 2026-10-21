// API de iframe do YouTube (https://developers.google.com/youtube/iframe_api_reference):
// carrega https://www.youtube.com/iframe_api uma vez e liga o player a um iframe que já existe
// (o src precisa de enablejsapi=1 e origin).

export const ESTADO_YT = { terminou: 0, tocando: 1, pausado: 2, carregando: 3 } as const

export type PlayerYT = {
  getCurrentTime: () => number
  getDuration: () => number
  getPlayerState: () => number
  destroy: () => void
}

type Eventos = {
  onReady?: (e: { target: PlayerYT }) => void
  onStateChange?: (e: { data: number; target: PlayerYT }) => void
}

type ApiYT = { Player: new (el: HTMLIFrameElement, op: { events: Eventos }) => PlayerYT }

declare global {
  interface Window {
    YT?: ApiYT
    onYouTubeIframeAPIReady?: () => void
  }
}

let carregando: Promise<ApiYT> | null = null

export function carregarApiYoutube(): Promise<ApiYT> {
  carregando ??= new Promise<ApiYT>((ok, falha) => {
    if (window.YT?.Player) return ok(window.YT)
    const anterior = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      anterior?.()
      if (window.YT) ok(window.YT)
    }
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    tag.async = true
    tag.onerror = () => {
      carregando = null
      falha(new Error('youtube'))
    }
    document.head.appendChild(tag)
  })
  return carregando
}

/** Endereço do iframe com a API ligada, começando no segundo pedido. */
export function linkComApi(id: string, inicio: number): string {
  const p = new URLSearchParams({
    enablejsapi: '1',
    origin: window.location.origin,
    rel: '0',
    playsinline: '1',
    iv_load_policy: '3',
  })
  if (inicio > 0) p.set('start', String(Math.floor(inicio)))
  return `https://www.youtube-nocookie.com/embed/${id}?${p}`
}
