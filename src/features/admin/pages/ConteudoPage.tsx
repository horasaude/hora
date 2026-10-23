import { Voltar, classeBrilho } from '@/components/ui'
import { useState, type ReactNode } from 'react'
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom'
import type { Tema } from '../api/conteudo.api'
import { AulaJanela } from '../components/AulaJanela'
import { Estado } from '../components/Estado'
import { ComeceAquiJanela } from '../components/ComeceAquiJanela'
import { NovoTema } from '../components/NovoTemaEtapa'
import { Quadro, type Numero } from '../components/Quadro'
import { TabelaTemas } from '../components/TabelaTemas'
import { TemaDetalhe } from '../components/TemaDetalhe'
import { useSituacaoAulas, useTemas } from '../hooks/usePainel'
import { textos } from '../textos'
import { doTema } from '../textos/doTema'

const t = textos.temas

function numeros(temas: Tema[], aulas: { publicado: boolean }[]): Numero[] {
  const publicadas = aulas.filter((a) => a.publicado).length
  return [
    { valor: String(temas.filter((x) => x.publicado).length), rotulo: t.publicados, tom: 'salvia' },
    { valor: String(publicadas), rotulo: t.aulasPublicadas, tom: 'ocre' },
    { valor: String(aulas.length - publicadas), rotulo: t.aulasRascunho, tom: 'terracota' },
  ]
}

/** Tema aberto (página inteira) e a janela da aula quando o endereço é de aula. */
function useAberto() {
  const { temaId, aulaId } = useParams()
  const [busca] = useSearchParams()
  const { pathname } = useLocation()
  const tema = temaId ?? busca.get('tema') ?? undefined
  const aula = pathname.includes('/aulas/') ? (
    <AulaJanela
      key={aulaId ?? `nova-${busca.get('tema')}`}
      aulaId={aulaId}
      temaId={busca.get('tema')}
    />
  ) : null
  return { tema, aula }
}

/** Configuração do tema em tela cheia, com a seta para a lista de temas. */
function TemaAberto({ temaId, aula }: { temaId: string; aula: ReactNode }) {
  return (
    <section className="flex flex-col gap-5">
      <Voltar para="/app/admin/conteudo" rotulo={doTema.todosTemas}>
        {doTema.todosTemas}
      </Voltar>
      <TemaDetalhe key={temaId} temaId={temaId} />
      {aula}
    </section>
  )
}

/** Conteúdo: resumo e os temas em tabela; clicar no tema abre a configuração dele. */
export function ConteudoPage() {
  const temas = useTemas()
  const aulas = useSituacaoAulas()
  const [janela, setJanela] = useState<'comece' | 'tema' | null>(null)
  const { tema, aula } = useAberto()
  if (tema) return <TemaAberto temaId={tema} aula={aula} />
  const lista = temas.data ?? []
  const c = textos.conteudo
  const novo = (
    <span className="flex flex-wrap gap-2">
      <Link to="/app/admin/aulas/nova" className={classeBrilho('verde')}>
        {c.novaAula}
      </Link>
      <Link to="/app/previa?dia=1" className={classeBrilho('escuro')}>
        {t.previsualizar}
      </Link>
      <button type="button" className={classeBrilho('cinza')} onClick={() => setJanela('tema')}>
        {c.novoTema}
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
  else corpo = <TabelaTemas temas={lista} />
  return (
    <Quadro titulo={t.pagina} acao={novo} numeros={numeros(lista, aulas.data ?? [])}>
      {corpo}
      {janela === 'comece' && <ComeceAquiJanela aoFechar={fechar} />}
      {janela === 'tema' && <NovoTema aoFechar={fechar} />}
      {aula}
    </Quadro>
  )
}
