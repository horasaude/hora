import { useState } from 'react'
import { GRUPOS, type Grupo } from '@/domain/treinos'
import type { Exercicio } from '../api/treinos.api'
import { useExercicios } from '../hooks/useTreinosPainel'
import { t } from '../textos'

/** "Adicionar exercício": busca na biblioteca e devolve o escolhido. */
export function AdicionarExercicio({ aoEscolher }: { aoEscolher: (e: Exercicio) => void }) {
  const [aberto, setAberto] = useState(false)
  const [busca, setBusca] = useState('')
  const lista = useExercicios(busca)
  if (!aberto)
    return (
      <button
        type="button"
        onClick={() => setAberto(true)}
        className="brilho brilho-coral inline-flex min-h-9 items-center self-start rounded-full px-4 text-[13px] font-bold"
      >
        + {t.itens.adicionar}
      </button>
    )
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-[#ECEFED] bg-white p-3">
      <input
        type="search"
        autoFocus
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder={t.itens.buscar}
        aria-label={t.itens.buscar}
        className="min-h-10 rounded-full border border-[#ECEFED] px-4 text-[13px] focus:border-ora focus:outline-none"
      />
      <ul className="flex max-h-56 flex-col overflow-y-auto">
        {(lista.data ?? []).slice(0, 30).map((e) => (
          <li key={e.id}>
            <button
              type="button"
              onClick={() => {
                aoEscolher(e)
                setBusca('')
                setAberto(false)
              }}
              className="flex min-h-10 w-full items-center justify-between gap-3 rounded-xl px-3 text-left text-[13px] hover:bg-trilho"
            >
              <span className="font-bold text-tinta">{e.nome}</span>
              <span className="text-suave">{GRUPOS[e.grupo as Grupo]}</span>
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => setAberto(false)}
        className="self-end text-xs text-suave underline"
      >
        {t.fechar}
      </button>
    </div>
  )
}
