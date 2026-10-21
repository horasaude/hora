import { useSequencia } from '@/features/checkin'
import { useDesafios } from '@/features/desafios'
import { useVariacao } from '@/features/evolucao'
import { useMinhaPosicao } from '@/features/ranking'
import { useAulasConcluidas } from '../hooks/usePerfil'
import { textos } from '../textos'

const t = textos.resumo

/** Três números do topo (variação de peso e de cintura e pontos no mês) e, embaixo, a constância. */
export function Resumo() {
  const variacao = useVariacao()
  const { eu } = useMinhaPosicao('mes')
  const { seguidos } = useSequencia()
  const aulas = useAulasConcluidas()
  const desafios = useDesafios()
  const completos = (desafios.data ?? []).filter((d) => d.dias_feitos >= d.meta_dias).length
  const numeros = [
    [t.variacao(variacao.peso, 'kg'), t.peso],
    [t.variacao(variacao.cintura, 'cm'), t.cintura],
    [(eu?.pontos ?? 0).toLocaleString('pt-BR'), t.pontos],
  ]
  return (
    <div className="flex flex-col gap-2">
      <ul className="grid grid-cols-3 gap-2 lg:gap-4">
        {numeros.map(([valor, rotulo]) => (
          <li
            key={rotulo}
            className="flex flex-col items-center rounded-[16px] border border-linha bg-white px-2 py-2.5 text-center lg:py-4"
          >
            <b className="text-[18px] leading-tight text-verde-escuro lg:text-[24px]">{valor}</b>
            <span className="text-[11px] text-suave lg:text-[13px]">{rotulo}</span>
          </li>
        ))}
      </ul>
      <p className="text-center text-[12px] text-suave">
        {t.constancia(seguidos, aulas.data ?? 0, completos)}
      </p>
    </div>
  )
}
