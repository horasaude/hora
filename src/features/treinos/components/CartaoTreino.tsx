import { EtiquetaBrilho, IconeCheck, LinkBrilho } from '@/components/ui'
import type { TreinoResumo } from '../api/treinos.api'
import { detalhe } from '../formato'
import { textos } from '../textos'

/** Treino da lista "Outros treinos": nome, duração, exercícios e o atalho para começar. */
export function CartaoTreino({
  x,
  para,
  feito,
}: {
  x: TreinoResumo
  para: string
  feito: boolean
}) {
  return (
    <div className="flex items-center gap-3 rounded-[20px] bg-white p-4 shadow-cartao">
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-bold text-tinta">{x.nome}</p>
        <p className="text-[13px] text-suave">{detalhe(x)}</p>
      </div>
      {feito && (
        <EtiquetaBrilho tom="verde">
          <IconeCheck className="mr-1 size-3" />
          {textos.feito}
        </EtiquetaBrilho>
      )}
      <LinkBrilho to={para} tom="coral" tamanho="sm">
        {textos.comecar}
      </LinkBrilho>
    </div>
  )
}
