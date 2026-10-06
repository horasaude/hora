import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { classeBrilho, EtiquetaBrilho } from '@/components/ui'
import { Estado } from '../../components/Estado'
import { Quadro } from '../../components/Quadro'
import { celula, LinhaTabela, Situacao, Tabela } from '../../components/Tabela'
import type { ReceitaCompleta } from '../api/receitas.api'
import { BarraFiltros, CampoBusca, Filtros } from '../components/Ferramentas'
import { LISTA_RECEITAS } from '../hooks/useEditorReceita'
import { useReceitas, useTags } from '../hooks/usePlano'
import { porcaoDaReceita } from '../opcoes'
import { textos } from '../textos'
import { tReceitas as t } from '../textos2'

function TabelaReceitas({ dados }: { dados: ReceitaCompleta[] }) {
  return (
    <Tabela colunas={t.colunas}>
      {dados.map((r) => (
        <LinhaTabela
          key={r.id}
          ativa={false}
          para={`${LISTA_RECEITAS}/${r.id}`}
          titulo={r.nome}
          marca={
            r.tags.length > 0 && (
              <span className="flex flex-wrap gap-1">
                {r.tags.map((x) => (
                  <EtiquetaBrilho key={x} tom="cinza">
                    {x}
                  </EtiquetaBrilho>
                ))}
              </span>
            )
          }
        >
          <td className={celula}>{r.porcoes}</td>
          <td className={celula}>{r.calcular ? textos.kcal(porcaoDaReceita(r).kcal) : '-'}</td>
          <td className="px-3.5 py-3">
            <Situacao publicado={r.publicado} />
          </td>
        </LinhaTabela>
      ))}
      {dados.length === 0 && (
        <tr>
          <td colSpan={4} className="px-3.5 py-10 text-center text-[13px] text-suave">
            {textos.semResultado}
          </td>
        </tr>
      )}
    </Tabela>
  )
}

/** Receitas: busca por nome e por tag; abrir leva para a receita em página inteira. */
export function ReceitasPage() {
  const [busca, setBusca] = useState('')
  const [tag, setTag] = useState('')
  const lista = useReceitas(busca, tag)
  const tags = useTags().data ?? []
  const nova = (
    <Link to={`${LISTA_RECEITAS}/nova`} className={classeBrilho('dourado')}>
      {t.nova}
    </Link>
  )
  const dados = lista.data ?? []
  let corpo: ReactNode
  if (lista.isPending) corpo = <Estado tipo="carregando" />
  else if (lista.isError) corpo = <Estado tipo="erro" tentar={() => lista.refetch()} />
  else if (dados.length === 0 && !busca && !tag)
    corpo = <Estado tipo="vazio" texto={t.vazio} acao={nova} />
  else {
    corpo = <TabelaReceitas dados={dados} />
  }
  const publicadas = dados.filter((r) => r.publicado).length
  return (
    <Quadro
      titulo={t.titulo}
      acao={nova}
      numeros={[
        { valor: String(publicadas), rotulo: t.publicadas, tom: 'salvia' },
        { valor: String(dados.length - publicadas), rotulo: t.rascunhos, tom: 'ocre' },
      ]}
    >
      <BarraFiltros>
        <Filtros
          rotulo={t.filtroTag}
          valor={tag}
          aoMudar={setTag}
          opcoes={tags.map((x) => ({ valor: x, nome: x }))}
        />
        <CampoBusca valor={busca} aoMudar={setBusca} />
      </BarraFiltros>
      {corpo}
    </Quadro>
  )
}
