// Campos simples dos formulários da Loja (seleção, texto longo e marcar).

export function Selecao({
  rotulo,
  valor,
  opcoes,
  aoMudar,
}: {
  rotulo: string
  valor: string
  opcoes: [string, string][]
  aoMudar: (v: string) => void
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium">{rotulo}</span>
      <select
        value={valor}
        onChange={(e) => aoMudar(e.target.value)}
        className="min-h-12 rounded-xl border border-linha bg-white px-4"
      >
        {opcoes.map(([v, n]) => (
          <option key={v} value={v}>
            {n}
          </option>
        ))}
      </select>
    </label>
  )
}

export function Texto({
  rotulo,
  valor,
  aoMudar,
  linhas = 4,
}: {
  rotulo: string
  valor: string
  aoMudar: (v: string) => void
  linhas?: number
}) {
  return (
    <label className="flex flex-col gap-1 text-sm sm:col-span-2">
      <span className="font-medium">{rotulo}</span>
      <textarea
        rows={linhas}
        maxLength={2000}
        value={valor}
        onChange={(e) => aoMudar(e.target.value)}
        className="rounded-xl border border-linha bg-white px-4 py-3 focus:border-ora focus:outline-none"
      />
    </label>
  )
}

export function Marcar({
  rotulo,
  valor,
  aoMudar,
}: {
  rotulo: string
  valor: boolean
  aoMudar: (v: boolean) => void
}) {
  return (
    <label className="flex min-h-12 items-center gap-3 text-sm font-medium">
      <input
        type="checkbox"
        className="size-5 accent-ora"
        checked={valor}
        onChange={(e) => aoMudar(e.target.checked)}
      />
      {rotulo}
    </label>
  )
}
