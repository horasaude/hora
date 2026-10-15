import { useState } from 'react'
import { BotaoBrilho } from '@/components/ui'
import { GRUPOS } from '@/domain/treinos'
import type { Exercicio } from '../api/treinos.api'
import { useExercicios, useFavoritos } from '../hooks/useTreinosPainel'
import { t } from '../textos'
import { LinhaExercicio } from './LinhaExercicio'

const pilula = (ativa: boolean) =>
  `min-h-8 rounded-full px-3 text-xs font-bold ${ativa ? 'brilho brilho-verde' : 'bg-trilho text-tinta'}`

function Filtros(p: {
  busca: string
  grupo: string
  soFavoritos: boolean
  mudar: (x: Partial<{ busca: string; grupo: string; soFavoritos: boolean }>) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        type="search"
        autoFocus
        value={p.busca}
        onChange={(e) => p.mudar({ busca: e.target.value })}
        onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
        placeholder={t.itens.buscar}
        aria-label={t.itens.buscar}
        className="min-h-10 min-w-0 flex-1 rounded-full border border-[#ECEFED] px-4 text-[13px] focus:border-ora focus:outline-none"
      />
      <select
        value={p.grupo}
        onChange={(e) => p.mudar({ grupo: e.target.value })}
        aria-label={t.filtroGrupo}
        className="min-h-10 rounded-full border border-[#ECEFED] bg-white px-3 text-[13px]"
      >
        <option value="">{t.filtroGrupo}</option>
        {Object.entries(GRUPOS).map(([v, n]) => (
          <option key={v} value={v}>
            {n}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={() => p.mudar({ soFavoritos: false })}
        className={pilula(!p.soFavoritos)}
      >
        {t.itens.todos}
      </button>
      <button
        type="button"
        onClick={() => p.mudar({ soFavoritos: true })}
        className={pilula(p.soFavoritos)}
      >
        {t.itens.favoritos}
      </button>
    </div>
  )
}

type Props = {
  titulo: string
  multiplo: boolean
  aoConfirmar: (lista: Exercicio[]) => void
  aoFechar: () => void
  grupoInicial?: string
}

/** Biblioteca dentro do treino: busca, grupo, favoritos; escolhe um (trocar, alternativo) ou vários. */
export function EscolherExercicios({
  titulo,
  multiplo,
  aoConfirmar,
  aoFechar,
  grupoInicial = '',
}: Props) {
  const [f, setF] = useState({ busca: '', grupo: grupoInicial, soFavoritos: false })
  const [escolhidos, setEscolhidos] = useState<Exercicio[]>([])
  const lista = useExercicios(f.busca, f.grupo).data ?? []
  const favoritos = new Set(useFavoritos().data ?? [])
  const visiveis = (f.soFavoritos ? lista.filter((e) => favoritos.has(e.id)) : lista).slice(0, 60)
  const tocar = (e: Exercicio) => {
    if (!multiplo) return aoConfirmar([e])
    setEscolhidos((a) =>
      a.some((x) => x.id === e.id) ? a.filter((x) => x.id !== e.id) : [...a, e],
    )
  }
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-[#ECEFED] bg-white p-3">
      <p className="text-sm font-bold text-verde-escuro">{titulo}</p>
      <Filtros {...f} mudar={(x) => setF((a) => ({ ...a, ...x }))} />
      {f.soFavoritos && visiveis.length === 0 && (
        <p className="px-1 text-xs text-suave">{t.itens.semFavoritos}</p>
      )}
      <ul className="flex max-h-64 flex-col overflow-y-auto">
        {visiveis.map((e) => (
          <LinhaExercicio
            key={e.id}
            e={e}
            multiplo={multiplo}
            marcado={escolhidos.some((x) => x.id === e.id)}
            favorito={favoritos.has(e.id)}
            aoTocar={() => tocar(e)}
          />
        ))}
      </ul>
      <div className="flex flex-wrap items-center justify-end gap-2">
        {multiplo && (
          <span className="mr-auto text-xs text-suave">
            {t.itens.selecionados(escolhidos.length)}
          </span>
        )}
        <BotaoBrilho tom="cinza" onClick={aoFechar}>
          {t.fechar}
        </BotaoBrilho>
        {multiplo && (
          <BotaoBrilho
            tom="verde"
            disabled={escolhidos.length === 0}
            onClick={() => aoConfirmar(escolhidos)}
          >
            {t.itens.adicionarVarios(escolhidos.length)}
          </BotaoBrilho>
        )}
      </div>
    </div>
  )
}
