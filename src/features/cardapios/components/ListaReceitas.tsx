import { useState } from 'react'
import { Carregando, ErroCarregar, Vazio } from '@/components/ui'
import { OBJETIVOS, TIPOS_REFEICAO } from '@/domain/plano'
import { useReceitas } from '../hooks/useCardapios'
import { useObjetivo } from '../hooks/useObjetivo'
import { textos } from '../textos'
import { CartaoReceita } from './CartaoReceita'

const t = textos.receitas
const semAcento = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
const campo =
  'min-h-10 rounded-full border border-linha bg-white px-4 text-sm focus:border-ora focus:outline-none'

type Filtros = ReturnType<typeof useFiltros>

function useFiltros() {
  const [busca, setBusca] = useState('')
  const [refeicao, setRefeicao] = useState('')
  const [tema, setTema] = useState<string | null>(null)
  const [favoritas, setFavoritas] = useState(false)
  return { busca, setBusca, refeicao, setRefeicao, tema, setTema, favoritas, setFavoritas }
}

function FiltrosReceitas({ f, temaAtivo }: { f: Filtros; temaAtivo: string }) {
  const { busca, setBusca, refeicao, setRefeicao, setTema, favoritas, setFavoritas } = f
  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        aria-label={t.buscar}
        placeholder={t.buscar}
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className={`${campo} w-full sm:w-64`}
      />
      <select
        aria-label={t.refeicao}
        value={refeicao}
        onChange={(e) => setRefeicao(e.target.value)}
        className={campo}
      >
        <option value="">{`${t.refeicao}: ${t.todas}`}</option>
        {Object.entries(TIPOS_REFEICAO).map(([id, nome]) => (
          <option key={id} value={id}>
            {nome}
          </option>
        ))}
      </select>
      <select
        aria-label={t.tema}
        value={temaAtivo}
        onChange={(e) => setTema(e.target.value)}
        className={campo}
      >
        <option value="">{`${t.tema}: ${t.todos}`}</option>
        {OBJETIVOS.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <label className="flex min-h-10 items-center gap-2 text-sm text-tinta">
        <input
          type="checkbox"
          checked={favoritas}
          onChange={(e) => setFavoritas(e.target.checked)}
          className="size-4 accent-ora"
        />
        {t.favoritas}
      </label>
    </div>
  )
}

/** Receitas em grade com busca, filtro por refeição e por tema, e só favoritas. */
export function ListaReceitas() {
  const receitas = useReceitas()
  const { objetivo } = useObjetivo()
  const f = useFiltros()
  const { busca, refeicao, tema, favoritas } = f
  if (receitas.isPending) return <Carregando texto={textos.carregando} />
  if (receitas.isError)
    return (
      <ErroCarregar
        texto={textos.erro}
        tentar={textos.tentar}
        aoTentar={() => receitas.refetch()}
      />
    )
  if (receitas.data.length === 0) return <Vazio>{t.nenhuma}</Vazio>
  const temaAtivo = tema ?? objetivo ?? ''
  const termos = semAcento(busca).split(/\s+/).filter(Boolean)
  const lista = receitas.data.filter(
    (r) =>
      termos.every((p) => semAcento(r.nome).includes(p)) &&
      (!refeicao || r.refeicoes.includes(refeicao)) &&
      (!temaAtivo || r.objetivos.length === 0 || r.objetivos.includes(temaAtivo)) &&
      (!favoritas || r.favorita),
  )
  return (
    <div className="flex flex-col gap-4">
      <FiltrosReceitas f={f} temaAtivo={temaAtivo} />
      {lista.length === 0 ? (
        <Vazio>{t.vazio}</Vazio>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {lista.map((r) => (
            <li key={r.id}>
              <CartaoReceita r={r} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
