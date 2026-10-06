import type { ReactNode } from 'react'
import { textos } from '../textos'

/** Campo de busca por nome. */
export function CampoBusca({
  valor,
  aoMudar,
  rotulo = textos.buscar,
}: {
  valor: string
  aoMudar: (v: string) => void
  rotulo?: string
}) {
  return (
    <input
      type="search"
      value={valor}
      onChange={(e) => aoMudar(e.target.value)}
      placeholder={rotulo}
      aria-label={rotulo}
      className="min-h-10 w-full rounded-full border border-[#ECEFED] bg-white px-4 text-[13px] shadow-painel focus:border-ora focus:outline-none sm:max-w-xs"
    />
  )
}

type Opcao = { valor: string; nome: string }

/** Filtro em pílulas; a escolhida fica em vidro verde. */
export function Filtros({
  opcoes,
  valor,
  aoMudar,
  rotulo,
}: {
  opcoes: Opcao[]
  valor: string
  aoMudar: (v: string) => void
  rotulo: string
}) {
  return (
    <div role="group" aria-label={rotulo} className="flex flex-wrap gap-1.5">
      {[{ valor: '', nome: textos.todos }, ...opcoes].map((o) => (
        <button
          key={o.valor || 'todos'}
          type="button"
          aria-pressed={o.valor === valor}
          onClick={() => aoMudar(o.valor)}
          className={`min-h-8 rounded-full px-3 text-xs font-bold ${o.valor === valor ? 'brilho brilho-verde' : 'border border-[#ECEFED] bg-white text-suave hover:bg-trilho'}`}
        >
          {o.nome}
        </button>
      ))}
    </div>
  )
}

/** Barra acima da tabela: busca e filtros lado a lado no computador. */
export function BarraFiltros({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      {children}
    </div>
  )
}

type Pag = {
  pagina: number
  total: number
  tamanho: number
  aoMudar: (pagina: number, tamanho: number) => void
}

/** Paginação de 10 em 10, com 25, 50 ou 100 por página. */
export function Paginacao({ pagina, total, tamanho, aoMudar }: Pag) {
  const paginas = Math.max(1, Math.ceil(total / tamanho))
  const botao =
    'min-h-8 rounded-full border border-[#ECEFED] bg-white px-3 text-xs font-bold text-verde-escuro disabled:opacity-40'
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-[13px] text-suave">
      <label className="flex items-center gap-2">
        {textos.porPagina}
        <select
          value={tamanho}
          onChange={(e) => aoMudar(1, Number(e.target.value))}
          className="min-h-8 rounded-full border border-[#ECEFED] bg-white px-2"
        >
          {[10, 25, 50, 100].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={botao}
          disabled={pagina <= 1}
          onClick={() => aoMudar(pagina - 1, tamanho)}
        >
          {textos.anterior}
        </button>
        <span>{textos.pagina(pagina, paginas)}</span>
        <button
          type="button"
          className={botao}
          disabled={pagina >= paginas}
          onClick={() => aoMudar(pagina + 1, tamanho)}
        >
          {textos.proxima}
        </button>
      </div>
    </div>
  )
}
