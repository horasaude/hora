import { classeBrilho } from '@/components/ui'
import { TIPOS_REFEICAO } from '@/domain/plano'
import { useTemas } from '../../hooks/usePainel'
import type { FormReceita } from '../receitaForm'
import { tReceitas as t } from '../textos2'

type Props = { f: FormReceita; mudar: (p: Partial<FormReceita>) => void }

function Pilulas({
  rotulo,
  opcoes,
  marcadas,
  aoMudar,
}: {
  rotulo: string
  opcoes: [string, string][]
  marcadas: string[]
  aoMudar: (v: string[]) => void
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-1 text-sm font-medium">{rotulo}</legend>
      <div className="flex flex-wrap gap-1.5">
        {opcoes.map(([valor, nome]) => {
          const marcada = marcadas.includes(valor)
          return (
            <button
              key={valor}
              type="button"
              aria-pressed={marcada}
              onClick={() =>
                aoMudar(marcada ? marcadas.filter((x) => x !== valor) : [...marcadas, valor])
              }
              className={classeBrilho(marcada ? 'verde' : 'cinza', 'sm')}
            >
              {nome}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

/** Refeições da receita (filtro da aluna) e o tema onde ela aparece. */
export function ReceitaMarcas({ f, mudar }: Props) {
  const temas = useTemas().data ?? []
  return (
    <>
      <Pilulas
        rotulo={t.refeicoes}
        opcoes={Object.entries(TIPOS_REFEICAO)}
        marcadas={f.refeicoes}
        aoMudar={(refeicoes) => mudar({ refeicoes })}
      />
      <Pilulas
        rotulo={t.objetivos}
        opcoes={temas.map((x) => [x.id, x.titulo])}
        marcadas={f.tema_id ? [f.tema_id] : []}
        aoMudar={(v) => mudar({ tema_id: v.find((x) => x !== f.tema_id) ?? '' })}
      />
    </>
  )
}
