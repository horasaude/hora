import { Cartao } from '@/components/ui'
import { useSequencia } from '@/features/checkin'
import { useMinhaPosicao } from '@/features/ranking'
import { textos } from '../textos'

const t = textos.resumo

function Numero({ valor, rotulo }: { valor: string; rotulo: string }) {
  return (
    <Cartao className="flex flex-col px-4 py-4 lg:px-6 lg:py-6">
      <span className="text-[26px] leading-tight font-bold text-verde-escuro lg:text-[32px]">
        {valor}
      </span>
      <span className="text-[13px] text-suave lg:text-sm">{rotulo}</span>
    </Cartao>
  )
}

/** Três números do topo: pontos no mês, dias seguidos e posição no ranking. */
export function Resumo() {
  const { eu } = useMinhaPosicao('mes')
  const { seguidos } = useSequencia()
  return (
    <div className="grid grid-cols-3 gap-3 lg:gap-5">
      <Numero valor={(eu?.pontos ?? 0).toLocaleString('pt-BR')} rotulo={t.pontos} />
      <Numero valor={String(seguidos)} rotulo={t.seguidos} />
      <Numero valor={eu && eu.pontos > 0 ? t.posicao(eu.posicao) : '-'} rotulo={t.ranking} />
    </div>
  )
}
