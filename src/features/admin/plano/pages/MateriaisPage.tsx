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
import { caminhoMateriais, type AreaMaterial } from '../areaMaterial'
import { materiais as t } from '../textosMateriais'

function TabelaMateriais({ lista, base }: { lista: MaterialNutricao[]; base: string }) {
  return (
    <Tabela colunas={[t.coluna, textos.status]}>
      {lista.map((m) => (
        <LinhaTabela key={m.id} ativa={false} para={`${base}/${m.id}`} titulo={m.titulo}>
          <td className="px-3.5 py-3">
            <Situacao publicado={m.publicado} />
          </td>
        </LinhaTabela>
      ))}
    </Tabela>
  )
}

/** Materiais de apoio para as alunas (chás, listas, orientações): Plano alimentar > Materiais e Saúde > Materiais. */
export function MateriaisPage({ area = 'nutricao' }: { area?: AreaMaterial }) {
  const base = caminhoMateriais(area)
  const consulta = useQuery({
    queryKey: ['materiais-nutricao', area],
    queryFn: () => listarMateriaisNutricao(area),
  })
  const { materialId } = useParams()
  const novo = useLocation().pathname.endsWith('/novo')
  const navegar = useNavigate()
  const lista = consulta.data ?? []
  const atual = lista.find((m) => m.id === materialId) ?? lista[0]
  const aberto = Boolean(materialId) && atual?.id === materialId
  const titulo = area === 'saude' ? t.paginaSaude : t.pagina
  const acao = (
    <Link to={`${base}/novo`} className={classeBrilho('dourado')}>
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
        aberto={aberto}
        voltar={{ para: base, rotulo: titulo }}
        tabela={<TabelaMateriais lista={lista} base={base} />}
        detalhe={<MaterialDetalhe key={atual.id} material={atual} area={area} />}
      />
    )
  const publicados = lista.filter((m) => m.publicado).length
  return (
    <Quadro
      titulo={titulo}
      acao={acao}
      numeros={[{ valor: String(publicados), rotulo: t.publicados, tom: 'salvia' }]}
      aberto={aberto}
    >
      {corpo}
      {novo && <MaterialForm area={area} aoFechar={() => navegar(base)} />}
    </Quadro>
  )
}
