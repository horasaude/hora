import { useEffect, useRef, useState } from 'react'
import { textos } from '../textos'
import { CirculoPosicao } from './CirculoPosicao'

export type Linha = { posicao: number; apelido: string; eu: boolean; valor: string }

function LinhaItem({ l }: { l: Linha }) {
  return (
    <div
      className={`flex min-h-14 items-center gap-3 rounded-[16px] border px-4 ${l.eu ? 'border-salvia bg-salvia-suave' : 'border-linha bg-white'}`}
    >
      <CirculoPosicao posicao={l.posicao} />
      <span className="min-w-0 flex-1 truncate text-[15px] text-tinta">
        {l.apelido}
        {l.eu && <span className="font-bold"> {textos.voce}</span>}
      </span>
      <span className="text-[15px] font-bold text-verde-escuro">{l.valor}</span>
    </div>
  )
}

/** Se a linha está fora da tela (some por baixo ou por cima). */
function useForaDaTela() {
  const ref = useRef<HTMLLIElement>(null)
  const [fora, setFora] = useState(false)
  useEffect(() => {
    const alvo = ref.current
    if (!alvo || typeof IntersectionObserver === 'undefined') return
    const obs = new IntersectionObserver(([e]) => setFora(!e?.isIntersecting), {
      rootMargin: '0px 0px -80px 0px',
    })
    obs.observe(alvo)
    return () => obs.disconnect()
  }, [])
  return { ref, fora }
}

/** Lista do ranking: a linha dela em verde claro e, se sair da tela, fixa no rodapé da lista. */
export function ListaRanking({ linhas, rotulo }: { linhas: Linha[]; rotulo: string }) {
  const { ref, fora } = useForaDaTela()
  const eu = linhas.find((l) => l.eu)
  return (
    <div className="flex flex-col gap-2">
      <ol aria-label={rotulo} className="flex flex-col gap-2">
        {linhas.map((l) => (
          <li key={`${l.posicao}-${l.apelido}`} ref={l.eu ? ref : undefined}>
            <LinhaItem l={l} />
          </li>
        ))}
      </ol>
      {eu && fora && (
        <div aria-hidden className="sticky bottom-[88px] z-10 shadow-cartao lg:bottom-4">
          <LinhaItem l={eu} />
        </div>
      )}
    </div>
  )
}
