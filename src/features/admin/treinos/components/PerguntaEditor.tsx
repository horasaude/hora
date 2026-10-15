import { TIPOS_PERGUNTA, type Pergunta, type TipoPergunta } from '@/domain/anamnese'
import { t } from '../textos'
import { Escolha } from './Escolha'

const botao =
  'grid size-8 place-items-center rounded-full text-suave hover:bg-trilho disabled:opacity-30'
const caixa =
  'w-full rounded-xl border border-linha bg-white px-3 py-2 text-sm focus:border-ora focus:outline-none'

type Props = {
  p: Pergunta
  i: number
  total: number
  mudar: (x: Partial<Pergunta>) => void
  mover: (d: number) => void
  tirar: () => void
}

function TopoPergunta({ i, total, mover, tirar }: Omit<Props, 'p' | 'mudar'>) {
  const a = t.anamnese
  return (
    <div className="flex items-center gap-1">
      <span className="flex-1 text-sm font-bold text-verde-escuro">{a.pergunta(i + 1)}</span>
      <button
        type="button"
        disabled={i === 0}
        onClick={() => mover(-1)}
        aria-label={a.subir(i + 1)}
        className={botao}
      >
        ↑
      </button>
      <button
        type="button"
        disabled={i === total - 1}
        onClick={() => mover(1)}
        aria-label={a.descer(i + 1)}
        className={botao}
      >
        ↓
      </button>
      <button
        type="button"
        onClick={tirar}
        aria-label={a.tirar(i + 1)}
        className={`${botao} text-terracota-escuro`}
      >
        ×
      </button>
    </div>
  )
}

/** Uma pergunta da anamnese: texto, tipo de resposta, opções, obrigatória e ordem. */
export function PerguntaEditor({ p, i, total, mudar, mover, tirar }: Props) {
  const a = t.anamnese
  return (
    <li className="flex flex-col gap-3 rounded-2xl border border-[#ECEFED] bg-white p-3">
      <TopoPergunta i={i} total={total} mover={mover} tirar={tirar} />
      <input
        aria-label={a.pergunta(i + 1)}
        value={p.texto}
        maxLength={300}
        onChange={(e) => mudar({ texto: e.target.value })}
        className={caixa}
      />
      <div className="grid items-end gap-3 sm:grid-cols-2">
        <Escolha
          id={`pergunta-tipo-${p.id}`}
          rotulo={a.tipo}
          valor={p.tipo}
          opcoes={Object.entries(TIPOS_PERGUNTA)}
          aoMudar={(tipo) => mudar({ tipo: tipo as TipoPergunta })}
        />
        <label className="flex min-h-11 items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={p.obrigatoria}
            onChange={(e) => mudar({ obrigatoria: e.target.checked })}
            className="size-4 accent-[#2c4c44]"
          />
          {a.obrigatoria}
        </label>
      </div>
      {p.tipo === 'escolha' && (
        <label className="flex flex-col gap-1 text-sm font-medium">
          {a.opcoes}
          <textarea
            rows={3}
            value={p.opcoes.join('\n')}
            onChange={(e) => mudar({ opcoes: e.target.value.split('\n').slice(0, 12) })}
            className={caixa}
          />
        </label>
      )}
    </li>
  )
}
