import { CATEGORIAS, ehCategoria } from '@/domain/forum'
import { Estado } from '../../components/Estado'
import { celula, LinhaTabela, Tabela } from '../../components/Tabela'
import { Paginacao } from '../../plano/components/Ferramentas'
import type { FiltroFila, Situacao } from '../api/forum.api'
import { useAulasSimples, useFila } from '../hooks/useForumPainel'
import { t } from '../textos'
import { Prazo } from './Prazo'

const seletor =
  'min-h-10 rounded-full border border-[#ECEFED] bg-white px-3 text-[13px] shadow-painel'
const categoria = (c: string) => (ehCategoria(c) ? CATEGORIAS[c] : c)

type PropsFiltros = {
  f: FiltroFila
  mudar: (p: Partial<FiltroFila>) => void
  paraMim: boolean
  alternarParaMim: () => void
}

export function FiltrosFila({ f, mudar, paraMim, alternarParaMim }: PropsFiltros) {
  const aulas = useAulasSimples().data ?? []
  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        aria-label={t.categoria}
        className={seletor}
        value={f.categoria}
        disabled={paraMim}
        onChange={(e) => mudar({ categoria: ehCategoria(e.target.value) ? e.target.value : '' })}
      >
        <option value="">{`${t.categoria}: ${t.todas}`}</option>
        {Object.entries(CATEGORIAS).map(([v, n]) => (
          <option key={v} value={v}>
            {n}
          </option>
        ))}
      </select>
      <select
        aria-label={t.aula}
        className={`${seletor} max-w-60`}
        value={f.aula}
        onChange={(e) => mudar({ aula: e.target.value })}
      >
        <option value="">{`${t.aula}: ${t.todas}`}</option>
        <option value="geral">{t.geral}</option>
        {aulas.map((a) => (
          <option key={a.id} value={a.id}>
            {a.titulo}
          </option>
        ))}
      </select>
      <select
        aria-label={t.situacao}
        className={seletor}
        value={f.situacao}
        onChange={(e) => mudar({ situacao: e.target.value as Situacao })}
      >
        {Object.entries(t.situacoes).map(([v, n]) => (
          <option key={v} value={v}>
            {n}
          </option>
        ))}
      </select>
      <button
        type="button"
        aria-pressed={paraMim}
        onClick={alternarParaMim}
        className={`min-h-10 rounded-full px-4 text-[13px] font-bold ${paraMim ? 'brilho brilho-verde' : 'border border-[#ECEFED] bg-white text-suave shadow-painel'}`}
      >
        {t.paraMim}
      </button>
    </div>
  )
}

/** Tabela da fila: aluna, dúvida resumida, aula, categoria e prazo; a linha abre a dúvida. */
export function TabelaFila({ f, setF }: { f: FiltroFila; setF: (f: FiltroFila) => void }) {
  const fila = useFila(f)
  if (fila.isPending) return <Estado tipo="carregando" />
  if (fila.isError) return <Estado tipo="erro" tentar={() => fila.refetch()} />
  if (fila.data.total === 0) return <Estado tipo="vazio" texto={t.vazio} />
  return (
    <>
      <Tabela colunas={t.colunas}>
        {fila.data.lista.map((d) => (
          <LinhaTabela
            key={d.id}
            ativa={false}
            para={`/app/admin/forum/${d.id}`}
            titulo={d.perfis?.apelido || d.perfis?.nome || '-'}
            semQuebra
          >
            <td className={`${celula} max-w-md`}>
              <span className="line-clamp-2">{d.texto}</span>
            </td>
            <td className={`${celula} text-suave`}>{d.aulas?.titulo ?? t.geral}</td>
            <td className={celula}>{categoria(d.categoria)}</td>
            <td className={celula}>
              <Prazo d={d} />
            </td>
          </LinhaTabela>
        ))}
      </Tabela>
      <Paginacao
        pagina={f.pagina}
        tamanho={f.tamanho}
        total={fila.data.total}
        aoMudar={(pagina, tamanho) => setF({ ...f, pagina, tamanho })}
      />
    </>
  )
}
