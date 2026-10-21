import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { classeBrilho } from '@/components/ui'
import { Estado } from '../../components/Estado'
import { Quadro } from '../../components/Quadro'
import { useTemas } from '../../hooks/usePainel'
import { BarraFiltros, CampoBusca, Filtros } from '../components/Ferramentas'
import { TabelaCardapios } from '../components/TabelaCardapios'
import { LISTA_CARDAPIOS } from '../hooks/useEditorCardapio'
import { useCardapios } from '../hooks/usePlano'
import { tCardapios as t } from '../textos2'

/** Cardápios agrupados por tema (cada tema pode ter vários planos), busca, filtro por tema e etiqueta Publicado ou Rascunho. */
export function CardapiosPage() {
  const [busca, setBusca] = useState('')
  const [tema, setTema] = useState('')
  const lista = useCardapios(busca, tema)
  const temas = useTemas().data ?? []
  const dados = lista.data ?? []
  const novo = (
    <Link
      to={
        tema && tema !== 'sem' ? `${LISTA_CARDAPIOS}/novo?tema=${tema}` : `${LISTA_CARDAPIOS}/novo`
      }
      className={classeBrilho('dourado')}
    >
      {t.novo}
    </Link>
  )
  let corpo: ReactNode
  if (lista.isPending) corpo = <Estado tipo="carregando" />
  else if (lista.isError) corpo = <Estado tipo="erro" tentar={() => lista.refetch()} />
  else if (dados.length === 0 && !busca && !tema)
    corpo = <Estado tipo="vazio" texto={t.vazio} acao={novo} />
  else corpo = <TabelaCardapios dados={dados} temas={temas} />
  const publicados = dados.filter((c) => c.publicado).length
  return (
    <Quadro
      titulo={t.titulo}
      acao={novo}
      numeros={[
        { valor: String(publicados), rotulo: t.publicados, tom: 'salvia' },
        { valor: String(dados.length - publicados), rotulo: t.rascunhos, tom: 'ocre' },
      ]}
    >
      <BarraFiltros>
        <Filtros
          rotulo={t.filtroTema}
          valor={tema}
          aoMudar={setTema}
          opcoes={[
            ...temas.map((x) => ({ valor: x.id, nome: x.titulo })),
            { valor: 'sem', nome: t.semTema },
          ]}
        />
        <CampoBusca valor={busca} aoMudar={setBusca} />
      </BarraFiltros>
      {corpo}
    </Quadro>
  )
}
