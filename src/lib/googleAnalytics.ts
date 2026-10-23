// Google Analytics 4 (propriedade "Comunidade ORA - Site", conta hora.adm). Mesmas regras do pixel da
// Meta: só nas páginas públicas, nunca em /app, e quem recusa os cookies fica sem nada.

export const GA4 = 'G-ZPVDQXQG6V'

type Gtag = (...args: unknown[]) => void
declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: Gtag
  }
}

/** Nome do evento da Meta no padrão do Google. */
const NOMES: Record<string, string> = {
  PageView: 'page_view',
  Lead: 'generate_lead',
  InitiateCheckout: 'begin_checkout',
  Purchase: 'purchase',
}

/** Carrega o gtag uma vez. A visita vai à mão (sem o endereço com ?pedido=), por isso send_page_view desligado. */
function carregar(): Gtag {
  if (window.gtag) return window.gtag
  window.dataLayer = window.dataLayer ?? []
  const fila = window.dataLayer
  const gtag: Gtag = function () {
    // o gtag.js lê o objeto arguments, não um array
    // eslint-disable-next-line prefer-rest-params
    fila.push(arguments)
  }
  window.gtag = gtag
  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA4}`
  document.head.appendChild(s)
  gtag('js', new Date())
  gtag('config', GA4, { send_page_view: false })
  return gtag
}

/** Manda ao Google o mesmo evento que vai para a Meta. Na compra, o id do pedido evita contar em dobro. */
export function eventoGoogle(nome: string, dados?: Record<string, unknown>, id?: string): void {
  const evento = NOMES[nome]
  if (!evento) return
  const extra: Record<string, unknown> = { ...dados }
  if (evento === 'page_view') {
    extra.page_location = window.location.origin + window.location.pathname
    extra.page_title = document.title
  }
  if (evento === 'purchase' && id) extra.transaction_id = id
  carregar()('event', evento, extra)
}
