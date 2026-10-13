import { useEffect, useId, useRef, useState } from 'react'
import { sanitizarHtml, textoParaHtml } from '@/lib/html'
import { BarraEditor } from './BarraEditor'
import { BarraLink } from './BarraLink'

type Props = {
  rotulo: string
  valor: string
  aoMudar: (html: string) => void
  /** Também itálico e link (descrição da aula). */
  completo?: boolean
}

/** Editor simples: negrito e listas; completo também tem itálico e link. Guarda HTML já limpo. */
export function EditorTexto({ rotulo, valor, aoMudar, completo = false }: Props) {
  const id = useId()
  const area = useRef<HTMLDivElement>(null)
  const selecao = useRef<Range | null>(null)
  const [linkAberto, setLinkAberto] = useState(false)
  const limpar = (html: string) => sanitizarHtml(html, { links: completo })
  useEffect(() => {
    if (area.current && area.current.innerHTML !== valor)
      area.current.innerHTML = limpar(textoParaHtml(valor))
    // só no início: depois o conteúdo é da própria área
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const aplicar = (cmd: string, arg?: string) => {
    area.current?.focus()
    const s = window.getSelection()
    if (selecao.current && s) {
      s.removeAllRanges()
      s.addRange(selecao.current)
      selecao.current = null
    }
    document.execCommand(cmd, false, arg)
    aoMudar(limpar(area.current?.innerHTML ?? ''))
  }
  const guardarSelecao = () => {
    const s = window.getSelection()
    selecao.current = s && s.rangeCount ? s.getRangeAt(0).cloneRange() : null
  }
  return (
    <div className="flex flex-col gap-1 text-sm">
      <span id={id} className="font-medium">
        {rotulo}
      </span>
      <div className="overflow-hidden rounded-xl border border-linha bg-white focus-within:border-ora">
        <BarraEditor
          completo={completo}
          linkAberto={linkAberto}
          aoComando={aplicar}
          aoAbrirLink={guardarSelecao}
          aoAlternarLink={() => setLinkAberto(!linkAberto)}
        />
        {linkAberto && (
          <BarraLink
            aoAplicar={(url) => {
              setLinkAberto(false)
              aplicar('createLink', url)
            }}
          />
        )}
        <div
          ref={area}
          role="textbox"
          aria-multiline="true"
          aria-labelledby={id}
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => aoMudar(limpar(e.currentTarget.innerHTML))}
          className="texto-rico min-h-36 px-4 py-3 text-[14px] leading-relaxed outline-none"
        />
      </div>
    </div>
  )
}
