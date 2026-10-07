import { classeBrilho } from '@/components/ui'
import { useState, type ReactNode } from 'react'
import { useLocation, useParams, useSearchParams } from 'react-router-dom'
import type { Tema } from '../api/conteudo.api'
import { AulaJanela } from '../components/AulaJanela'
import { Estado } from '../components/Estado'
import { ComeceAquiJanela } from '../components/ComeceAquiJanela'
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
  const [comece, setComece] = useState(false)
  const lista = temas.data ?? []
  const { ativo, detalhe, aula } = useDetalhe(lista)
  const novo = (
    <button type="button" className={classeBrilho('dourado')} onClick={() => setComece(true)}>
      {t.comece}
    </button>
  )
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
      {comece && <ComeceAquiJanela aoFechar={() => setComece(false)} />}
      {aula}
    </Quadro>
  )
}
