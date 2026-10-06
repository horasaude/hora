import { useState, type ReactNode } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { situacaoDesafio, type SituacaoDesafio } from '@/domain/painel'
import { diaEmBrasilia, diaMesDeData } from '@/lib/datas'
import type { Desafio, NumerosDesafio } from '../api/modulos.api'
import { DesafioDetalhe } from '../components/DesafioDetalhe'
import { Estado } from '../components/Estado'
import { botaoPrincipal, Divisao, Quadro, type Numero } from '../components/Quadro'
import { EtiquetaDesafio } from '../components/SituacaoDesafio'
import { celula, Etiqueta, LinhaTabela, Tabela } from '../components/Tabela'
import { useDesafios, useNumerosDesafios } from '../hooks/useModulos'
import { textos } from '../textos'

const t = textos.desafios
type Linha = { desafio: Desafio; situacao: SituacaoDesafio; numeros?: NumerosDesafio }

function numeros(linhas: Linha[], alunas: number): Numero[] {
  const ativos = linhas.filter((l) => l.situacao === 'ativo')
  const proximo = [...ativos].sort((a, b) => a.desafio.fim.localeCompare(b.desafio.fim))[0]
  return [
    { valor: String(ativos.length), rotulo: t.ativos, tom: 'salvia' },
    { valor: String(alunas), rotulo: t.participando, tom: 'ocre' },
    proximo
      ? {
          valor: diaMesDeData(proximo.desafio.fim),
          rotulo: t.proximo(proximo.desafio.nome),
          tom: 'terracota',
        }
      : { valor: t.nenhum, rotulo: t.semProximo, tom: 'terracota' },
  ]
}

function TabelaDesafios({ linhas, ativo }: { linhas: Linha[]; ativo?: string }) {
  return (
    <Tabela colunas={[t.coluna, t.colunaPeriodo, t.colunaGente, textos.status]}>
      {linhas.map(({ desafio: d, situacao, numeros: n }) => (
        <LinhaTabela
          key={d.id}
          ativa={d.id === ativo}
          para={`/app/admin/desafios/${d.id}`}
          titulo={d.nome}
          marca={<Etiqueta tom="ocre">{t.tipos[d.tipo_checkin]}</Etiqueta>}
        >
          <td className={celula}>{t.periodo(diaMesDeData(d.inicio), diaMesDeData(d.fim))}</td>
          <td className={celula}>{n?.participantes ?? 0}</td>
          <td className="px-5 py-4">
            <EtiquetaDesafio situacao={situacao} />
          </td>
        </LinhaTabela>
      ))}
    </Tabela>
  )
}

/** Desafios e prêmios: resumo, tabela e o desafio aberto à direita. */
export function DesafiosPage() {
  const desafios = useDesafios()
  const contas = useNumerosDesafios()
  const { desafioId } = useParams()
  const novo = useLocation().pathname.endsWith('/novo')
  const [hoje] = useState(() => diaEmBrasilia(new Date()))
  const linhas: Linha[] = (desafios.data ?? []).map((d) => ({
    desafio: d,
    situacao: situacaoDesafio(d, hoje),
    numeros: contas.data?.porDesafio.find((n) => n.id === d.id),
  }))
  const atual = novo ? undefined : (linhas.find((l) => l.desafio.id === desafioId) ?? linhas[0])
  const acao = (
    <Link to="/app/admin/desafios/novo" className={botaoPrincipal}>
      {t.novo}
    </Link>
  )
  let corpo: ReactNode
  if (desafios.isPending) corpo = <Estado tipo="carregando" />
  else if (desafios.isError) corpo = <Estado tipo="erro" tentar={() => desafios.refetch()} />
  else if (linhas.length === 0 && !novo) corpo = <Estado tipo="vazio" texto={t.vazio} acao={acao} />
  else {
    corpo = (
      <Divisao
        tabela={linhas.length ? <TabelaDesafios linhas={linhas} ativo={atual?.desafio.id} /> : null}
        detalhe={
          <DesafioDetalhe
            key={atual?.desafio.id ?? 'novo'}
            desafio={atual?.desafio}
            situacao={atual?.situacao}
            numeros={atual?.numeros}
          />
        }
      />
    )
  }
  return (
    <Quadro titulo={t.pagina} acao={acao} numeros={numeros(linhas, contas.data?.alunas ?? 0)}>
      {corpo}
    </Quadro>
  )
}
