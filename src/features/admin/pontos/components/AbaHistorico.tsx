import { useState } from 'react'
import { classeBrilho } from '@/components/ui'
import { formatarData } from '@/lib/datas'
import { Estado } from '../../components/Estado'
import { Tabela } from '../../components/Tabela'
import { Paginacao } from '../../plano/components/Ferramentas'
import type { FiltroHistorico, Lancamento } from '../api/pontos.api'
import { useAlunasSimples, useLancamentos, useNomesAcoes } from '../hooks/usePontos'
import { t } from '../textos'
import { AjusteJanela } from './AjusteJanela'

const h = t.historico
const seletor =
  'min-h-10 rounded-full border border-[#ECEFED] bg-white px-3 text-[13px] shadow-painel'

function Filtros({
  f,
  mudar,
}: {
  f: FiltroHistorico
  mudar: (p: Partial<FiltroHistorico>) => void
}) {
  const alunas = useAlunasSimples().data ?? []
  const nomes = useNomesAcoes()
  return (
    <div className="flex flex-wrap gap-2">
      <select
        aria-label={h.aluna}
        className={seletor}
        value={f.perfil}
        onChange={(e) => mudar({ perfil: e.target.value })}
      >
        <option value="">
          {h.aluna}: {h.todas}
        </option>
        {alunas.map((a) => (
          <option key={a.id} value={a.id}>
            {a.nome}
          </option>
        ))}
      </select>
      <select
        aria-label={h.acao}
        className={seletor}
        value={f.acao}
        onChange={(e) => mudar({ acao: e.target.value })}
      >
        <option value="">
          {h.acao}: {h.todas}
        </option>
        {Object.entries(nomes).map(([v, n]) => (
          <option key={v} value={v}>
            {n}
          </option>
        ))}
      </select>
      <input
        aria-label={h.mes}
        type="month"
        className={seletor}
        value={f.mes}
        onChange={(e) => mudar({ mes: e.target.value })}
      />
    </div>
  )
}

function TabelaHistorico({ lista, total }: { lista: Lancamento[]; total: number }) {
  const nomes = useNomesAcoes()
  return (
    <Tabela colunas={h.colunas}>
      {lista.map((l) => (
        <tr key={l.id} className="border-b border-[#F4F5F4] last:border-b-0">
          <td className="px-3.5 py-3 font-bold text-tinta">{l.perfis?.nome ?? '-'}</td>
          <td className="px-3.5 py-3">
            {nomes[l.acao] ?? l.acao}
            {l.motivo && <span className="block text-xs text-suave">{l.motivo}</span>}
          </td>
          <td
            className={`px-3.5 py-3 font-bold ${l.pontos > 0 ? 'text-[#0E6B45]' : 'text-terracota-escuro'}`}
          >
            {l.pontos > 0 ? `+${l.pontos}` : l.pontos}
          </td>
          <td className="px-3.5 py-3 text-suave">
            {formatarData(new Date(`${l.dia}T12:00:00-03:00`))}
          </td>
        </tr>
      ))}
      {total === 0 && (
        <tr>
          <td colSpan={4} className="px-3.5 py-10 text-center text-[13px] text-suave">
            {h.vazio}
          </td>
        </tr>
      )}
    </Tabela>
  )
}

/** Histórico de pontos com filtro por aluna, ação e mês, e o "Lançar ajuste". */
export function AbaHistorico() {
  const [f, setF] = useState<FiltroHistorico>({
    perfil: '',
    acao: '',
    mes: '',
    pagina: 1,
    tamanho: 10,
  })
  const [ajuste, setAjuste] = useState(false)
  const lista = useLancamentos(f)
  const mudar = (p: Partial<FiltroHistorico>) => setF((x) => ({ ...x, pagina: 1, ...p }))
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Filtros f={f} mudar={mudar} />
        <button type="button" className={classeBrilho('dourado')} onClick={() => setAjuste(true)}>
          {h.ajuste}
        </button>
      </div>
      {lista.isPending ? (
        <Estado tipo="carregando" />
      ) : lista.isError ? (
        <Estado tipo="erro" tentar={() => lista.refetch()} />
      ) : (
        <>
          <TabelaHistorico lista={lista.data.lista} total={lista.data.total} />
          <Paginacao
            pagina={f.pagina}
            tamanho={f.tamanho}
            total={lista.data.total}
            aoMudar={(pagina, tamanho) => setF((x) => ({ ...x, pagina, tamanho }))}
          />
        </>
      )}
      {ajuste && <AjusteJanela aoFechar={() => setAjuste(false)} />}
    </>
  )
}
