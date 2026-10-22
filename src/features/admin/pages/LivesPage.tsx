import { classeBrilho } from '@/components/ui'
import { useState, type ReactNode } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { formatarDataHora } from '@/lib/datas'
import type { Live } from '../api/agenda.api'
import { ConectarMeet } from '../components/ConectarMeet'
import { Estado } from '../components/Estado'
import { LiveDetalhe } from '../components/LiveDetalhe'
import { LiveForm } from '../components/LiveForm'
import { Divisao, Quadro, type Numero } from '../components/Quadro'
import { CelulaAcao, celula, Etiqueta, LinhaTabela, Situacao, Tabela } from '../components/Tabela'
import { useLives } from '../hooks/usePainel'
import { textos } from '../textos'
import { meet } from '../textos/meet'

const t = textos.lives
const semAno = (d: Date) => formatarDataHora(d).replace(/\/\d{4}/, '')

function numeros(lista: Live[], agora: number): Numero[] {
  const futuras = lista
    .filter((l) => l.publicado && new Date(l.data).getTime() > agora)
    .sort((a, b) => a.data.localeCompare(b.data))
  const proxima = futuras[0]
  return [
    {
      valor: proxima ? semAno(new Date(proxima.data)) : t.nenhuma,
      rotulo: t.proxima,
      tom: 'salvia',
    },
    { valor: String(futuras.length), rotulo: t.agendadas, tom: 'ocre' },
  ]
}

/** Sala aberta até o fim da live: a profissional entra por aqui. */
const salaAberta = (l: Live, agora = Date.now()) =>
  l.sala && new Date(l.data).getTime() + l.duracao_minutos * 60_000 > agora ? l.sala : null

function EntrarNaLive({ live }: { live: Live }) {
  const sala = salaAberta(live)
  return (
    <CelulaAcao>
      {sala && (
        <a href={sala} target="_blank" rel="noreferrer" className={classeBrilho('dourado', 'sm')}>
          {meet.entrarLive}
        </a>
      )}
    </CelulaAcao>
  )
}

function TabelaLives({ lista, ativa }: { lista: Live[]; ativa?: string }) {
  return (
    <Tabela colunas={[t.coluna, t.colunaData, textos.status, meet.sala]}>
      {lista.map((l) => (
        <LinhaTabela
          key={l.id}
          ativa={l.id === ativa}
          para={`/app/admin/lives/${l.id}`}
          titulo={l.tema}
          marca={
            l.convidadas[0] ? (
              <Etiqueta tom="neutro">{l.convidadas.map((c) => c.nome).join(', ')}</Etiqueta>
            ) : undefined
          }
        >
          <td className={celula}>{formatarDataHora(new Date(l.data))}</td>
          <td className="px-3.5 py-3">
            <Situacao publicado={l.publicado} />
          </td>
          <EntrarNaLive live={l} />
        </LinhaTabela>
      ))}
    </Tabela>
  )
}

/** Lives: resumo, tabela e a live aberta à direita; criar e editar abrem a janela. */
export function LivesPage() {
  const lives = useLives()
  const { liveId } = useParams()
  const { pathname } = useLocation()
  const [agora] = useState(() => Date.now())
  const lista = lives.data ?? []
  const navegar = useNavigate()
  const nova = pathname.endsWith('/nova')
  const atual = lista.find((x) => x.id === liveId) ?? lista[0]
  const acao = (
    <Link to="/app/admin/lives/nova" className={classeBrilho('dourado')}>
      {t.nova}
    </Link>
  )
  let corpo: ReactNode
  if (lives.isPending) corpo = <Estado tipo="carregando" />
  else if (lives.isError) corpo = <Estado tipo="erro" tentar={() => lives.refetch()} />
  else if (!atual) corpo = <Estado tipo="vazio" texto={t.vazio} acao={acao} />
  else {
    corpo = (
      <Divisao
        tabela={<TabelaLives lista={lista} ativa={atual.id} />}
        detalhe={<LiveDetalhe key={atual.id} live={atual} />}
      />
    )
  }
  return (
    <Quadro
      titulo={t.pagina}
      acao={
        <div className="flex flex-wrap items-start gap-3">
          <ConectarMeet />
          {acao}
        </div>
      }
      numeros={numeros(lista, agora)}
    >
      {corpo}
      {nova && <LiveForm aoFechar={() => navegar('/app/admin/lives')} />}
    </Quadro>
  )
}
