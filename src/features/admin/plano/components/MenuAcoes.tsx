import { useEffect, useRef, useState } from 'react'
import { textos } from '../textos'

export type Acao = { nome: string; aoEscolher: () => void; perigo?: boolean }

/** Menu de três pontinhos com as ações da linha; fecha com clique fora ou Esc. */
export function MenuAcoes({ nome, acoes }: { nome: string; acoes: Acao[] }) {
  const [aberto, setAberto] = useState(false)
  const caixa = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!aberto) return
    const fora = (e: MouseEvent) => {
      if (!caixa.current?.contains(e.target as Node)) setAberto(false)
    }
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAberto(false)
    }
    document.addEventListener('mousedown', fora)
    document.addEventListener('keydown', tecla)
    return () => {
      document.removeEventListener('mousedown', fora)
      document.removeEventListener('keydown', tecla)
    }
  }, [aberto])
  return (
    <div ref={caixa} className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        aria-label={textos.acoes(nome)}
        aria-haspopup="menu"
        aria-expanded={aberto}
        onClick={() => setAberto((a) => !a)}
        className="grid size-8 place-items-center rounded-full text-suave hover:bg-trilho"
      >
        <svg viewBox="0 0 16 16" aria-hidden className="size-4" fill="currentColor">
          <circle cx="3" cy="8" r="1.5" />
          <circle cx="8" cy="8" r="1.5" />
          <circle cx="13" cy="8" r="1.5" />
        </svg>
      </button>
      {aberto && (
        <ul
          role="menu"
          className="absolute top-9 right-0 z-30 min-w-40 rounded-xl border border-[#ECEFED] bg-white py-1 shadow-painel"
        >
          {acoes.map((a) => (
            <li key={a.nome}>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setAberto(false)
                  a.aoEscolher()
                }}
                className={`w-full px-4 py-2 text-left text-[13px] hover:bg-trilho ${a.perigo ? 'text-terracota-escuro' : 'text-tinta'}`}
              >
                {a.nome}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
