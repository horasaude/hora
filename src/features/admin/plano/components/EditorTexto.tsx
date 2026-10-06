import { useEffect, useId, useRef } from 'react'
import { sanitizarHtml } from '@/lib/html'
import { tReceitas } from '../textos2'

const BOTOES = [
  { cmd: 'bold', rotulo: tReceitas.negrito, icone: <b>B</b> },
  { cmd: 'insertUnorderedList', rotulo: tReceitas.lista, icone: <span>•</span> },
  { cmd: 'insertOrderedList', rotulo: tReceitas.listaNumerada, icone: <span>1.</span> },
] as const

/** Editor simples (negrito e listas). Guarda HTML já limpo. */
export function EditorTexto({
  rotulo,
  valor,
  aoMudar,
}: {
  rotulo: string
  valor: string
  aoMudar: (html: string) => void
}) {
  const id = useId()
  const area = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (area.current && area.current.innerHTML !== valor)
      area.current.innerHTML = sanitizarHtml(valor)
    // só no início: depois o conteúdo é da própria área
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const aplicar = (cmd: string) => {
    area.current?.focus()
    document.execCommand(cmd)
    aoMudar(sanitizarHtml(area.current?.innerHTML ?? ''))
  }
  return (
    <div className="flex flex-col gap-1 text-sm">
      <span id={id} className="font-medium">
        {rotulo}
      </span>
      <div className="overflow-hidden rounded-xl border border-linha bg-white focus-within:border-ora">
        <div className="flex gap-1 border-b border-[#F0F2F1] px-2 py-1.5">
          {BOTOES.map((b) => (
            <button
              key={b.cmd}
              type="button"
              aria-label={b.rotulo}
              title={b.rotulo}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => aplicar(b.cmd)}
              className="grid size-8 place-items-center rounded-lg text-[13px] text-verde-escuro hover:bg-trilho"
            >
              {b.icone}
            </button>
          ))}
        </div>
        <div
          ref={area}
          role="textbox"
          aria-multiline="true"
          aria-labelledby={id}
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => aoMudar(sanitizarHtml(e.currentTarget.innerHTML))}
          className="texto-rico min-h-36 px-4 py-3 text-[14px] leading-relaxed outline-none"
        />
      </div>
    </div>
  )
}
