import { Cartao } from '@/components/ui'
import { useSequencia } from '@/features/checkin'
import { useDesafios } from '@/features/desafios'
import { useMinhaPosicao } from '@/features/ranking'
import { useAulasConcluidas } from '../hooks/usePerfil'
import { textos } from '../textos'

const t = textos.resumo

/** Pontos no mês, dias seguidos, aulas concluídas e desafios completos. */
export function Resumo() {
  const { eu } = useMinhaPosicao('mes')
  const { seguidos } = useSequencia()
  const aulas = useAulasConcluidas()
  const desafios = useDesafios()
  const completos = (desafios.data ?? []).filter((d) => d.dias_feitos >= d.meta_dias).length
  const itens = [
    [(eu?.pontos ?? 0).toLocaleString('pt-BR'), t.pontos],
    [String(seguidos), t.seguidos],
    [String(aulas.data ?? 0), t.aulas],
    [String(completos), t.desafios],
  ]
  return (
    <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
      {itens.map(([valor, rotulo]) => (
        <li key={rotulo}>
          <Cartao className="flex flex-col px-4 py-4 lg:px-6 lg:py-5">
            <span className="text-[26px] leading-tight font-bold text-verde-escuro lg:text-[32px]">
              {valor}
            </span>
            <span className="text-[13px] text-suave lg:text-sm">{rotulo}</span>
          </Cartao>
        </li>
      ))}
    </ul>
  )
}
