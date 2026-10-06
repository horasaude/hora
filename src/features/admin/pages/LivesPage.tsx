import { classeBrilho } from '@/components/ui'
import { useState, type ReactNode } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { formatarDataHora } from '@/lib/datas'
import type { Live } from '../api/agenda.api'
import { Estado } from '../components/Estado'
import { LiveDetalhe } from '../components/LiveDetalhe'
import { Divisao, Quadro, type Numero } from '../components/Quadro'
import { celula, Etiqueta, LinhaTabela, Situacao, Tabela } from '../components/Tabela'
import { useLives } from '../hooks/usePainel'
import { textos } from '../textos'

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

function TabelaLives({ lista, ativa }: { lista: Live[]; ativa?: string }) {
  return (
    <Tabela colunas={[t.coluna, t.colunaData, textos.status]}>
      {lista.map((l) => (
        <LinhaTabela
          key={l.id}
          ativa={l.id === ativa}
          para={`/app/admin/lives/${l.id}`}
          titulo={l.tema}
          marca={l.convidada ? <Etiqueta tom="neutro">{l.convidada}</Etiqueta> : undefined}
        >
          <td className={celula}>{formatarDataHora(new Date(l.data))}</td>
          <td className="px-3.5 py-3">
            <Situacao publicado={l.publicado} />
          </td>
        </LinhaTabela>
      ))}
    </Tabela>
  )
}

/** Lives: resumo, tabela e a live aberta à direita (ou o formulário de nova). */
export function LivesPage() {
  const lives = useLives()
  const { liveId } = useParams()
  const { pathname } = useLocation()
  const [agora] = useState(() => Date.now())
  const lista = lives.data ?? []
  const nova = pathname.endsWith('/nova')
  const atual = nova ? undefined : (lista.find((l) => l.id === liveId) ?? lista[0])
  const acao = (
    <Link to="/app/admin/lives/nova" className={classeBrilho('dourado')}>
      {t.nova}
    </Link>
  )
  let corpo: ReactNode
  if (lives.isPending) corpo = <Estado tipo="carregando" />
  else if (lives.isError) corpo = <Estado tipo="erro" tentar={() => lives.refetch()} />
  else if (lista.length === 0 && !nova) corpo = <Estado tipo="vazio" texto={t.vazio} acao={acao} />
  else {
    corpo = (
      <Divisao
        tabela={lista.length ? <TabelaLives lista={lista} ativa={atual?.id} /> : null}
        detalhe={<LiveDetalhe key={atual?.id ?? 'nova'} live={atual} />}
      />
    )
  }
  return (
    <Quadro titulo={t.pagina} acao={acao} numeros={numeros(lista, agora)}>
      {corpo}
    </Quadro>
  )
}
