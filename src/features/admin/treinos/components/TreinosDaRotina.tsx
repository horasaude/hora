import { DIAS_SEMANA } from '@/domain/treinos'
import { t } from '../textos'
import { Escolha } from './Escolha'

type Treinos = { id: string; nome: string }[]
const opcoes = (treinos: Treinos, vazio: string): [string, string][] => [
  ['', vazio],
  ...treinos.map((x): [string, string] => [x.id, x.nome]),
]
const caixa = 'grid gap-3 rounded-2xl border border-linha p-4 sm:col-span-2'

/** Rotina por dia da semana: o treino de cada dia ou descanso. */
export function DiasDaRotina({
  dias,
  treinos,
  aoMudar,
}: {
  dias: Record<number, string>
  treinos: Treinos
  aoMudar: (dias: Record<number, string>) => void
}) {
  return (
    <fieldset className={`${caixa} sm:grid-cols-2`}>
      <legend className="px-1 text-sm font-bold text-verde-escuro">{t.dias}</legend>
      {DIAS_SEMANA.map((nome, dia) => (
        <Escolha
          key={nome}
          id={`rotina-dia-${dia}`}
          rotulo={nome}
          valor={dias[dia] ?? ''}
          opcoes={opcoes(treinos, t.descanso)}
          aoMudar={(id) => aoMudar({ ...dias, [dia]: id })}
        />
      ))}
    </fieldset>
  )
}

const botao =
  'grid size-8 place-items-center rounded-full text-suave hover:bg-trilho disabled:opacity-30'

function BotoesOrdem(p: {
  i: number
  total: number
  mover: (i: number, d: number) => void
  tirar: () => void
}) {
  return (
    <>
      <button
        type="button"
        disabled={p.i === 0}
        onClick={() => p.mover(p.i, -1)}
        aria-label={t.subir(p.i + 1)}
        className={botao}
      >
        ↑
      </button>
      <button
        type="button"
        disabled={p.i === p.total - 1}
        onClick={() => p.mover(p.i, 1)}
        aria-label={t.descer(p.i + 1)}
        className={botao}
      >
        ↓
      </button>
      <button
        type="button"
        onClick={p.tirar}
        aria-label={t.tirar(p.i + 1)}
        className={`${botao} text-terracota-escuro`}
      >
        ×
      </button>
    </>
  )
}

/** Rotina numérica: Treino 1, 2, 3 na ordem; a aluna faz o próximo depois do último feito. */
export function SequenciaDaRotina({
  sequencia,
  treinos,
  aoMudar,
}: {
  sequencia: string[]
  treinos: Treinos
  aoMudar: (s: string[]) => void
}) {
  const mover = (i: number, d: number) => {
    const nova = [...sequencia]
    const [x] = nova.splice(i, 1)
    nova.splice(i + d, 0, x ?? '')
    aoMudar(nova)
  }
  return (
    <fieldset className={caixa}>
      <legend className="px-1 text-sm font-bold text-verde-escuro">{t.sequencia}</legend>
      {sequencia.map((id, i) => (
        <div key={i} className="flex items-end gap-1">
          <div className="flex-1">
            <Escolha
              id={`rotina-treino-${i}`}
              rotulo={t.treinoN(i + 1)}
              valor={id}
              opcoes={opcoes(treinos, t.escolhaTreino)}
              aoMudar={(novo) => aoMudar(sequencia.map((x, j) => (j === i ? novo : x)))}
            />
          </div>
          <BotoesOrdem
            i={i}
            total={sequencia.length}
            mover={mover}
            tirar={() => aoMudar(sequencia.filter((_, j) => j !== i))}
          />
        </div>
      ))}
      <button
        type="button"
        disabled={sequencia.length >= 30}
        onClick={() => aoMudar([...sequencia, ''])}
        className="brilho brilho-dourado inline-flex min-h-9 items-center self-start rounded-full px-4 text-[13px] font-bold"
      >
        {t.adicionarTreino}
      </button>
    </fieldset>
  )
}
