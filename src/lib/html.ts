// Limpa HTML do editor de texto: só negrito, itálico, parágrafos, quebras e listas, sem atributos.

const PERMITIDAS = new Set(['B', 'STRONG', 'I', 'EM', 'P', 'BR', 'UL', 'OL', 'LI', 'DIV'])

function limpar(no: Node, doc: Document): Node[] {
  if (no.nodeType === Node.TEXT_NODE) return [doc.createTextNode(no.textContent ?? '')]
  if (no.nodeType !== Node.ELEMENT_NODE) return []
  const el = no as Element
  const filhos = [...el.childNodes].flatMap((f) => limpar(f, doc))
  if (!PERMITIDAS.has(el.tagName))
    return el.tagName === 'SCRIPT' || el.tagName === 'STYLE' ? [] : filhos
  const novo = doc.createElement(el.tagName.toLowerCase())
  filhos.forEach((f) => novo.appendChild(f))
  return [novo]
}

/** HTML seguro para guardar e mostrar: remove tags fora da lista e todos os atributos (href, on*, style). */
export function sanitizarHtml(html: string): string {
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html')
  const saida = doc.createElement('div')
  ;[...doc.body.childNodes].flatMap((n) => limpar(n, doc)).forEach((n) => saida.appendChild(n))
  return saida.innerHTML
}
