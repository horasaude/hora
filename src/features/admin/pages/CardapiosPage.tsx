import { classeBrilho } from '@/components/ui'
import type { ReactNode } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import type { Cardapio } from '../api/modulos.api'
import { CardapioDetalhe } from '../components/CardapioDetalhe'
import { CardapioForm } from '../components/CardapioForm'
import { Estado } from '../components/Estado'
import { Divisao, Quadro, type Numero } from '../components/Quadro'
import { celula, Etiqueta, LinhaTabela, Situacao, Tabela } from '../components/Tabela'
import { useCardapios } from '../hooks/useModulos'
import { refeicoesPreenchidas } from '../refeicoes'
import { textos } from '../textos'

const t = textos.cardapios

function numeros(lista: Cardapio[]): Numero[] {
  const publicados = lista.filter((c) => c.publicado).length
  return [
    { valor: String(publicados), rotulo: t.publicados, tom: 'salvia' },
    { valor: String(lista.length - publicados), rotulo: t.rascunhos, tom: 'ocre' },
  ]
}

function TabelaCardapios({ lista, ativo }: { lista: Cardapio[]; ativo?: string }) {
  return (
    <Tabela colunas={[t.coluna, t.colunaRefeicoes, textos.status]}>
      {lista.map((c) => (
        <LinhaTabela
          key={c.id}
          ativa={c.id === ativo}
          para={`/app/admin/cardapios/${c.id}`}
          titulo={c.titulo}
          marca={<Etiqueta tom="neutro">{c.objetivo}</Etiqueta>}
        >
          <td className={celula}>{t.refeicoes(refeicoesPreenchidas(c))}</td>
          <td className="px-3.5 py-3">
            <Situacao publicado={c.publicado} />
          </td>
        </LinhaTabela>
      ))}
    </Tabela>
  )
}

/** Cardápios por objetivo: resumo, tabela e o cardápio aberto à direita; criar e editar abrem a janela. */
export function CardapiosPage() {
  const cardapios = useCardapios()
  const { cardapioId } = useParams()
  const navegar = useNavigate()
  const novo = useLocation().pathname.endsWith('/novo')
  const lista = cardapios.data ?? []
  const atual = lista.find((c) => c.id === cardapioId) ?? lista[0]
  const acao = (
    <Link to="/app/admin/cardapios/novo" className={classeBrilho('dourado')}>
      {t.novo}
    </Link>
  )
  let corpo: ReactNode
  if (cardapios.isPending) corpo = <Estado tipo="carregando" />
  else if (cardapios.isError) corpo = <Estado tipo="erro" tentar={() => cardapios.refetch()} />
  else if (!atual) corpo = <Estado tipo="vazio" texto={t.vazio} acao={acao} />
  else {
    corpo = (
      <Divisao
        tabela={<TabelaCardapios lista={lista} ativo={atual.id} />}
        detalhe={<CardapioDetalhe key={atual.id} cardapio={atual} />}
      />
    )
  }
  return (
    <Quadro titulo={t.pagina} acao={acao} numeros={numeros(lista)}>
      {corpo}
      {novo && <CardapioForm aoFechar={() => navegar('/app/admin/cardapios')} />}
    </Quadro>
  )
}
