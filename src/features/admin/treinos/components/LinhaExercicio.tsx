import { GRUPOS, type Grupo } from '@/domain/treinos'
import type { Exercicio } from '../api/treinos.api'
import { useMarcarFavorito } from '../hooks/useTreinosPainel'
import { t } from '../textos'

function Estrela({ e, favorito }: { e: Exercicio; favorito: boolean }) {
  const marcar = useMarcarFavorito()
  return (
    <button
      type="button"
      onClick={() => marcar.mutate({ id: e.id, favorito: !favorito })}
      aria-pressed={favorito}
      aria-label={favorito ? t.itens.desfavoritar(e.nome) : t.itens.favoritar(e.nome)}
      className={`grid size-8 place-items-center rounded-full text-lg ${favorito ? 'text-dourado' : 'text-[#C9CFCB]'}`}
    >
      {favorito ? '★' : '☆'}
    </button>
  )
}

type Props = {
  e: Exercicio
  multiplo: boolean
  marcado: boolean
  favorito: boolean
  aoTocar: () => void
}

/** Exercício na lista de escolha: marcar (vários) ou escolher (um), e a estrela de favorito. */
export function LinhaExercicio({ e, multiplo, marcado, favorito, aoTocar }: Props) {
  return (
    <li className="flex items-center gap-1">
      <button
        type="button"
        onClick={aoTocar}
        aria-pressed={multiplo ? marcado : undefined}
        className={`flex min-h-10 flex-1 items-center gap-3 rounded-xl px-3 text-left text-[13px] hover:bg-trilho ${marcado ? 'bg-[#EAF5EE]' : ''}`}
      >
        {multiplo && (
          <span
            aria-hidden
            className={`grid size-4 place-items-center rounded border text-[10px] ${marcado ? 'border-ora bg-ora text-white' : 'border-[#C9CFCB]'}`}
          >
            {marcado ? '✓' : ''}
          </span>
        )}
        <span className="flex-1 font-bold text-tinta">{e.nome}</span>
        <span className="text-suave">{GRUPOS[e.grupo as Grupo]}</span>
      </button>
      <Estrela e={e} favorito={favorito} />
    </li>
  )
}
