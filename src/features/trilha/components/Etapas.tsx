import { classeBrilho } from '@/components/ui'
import type { EtapaTrilha } from '@/domain/trilha'

type Props = { etapas: EtapaTrilha[]; ativa: string; aoEscolher: (id: string) => void }

/** Etapas do tema em abas; a escolhida fica verde escura. */
export function AbasEtapas({ etapas, ativa, aoEscolher }: Props) {
  return (
    <div role="tablist" className="grid auto-cols-fr grid-flow-col gap-2">
      {etapas.map((e) => (
        <button
          key={e.id}
          type="button"
          role="tab"
          aria-selected={e.id === ativa}
          onClick={() => aoEscolher(e.id)}
          className={`${classeBrilho(e.id === ativa ? 'verde' : 'cinza', 'md')} px-3`}
        >
          {e.titulo}
        </button>
      ))}
    </div>
  )
}
