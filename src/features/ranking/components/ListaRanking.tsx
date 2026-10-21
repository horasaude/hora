import { useEffect, useRef, useState } from 'react'
import { textos } from '../textos'
import { Inicial } from './Inicial'

export type Linha = {
  posicao: number
  apelido: string
  eu: boolean
  valor: string
  foto?: string | null
}

function LinhaItem({ l }: { l: Linha }) {
  return (
    <div
      className={`flex min-h-14 items-center gap-3 rounded-[16px] border px-3 py-2.5 ${l.eu ? 'border-verde-vivo bg-[#e2f4eb]' : 'border-linha bg-white'}`}
    >
      <span className="w-6 shrink-0 text-center text-[15px] font-extrabold text-suave">
        {l.posicao}
      </span>
      <Inicial nome={l.apelido} foto={l.foto} posicao={l.posicao} />
      <span className="min-w-0 flex-1 truncate text-[15px] font-bold text-tinta">
        {l.eu ? textos.voceLinha : l.apelido}
        {l.eu && <span className="sr-only"> ({l.apelido})</span>}
      </span>
      <span className="text-[15px] font-bold text-tinta">{l.valor}</span>
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

/** Lista do ranking: a linha dela em verde e, se sair da tela, fixa no rodapé da lista. */
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
