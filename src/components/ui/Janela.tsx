import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  titulo: string
  aoFechar: () => void
  rodape: ReactNode
  children: ReactNode
  rotuloFechar?: string
  /** Janela larga (960 px) para conteúdo com listas, como a refeição. */
  larga?: boolean
}

/** Janelas abertas, da mais antiga para a de cima (uma janela pode abrir outra). */
const pilha: symbol[] = []

const FOCAVEL = 'input, select, textarea, button, a[href], [tabindex]:not([tabindex="-1"])'

/** Fecha com Esc, trava a rolagem da página e devolve o foco a quem abriu. */
function useComportamento(aoFechar: () => void, painel: React.RefObject<HTMLDivElement | null>) {
  const fechar = useRef(aoFechar)
  useEffect(() => {
    fechar.current = aoFechar
  })
  useEffect(() => {
    const eu = Symbol('janela')
    pilha.push(eu)
    const antes = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const corpo = painel.current?.querySelector<HTMLElement>('[data-corpo]')
    ;(corpo?.querySelector<HTMLElement>(FOCAVEL) ?? painel.current)?.focus()
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && pilha.at(-1) === eu) fechar.current()
    }
    document.addEventListener('keydown', tecla)
    return () => {
      document.removeEventListener('keydown', tecla)
      pilha.splice(pilha.indexOf(eu), 1)
      document.body.style.overflow = overflow
      antes?.focus()
    }
  }, [painel])
}

/**
 * Janela grande centralizada (760 px) para criar e editar: fundo escurecido, título, X,
 * conteúdo que rola e rodapé fixo. No celular ocupa a tela inteira. Fecha com X, Esc ou clique fora.
 */
export function Janela({
  titulo,
  aoFechar,
  rodape,
  children,
  rotuloFechar = 'Fechar',
  larga = false,
}: Props) {
  const largura = larga ? 'sm:max-w-[960px]' : 'sm:max-w-[760px]'
  const id = useId()
  const painel = useRef<HTMLDivElement>(null)
  useComportamento(aoFechar, painel)
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-tinta/45 sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) aoFechar()
      }}
    >
      <div
        ref={painel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={id}
        tabIndex={-1}
        className={`flex h-full w-full flex-col bg-white font-sistema text-tinta outline-none sm:h-auto sm:max-h-[90vh] ${largura} sm:rounded-[20px] sm:shadow-[0_24px_60px_rgb(15_42_36/0.25)]`}
      >
        <header className="flex items-center justify-between gap-4 border-b border-[#ECEFED] px-6 py-4">
          <h2 id={id} className="text-[19px] font-bold text-verde-escuro">
            {titulo}
          </h2>
          <button
            type="button"
            onClick={aoFechar}
            aria-label={rotuloFechar}
            className="grid size-9 place-items-center rounded-full text-suave hover:bg-trilho"
          >
            <svg viewBox="0 0 16 16" aria-hidden className="size-4">
              <path
                d="m3.5 3.5 9 9m0-9-9 9"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>
        <div data-corpo className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>
        <footer className="flex justify-end gap-2 border-t border-[#ECEFED] px-6 py-4">
          {rodape}
        </footer>
      </div>
    </div>,
    document.body,
  )
}
