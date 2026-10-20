import type { ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { classeBrilho } from '@/components/ui'
import { Estado } from '../../components/Estado'
import { Divisao, Quadro } from '../../components/Quadro'
import { LinhaTabela, Situacao, Tabela } from '../../components/Tabela'
import { textos } from '../../textos'
import { listarMateriaisNutricao, type MaterialNutricao } from '../api/materiais.api'
import { MaterialDetalhe } from '../components/MaterialDetalhe'
import { MaterialForm } from '../components/MaterialForm'
import { materiais as t } from '../textosMateriais'

function TabelaMateriais({ lista, ativo }: { lista: MaterialNutricao[]; ativo?: string }) {
  return (
    <Tabela colunas={[t.coluna, textos.status]}>
      {lista.map((m) => (
        <LinhaTabela
          key={m.id}
          ativa={m.id === ativo}
          para={`/app/admin/plano/materiais/${m.id}`}
          titulo={m.titulo}
        >
          <td className="px-3.5 py-3">
            <Situacao publicado={m.publicado} />
          </td>
        </LinhaTabela>
      ))}
    </Tabela>
  )
}

/** Plano alimentar > Materiais: textos de apoio para as alunas (chás, listas, molhos...). */
export function MateriaisPage() {
  const consulta = useQuery({ queryKey: ['materiais-nutricao'], queryFn: listarMateriaisNutricao })
  const { materialId } = useParams()
  const novo = useLocation().pathname.endsWith('/novo')
  const navegar = useNavigate()
  const lista = consulta.data ?? []
  const atual = lista.find((m) => m.id === materialId) ?? lista[0]
  const acao = (
    <Link to="/app/admin/plano/materiais/novo" className={classeBrilho('dourado')}>
      {t.novo}
    </Link>
  )
  let corpo: ReactNode
  if (consulta.isPending) corpo = <Estado tipo="carregando" />
  else if (consulta.isError) corpo = <Estado tipo="erro" tentar={() => consulta.refetch()} />
  else if (!atual) corpo = <Estado tipo="vazio" texto={t.vazio} acao={acao} />
  else
    corpo = (
      <Divisao
        tabela={<TabelaMateriais lista={lista} ativo={atual.id} />}
        detalhe={<MaterialDetalhe key={atual.id} material={atual} />}
      />
    )
  const publicados = lista.filter((m) => m.publicado).length
  return (
    <Quadro
      titulo={t.pagina}
      acao={acao}
      numeros={[{ valor: String(publicados), rotulo: t.publicados, tom: 'salvia' }]}
    >
      {corpo}
      {novo && <MaterialForm aoFechar={() => navegar('/app/admin/plano/materiais')} />}
    </Quadro>
  )
}
