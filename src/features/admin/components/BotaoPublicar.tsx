import { BotaoBrilho } from '@/components/ui'
import type { TabelaConteudo } from '../api/conteudo.api'
import { useAcoes } from '../hooks/usePainel'
import { textos } from '../textos'

type Props = { tabela: TabelaConteudo; id: string; publicado: boolean; className?: string }

/** Publica ou tira do ar o item aberto no cartão. */
export function BotaoPublicar({ tabela, id, publicado, className = '' }: Props) {
  const { publicar } = useAcoes()
  return (
    <BotaoBrilho
      tom={publicado ? 'coral' : 'escuro'}
      className={className}
      disabled={publicar.isPending}
      onClick={() => publicar.mutate({ tabela, id, publicado: !publicado })}
    >
      {publicado ? textos.despublicar : textos.publicar}
    </BotaoBrilho>
  )
}
