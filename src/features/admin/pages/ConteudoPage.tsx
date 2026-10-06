import { classeBrilho } from '@/components/ui'
import { useState, type ReactNode } from 'react'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { salvarTema, type Tema } from '../api/conteudo.api'
import { AulaDetalhe } from '../components/AulaDetalhe'
import { CartaoDetalhe } from '../components/CartaoDetalhe'
import { Estado } from '../components/Estado'
import { FormNome } from '../components/FormNome'
import { Divisao, Quadro, type Numero } from '../components/Quadro'
import { TabelaTemas } from '../components/TabelaTemas'
import { TemaDetalhe } from '../components/TemaDetalhe'
import { useSalvar, useSituacaoAulas, useTemas } from '../hooks/usePainel'
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

function NovoTema({ aoCancelar }: { aoCancelar: () => void }) {
  const salvar = useSalvar(salvarTema)
  const navegar = useNavigate()
  return (
    <CartaoDetalhe titulo={t.novo}>
      <FormNome
        rotulo={t.campoTitulo}
        aoCancelar={aoCancelar}
        aoSalvar={async (dados) => {
          const novo = await salvar.mutateAsync(dados)
          aoCancelar()
          navegar(`/app/admin/conteudo/${novo.id}`)
        }}
      />
    </CartaoDetalhe>
  )
}

/** Abre à direita: tema novo, aula (nova ou em edição) ou o tema escolhido. */
function useDetalhe(lista: Tema[], criando: boolean, fecharNovo: () => void) {
  const { temaId, aulaId } = useParams()
  const [busca] = useSearchParams()
  const { pathname } = useLocation()
  const ativo = temaId ?? busca.get('tema') ?? lista[0]?.id
  let detalhe: ReactNode = null
  if (criando) detalhe = <NovoTema aoCancelar={fecharNovo} />
  else if (pathname.includes('/aulas/')) {
    detalhe = (
      <AulaDetalhe
        key={aulaId ?? `nova-${busca.get('etapa')}`}
        aulaId={aulaId}
        etapaId={busca.get('etapa') ?? ''}
        temaId={busca.get('tema')}
      />
    )
  } else if (ativo) detalhe = <TemaDetalhe key={ativo} temaId={ativo} />
  return { ativo, detalhe }
}

/** Conteúdo: resumo, temas em tabela e o tema aberto à direita com etapas e aulas. */
export function ConteudoPage() {
  const temas = useTemas()
  const aulas = useSituacaoAulas()
  const { pathname } = useLocation()
  const [criandoEm, setCriandoEm] = useState<string | null>(null)
  const lista = temas.data ?? []
  const { ativo, detalhe } = useDetalhe(lista, criandoEm === pathname, () => setCriandoEm(null))
  const novo = (
    <button
      type="button"
      className={classeBrilho('dourado')}
      onClick={() => setCriandoEm(pathname)}
    >
      {t.novo}
    </button>
  )
  let corpo: ReactNode
  if (temas.isPending) corpo = <Estado tipo="carregando" />
  else if (temas.isError) corpo = <Estado tipo="erro" tentar={() => temas.refetch()} />
  else if (lista.length === 0 && !detalhe)
    corpo = <Estado tipo="vazio" texto={t.vazio} acao={novo} />
  else {
    const tabela = lista.length ? <TabelaTemas temas={lista} ativo={ativo} /> : null
    corpo = <Divisao tabela={tabela} detalhe={detalhe} />
  }
  return (
    <Quadro titulo={t.pagina} acao={novo} numeros={numeros(lista, aulas.data ?? [])}>
      {corpo}
    </Quadro>
  )
}
