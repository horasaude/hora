import { Link } from 'react-router-dom'
import { BotaoBrilho } from '@/components/ui'
import type { useExecucao } from '../hooks/useExecucao'
import { textos } from '../textos'

const t = textos.execucao
type Execucao = ReturnType<typeof useExecucao>

/** Sair, passo atual e a barra de progresso coral. */
export function Topo({
  voltar,
  passo,
  pct,
  nome,
}: {
  voltar: string
  passo: string
  pct: number
  nome: string
}) {
  return (
    <>
      <div className="flex items-center gap-3">
        <Link to={voltar} className="min-h-10 text-[13px] font-bold text-suave underline">
          {t.sair}
        </Link>
        <span className="ml-auto text-[13px] text-suave">{passo}</span>
      </div>
      <div
        role="progressbar"
        aria-label={nome}
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2.5 overflow-hidden rounded-full bg-[#FDE2D6]"
      >
        <div
          className="brilho brilho-coral h-full rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </>
  )
}

/** Anterior e Próximo; no último passo, Concluir treino. */
export function Navegacao({
  x,
  concluir,
  ocupado,
}: {
  x: Execucao
  concluir: () => void
  ocupado: boolean
}) {
  return (
    <div className="sticky bottom-0 -mx-5 flex gap-3 border-t border-linha bg-white px-5 py-3 lg:static lg:mx-0 lg:border-0 lg:px-0">
      <BotaoBrilho
        tom="cinza"
        tamanho="lg"
        disabled={x.atual === 0}
        onClick={x.anterior}
        className="flex-1"
      >
        {t.anterior}
      </BotaoBrilho>
      {x.ultimo ? (
        <BotaoBrilho
          tom="coral"
          tamanho="lg"
          disabled={ocupado}
          onClick={concluir}
          className="flex-1"
        >
          {t.concluir}
        </BotaoBrilho>
      ) : (
        <BotaoBrilho tom="coral" tamanho="lg" onClick={x.proximo} className="flex-1">
          {t.proximo}
        </BotaoBrilho>
      )}
    </div>
  )
}
