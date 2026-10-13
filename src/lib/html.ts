// Limpa HTML do editor de texto: só negrito, itálico, parágrafos, quebras e listas, sem atributos.
// Com links: true, mantém também links http(s) e mailto, que abrem em outra aba.

const PERMITIDAS = new Set(['B', 'STRONG', 'I', 'EM', 'P', 'BR', 'UL', 'OL', 'LI', 'DIV'])
const LINK_SEGURO = /^(https?:\/\/|mailto:)/i

type Opcoes = { links?: boolean }

function limpar(no: Node, doc: Document, o: Opcoes): Node[] {
  if (no.nodeType === Node.TEXT_NODE) return [doc.createTextNode(no.textContent ?? '')]
  if (no.nodeType !== Node.ELEMENT_NODE) return []
  const el = no as Element
  const filhos = [...el.childNodes].flatMap((f) => limpar(f, doc, o))
  const href = el.getAttribute('href')?.trim() ?? ''
  if (el.tagName === 'A' && o.links && LINK_SEGURO.test(href)) {
    const a = doc.createElement('a')
    a.setAttribute('href', href)
    a.setAttribute('target', '_blank')
    a.setAttribute('rel', 'noopener noreferrer')
    filhos.forEach((f) => a.appendChild(f))
    return [a]
  }
  if (!PERMITIDAS.has(el.tagName))
    return el.tagName === 'SCRIPT' || el.tagName === 'STYLE' ? [] : filhos
  const novo = doc.createElement(el.tagName.toLowerCase())
  filhos.forEach((f) => novo.appendChild(f))
  return [novo]
}

/** HTML seguro para guardar e mostrar: remove tags fora da lista e todos os atributos (on*, style). */
export function sanitizarHtml(html: string, o: Opcoes = {}): string {
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html')
  const saida = doc.createElement('div')
  ;[...doc.body.childNodes].flatMap((n) => limpar(n, doc, o)).forEach((n) => saida.appendChild(n))
  return saida.innerHTML
}

/** Texto antigo, sem marcação: vira HTML com as quebras de linha mantidas. */
export function textoParaHtml(texto: string): string {
  if (/<[a-z][\s\S]*>/i.test(texto)) return texto
  return texto
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('\n', '<br>')
}
