import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { classeBrilho, EtiquetaBrilho } from '@/components/ui'
import { totalCardapio } from '@/domain/nutricao'
import { Estado } from '../../components/Estado'
import { Quadro } from '../../components/Quadro'
import { celula, LinhaTabela, Situacao, Tabela } from '../../components/Tabela'
import type { CardapioLinha } from '../api/cardapios.api'
import { BarraFiltros, CampoBusca, Filtros } from '../components/Ferramentas'
import { LISTA_CARDAPIOS } from '../hooks/useEditorCardapio'
import { useCardapios } from '../hooks/usePlano'
import { lerRefeicoes } from '../schemas/plano'
import { OBJETIVOS_CARDAPIO, textos } from '../textos'
import { tCardapios as t } from '../textos2'

function TabelaCardapios({ dados }: { dados: CardapioLinha[] }) {
  return (
    <Tabela colunas={t.colunas}>
      {dados.map((c) => {
        const refeicoes = lerRefeicoes(c.refeicoes)
        return (
          <LinhaTabela
            key={c.id}
            ativa={false}
            para={`${LISTA_CARDAPIOS}/${c.id}`}
            titulo={c.titulo}
          >
            <td className="px-3.5 py-3">
              <EtiquetaBrilho tom="cinza">{c.objetivo}</EtiquetaBrilho>
            </td>
            <td className={celula}>{refeicoes.length}</td>
            <td className="px-3.5 py-3">
              {c.modelo === 'texto' ? (
                <span className="text-suave">{t.modelos.texto}</span>
              ) : (
                <EtiquetaBrilho tom="dourado">
                  {textos.kcal(totalCardapio(refeicoes).kcal)}
                </EtiquetaBrilho>
              )}
            </td>
            <td className="px-3.5 py-3">
              <Situacao publicado={c.publicado} />
            </td>
          </LinhaTabela>
        )
      })}
      {dados.length === 0 && (
        <tr>
          <td colSpan={5} className="px-3.5 py-10 text-center text-[13px] text-suave">
            {textos.semResultado}
          </td>
        </tr>
      )}
    </Tabela>
  )
}

/** Cardápios: busca, filtro por objetivo e etiqueta Publicado ou Rascunho; abrir leva à página inteira. */
export function CardapiosPage() {
  const [busca, setBusca] = useState('')
  const [objetivo, setObjetivo] = useState('')
  const lista = useCardapios(busca, objetivo)
  const dados = lista.data ?? []
  const novo = (
    <Link to={`${LISTA_CARDAPIOS}/novo`} className={classeBrilho('dourado')}>
      {t.novo}
    </Link>
  )
  let corpo: ReactNode
  if (lista.isPending) corpo = <Estado tipo="carregando" />
  else if (lista.isError) corpo = <Estado tipo="erro" tentar={() => lista.refetch()} />
  else if (dados.length === 0 && !busca && !objetivo)
    corpo = <Estado tipo="vazio" texto={t.vazio} acao={novo} />
  else corpo = <TabelaCardapios dados={dados} />
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
          rotulo={t.filtroObjetivo}
          valor={objetivo}
          aoMudar={setObjetivo}
          opcoes={OBJETIVOS_CARDAPIO.map((o) => ({ valor: o, nome: o }))}
        />
        <CampoBusca valor={busca} aoMudar={setBusca} />
      </BarraFiltros>
      {corpo}
    </Quadro>
  )
}
