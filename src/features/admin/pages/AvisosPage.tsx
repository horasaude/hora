import { classeBrilho } from '@/components/ui'
import { useState, type ReactNode } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { formatarDataHora } from '@/lib/datas'
import type { Aviso } from '../api/agenda.api'
import { AvisoDetalhe } from '../components/AvisoDetalhe'
import { Estado } from '../components/Estado'
import { Divisao, Quadro, type Numero } from '../components/Quadro'
import { celula, LinhaTabela, Situacao, Tabela } from '../components/Tabela'
import { useAvisos } from '../hooks/usePainel'
import { textos } from '../textos'

const t = textos.avisos

function numeros(lista: Aviso[], agora: number): Numero[] {
  const ativos = lista.filter((a) => a.publicado && new Date(a.publicar_em).getTime() <= agora)
  return [{ valor: String(ativos.length), rotulo: t.ativos, tom: 'salvia' }]
}

function TabelaAvisos({ lista, ativo }: { lista: Aviso[]; ativo?: string }) {
  return (
    <Tabela colunas={[t.coluna, t.colunaData, textos.status]}>
      {lista.map((a) => (
        <LinhaTabela
          key={a.id}
          ativa={a.id === ativo}
          para={`/app/admin/avisos/${a.id}`}
          titulo={a.titulo}
        >
          <td className={celula}>{formatarDataHora(new Date(a.publicar_em))}</td>
          <td className="px-5 py-4">
            <Situacao publicado={a.publicado} />
          </td>
        </LinhaTabela>
      ))}
    </Tabela>
  )
}

/** Avisos: resumo, tabela e o aviso aberto à direita (ou o formulário de novo). */
export function AvisosPage() {
  const avisos = useAvisos()
  const { avisoId } = useParams()
  const { pathname } = useLocation()
  const [agora] = useState(() => Date.now())
  const lista = avisos.data ?? []
  const novo = pathname.endsWith('/novo')
  const atual = novo ? undefined : (lista.find((a) => a.id === avisoId) ?? lista[0])
  const acao = (
    <Link to="/app/admin/avisos/novo" className={classeBrilho('escuro')}>
      {t.novo}
    </Link>
  )
  let corpo: ReactNode
  if (avisos.isPending) corpo = <Estado tipo="carregando" />
  else if (avisos.isError) corpo = <Estado tipo="erro" tentar={() => avisos.refetch()} />
  else if (lista.length === 0 && !novo) corpo = <Estado tipo="vazio" texto={t.vazio} acao={acao} />
  else {
    corpo = (
      <Divisao
        tabela={lista.length ? <TabelaAvisos lista={lista} ativo={atual?.id} /> : null}
        detalhe={<AvisoDetalhe key={atual?.id ?? 'novo'} aviso={atual} />}
      />
    )
  }
  return (
    <Quadro titulo={t.pagina} acao={acao} numeros={numeros(lista, agora)}>
      {corpo}
    </Quadro>
  )
}
