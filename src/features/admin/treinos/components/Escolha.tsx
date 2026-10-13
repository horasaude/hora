const caixa =
  'min-h-11 rounded-xl border border-linha bg-white px-3 text-sm focus:border-ora focus:outline-none'

type Props = {
  id: string
  rotulo: string
  valor: string
  opcoes: [string, string][]
  aoMudar: (v: string) => void
}

/** Lista de escolha com rótulo, controlada pelo valor. */
export function Escolha({ id, rotulo, valor, opcoes, aoMudar }: Props) {
  return (
    <label htmlFor={id} className="flex flex-col gap-1 text-sm font-medium">
      {rotulo}
      <select id={id} value={valor} onChange={(e) => aoMudar(e.target.value)} className={caixa}>
        {opcoes.map(([v, n]) => (
          <option key={v} value={v}>
            {n}
          </option>
        ))}
      </select>
    </label>
  )
}
