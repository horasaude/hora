import { classeBrilho } from '@/components/ui'
import { OBJETIVOS, TIPOS_REFEICAO } from '@/domain/plano'
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

/** Refeições e temas da receita (filtros da aluna). */
export function ReceitaMarcas({ f, mudar }: Props) {
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
        opcoes={OBJETIVOS.map((o) => [o, o])}
        marcadas={f.objetivos}
        aoMudar={(objetivos) => mudar({ objetivos })}
      />
    </>
  )
}
