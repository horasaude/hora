import { classeBrilho } from '@/components/ui'
import { useState, type ReactNode } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { formatarDataHora } from '@/lib/datas'
import type { Aviso } from '../api/agenda.api'
import { AvisoDetalhe } from '../components/AvisoDetalhe'
import { AvisoForm } from '../components/AvisoForm'
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
          <td className="px-3.5 py-3">
            <Situacao publicado={a.publicado} />
          </td>
        </LinhaTabela>
      ))}
    </Tabela>
  )
}

/** Avisos: resumo, tabela e o aviso aberto à direita; criar e editar abrem a janela. */
export function AvisosPage() {
  const avisos = useAvisos()
  const { avisoId } = useParams()
  const { pathname } = useLocation()
  const [agora] = useState(() => Date.now())
  const lista = avisos.data ?? []
  const navegar = useNavigate()
  const novo = pathname.endsWith('/novo')
  const atual = lista.find((x) => x.id === avisoId) ?? lista[0]
  const acao = (
    <Link to="/app/admin/avisos/novo" className={classeBrilho('dourado')}>
      {t.novo}
    </Link>
  )
  let corpo: ReactNode
  if (avisos.isPending) corpo = <Estado tipo="carregando" />
  else if (avisos.isError) corpo = <Estado tipo="erro" tentar={() => avisos.refetch()} />
  else if (!atual) corpo = <Estado tipo="vazio" texto={t.vazio} acao={acao} />
  else {
    corpo = (
      <Divisao
        tabela={<TabelaAvisos lista={lista} ativo={atual.id} />}
        detalhe={<AvisoDetalhe key={atual.id} aviso={atual} />}
      />
    )
  }
  return (
    <Quadro titulo={t.pagina} acao={acao} numeros={numeros(lista, agora)}>
      {corpo}
      {novo && <AvisoForm aoFechar={() => navegar('/app/admin/avisos')} />}
    </Quadro>
  )
}
