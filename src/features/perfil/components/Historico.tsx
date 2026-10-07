import { useState } from 'react'
import { Carregando, Cartao, ErroCarregar, Paginacao } from '@/components/ui'
import { diaMesDeData } from '@/lib/datas'
import type { Lancamento } from '../api/pontos.api'
import { useHistorico } from '../hooks/usePerfil'
import { textos } from '../textos'

const t = textos.historico

function Linhas({ linhas }: { linhas: Lancamento[] }) {
  return (
    <ul className="flex flex-col divide-y divide-linha">
      {linhas.map((l) => (
        <li key={l.id} className="flex items-center gap-3 py-2.5 text-sm">
          <span className="w-12 shrink-0 text-suave">{diaMesDeData(l.dia)}</span>
          <span className="min-w-0 flex-1 text-tinta">{t.acao(l.acao, l.nome, l.motivo)}</span>
          <span
            className={`font-bold ${l.pontos > 0 ? 'text-verde-escuro' : 'text-terracota-escuro'}`}
          >
            {l.pontos > 0 ? `+${l.pontos}` : l.pontos}
          </span>
        </li>
      ))}
    </ul>
  )
}

/** Histórico de pontos: ação, pontos e data, de 10 em 10 com 25, 50 ou 100 por página. */
export function Historico() {
  const [pag, setPag] = useState({ pagina: 1, tamanho: 10 })
  const h = useHistorico(pag.pagina, pag.tamanho)
  const paginas = Math.max(1, Math.ceil((h.data?.total ?? 0) / pag.tamanho))
  return (
    <Cartao className="flex flex-col gap-3">
      <h2 className="text-[19px] font-bold text-verde-escuro">{t.titulo}</h2>
      {h.isPending ? (
        <Carregando texto={textos.carregando} />
      ) : h.isError ? (
        <ErroCarregar texto={textos.erro} tentar={textos.tentar} aoTentar={() => h.refetch()} />
      ) : h.data.total === 0 ? (
        <p className="py-4 text-center text-sm text-suave">{t.vazio}</p>
      ) : (
        <>
          <Linhas linhas={h.data.linhas} />
          <Paginacao
            pagina={pag.pagina}
            paginas={paginas}
            tamanho={pag.tamanho}
            aoMudar={(pagina, tamanho) => setPag({ pagina, tamanho })}
            textos={t}
          />
        </>
      )}
    </Cartao>
  )
}
