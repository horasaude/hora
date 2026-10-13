import { classeBrilho } from '@/components/ui'
import { useState, type ReactNode } from 'react'
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom'
import type { Tema } from '../api/conteudo.api'
import { AulaJanela } from '../components/AulaJanela'
import { Estado } from '../components/Estado'
import { ComeceAquiJanela } from '../components/ComeceAquiJanela'
import { NovaEtapa, NovoTema } from '../components/NovoTemaEtapa'
import { Divisao, Quadro, type Numero } from '../components/Quadro'
import { TabelaTemas } from '../components/TabelaTemas'
import { TemaDetalhe } from '../components/TemaDetalhe'
import { useSituacaoAulas, useTemas } from '../hooks/usePainel'
import { textos } from '../textos'

const t = textos.temas

function numeros(temas: Tema[], aulas: { publicado: boolean }[]): Numero[] {
  const publicadas = aulas.filter((a) => a.publicado).length
  return [
    { valor: String(temas.filter((x) => x.publicado).length), rotulo: t.publicados, tom: 'salvia' },
    { valor: String(publicadas), rotulo: t.aulasPublicadas, tom: 'ocre' },
    { valor: String(aulas.length - publicadas), rotulo: t.aulasRascunho, tom: 'terracota' },
  ]
}

/** Tema aberto à direita (só detalhes) e a janela da aula quando o endereço é de aula. */
function useDetalhe(lista: Tema[]) {
  const { temaId, aulaId } = useParams()
  const [busca] = useSearchParams()
  const { pathname } = useLocation()
  const ativo = temaId ?? busca.get('tema') ?? lista[0]?.id
  const detalhe: ReactNode = ativo ? <TemaDetalhe key={ativo} temaId={ativo} /> : null
  const aula = pathname.includes('/aulas/') ? (
    <AulaJanela
      key={aulaId ?? `nova-${busca.get('etapa')}`}
      aulaId={aulaId}
      etapaId={busca.get('etapa') ?? ''}
      temaId={busca.get('tema')}
    />
  ) : null
  return { ativo, detalhe, aula }
}

/** Conteúdo: resumo, temas em tabela, o tema aberto à direita; criar e editar abrem a janela. */
export function ConteudoPage() {
  const temas = useTemas()
  const aulas = useSituacaoAulas()
  const [janela, setJanela] = useState<'comece' | 'tema' | 'etapa' | null>(null)
  const lista = temas.data ?? []
  const { ativo, detalhe, aula } = useDetalhe(lista)
  const c = textos.conteudo
  const novo = (
    <span className="flex flex-wrap gap-2">
      <Link to="/app/admin/aulas/nova" className={classeBrilho('verde')}>
        {c.novaAula}
      </Link>
      <Link to="/app/previa?dia=1" className={classeBrilho('escuro')}>
        {t.verComoAluna}
      </Link>
      <button type="button" className={classeBrilho('cinza')} onClick={() => setJanela('tema')}>
        {c.novoTema}
      </button>
      <button type="button" className={classeBrilho('cinza')} onClick={() => setJanela('etapa')}>
        {c.novaEtapa}
      </button>
      <button type="button" className={classeBrilho('dourado')} onClick={() => setJanela('comece')}>
        {t.comece}
      </button>
    </span>
  )
  const fechar = () => setJanela(null)
  let corpo: ReactNode
  if (temas.isPending) corpo = <Estado tipo="carregando" />
  else if (temas.isError) corpo = <Estado tipo="erro" tentar={() => temas.refetch()} />
  else if (lista.length === 0) corpo = <Estado tipo="vazio" texto={t.vazio} acao={novo} />
  else {
    corpo = <Divisao tabela={<TabelaTemas temas={lista} ativo={ativo} />} detalhe={detalhe} />
  }
  return (
    <Quadro titulo={t.pagina} acao={novo} numeros={numeros(lista, aulas.data ?? [])}>
      {corpo}
      {janela === 'comece' && <ComeceAquiJanela aoFechar={fechar} />}
      {janela === 'tema' && <NovoTema aoFechar={fechar} />}
      {janela === 'etapa' && <NovaEtapa temaId={ativo} aoFechar={fechar} />}
      {aula}
    </Quadro>
  )
}
