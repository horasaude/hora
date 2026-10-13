import { useState, type ReactNode } from 'react'
import { classeBrilho, EtiquetaBrilho } from '@/components/ui'
import { EQUIPAMENTOS, GRUPOS, type Equipamento, type Grupo } from '@/domain/treinos'
import { Estado } from '../../components/Estado'
import { Tabela } from '../../components/Tabela'
import { Confirmar } from '../../plano/components/Confirmar'
import { BarraFiltros, CampoBusca, Filtros } from '../../plano/components/Ferramentas'
import { MenuAcoes } from '../../plano/components/MenuAcoes'
import { removerExercicio, type Exercicio } from '../api/treinos.api'
import { ExercicioJanela } from '../components/ExercicioJanela'
import { QuadroTreinos } from '../components/QuadroTreinos'
import { useAcaoTreinos, useExercicios } from '../hooks/useTreinosPainel'
import { t } from '../textos'

type Janela = { tipo: 'novo' } | { tipo: 'editar' | 'remover'; e: Exercicio } | null
const opcoes = (o: Record<string, string>) =>
  Object.entries(o).map(([valor, nome]) => ({ valor, nome }))

function Linha({ e, abrir }: { e: Exercicio; abrir: (j: Janela) => void }) {
  return (
    <tr
      className="cursor-pointer border-b border-[#F4F5F4] last:border-b-0 hover:bg-[#F8FAF9]"
      onClick={() => abrir({ tipo: 'editar', e })}
    >
      <td className="px-3.5 py-3 font-bold text-tinta">{e.nome}</td>
      <td className="px-3.5 py-3">{GRUPOS[e.grupo as Grupo]}</td>
      <td className="px-3.5 py-3">{EQUIPAMENTOS[e.equipamento as Equipamento]}</td>
      <td className="px-3.5 py-3">
        <EtiquetaBrilho tom={e.video_url ? 'verde' : 'cinza'}>
          {e.video_url ? t.comVideo : t.semVideo}
        </EtiquetaBrilho>
      </td>
      <td className="w-12 px-2 py-2">
        <MenuAcoes
          nome={e.nome}
          acoes={[
            { nome: t.editar, aoEscolher: () => abrir({ tipo: 'editar', e }) },
            { nome: t.remover, perigo: true, aoEscolher: () => abrir({ tipo: 'remover', e }) },
          ]}
        />
      </td>
    </tr>
  )
}

function Janelas({ janela, fechar }: { janela: Janela; fechar: () => void }) {
  const remover = useAcaoTreinos(removerExercicio)
  if (janela?.tipo === 'novo') return <ExercicioJanela aoFechar={fechar} />
  if (janela?.tipo === 'editar') return <ExercicioJanela e={janela.e} aoFechar={fechar} />
  if (janela?.tipo === 'remover')
    return (
      <Confirmar
        nome={janela.e.nome}
        aoConfirmar={() => remover.mutateAsync(janela.e.id)}
        aoFechar={fechar}
      />
    )
  return null
}

/** Biblioteca de exercícios: busca, filtros por grupo muscular e equipamento, criar e editar na janela. */
export function ExerciciosPage() {
  const [busca, setBusca] = useState('')
  const [grupo, setGrupo] = useState('')
  const [equipamento, setEquipamento] = useState('')
  const [janela, setJanela] = useState<Janela>(null)
  const lista = useExercicios(busca, grupo, equipamento)
  const novo = (
    <button
      type="button"
      className={classeBrilho('verde')}
      onClick={() => setJanela({ tipo: 'novo' })}
    >
      {t.novoExercicio}
    </button>
  )
  let corpo: ReactNode
  if (lista.isPending) corpo = <Estado tipo="carregando" />
  else if (lista.isError) corpo = <Estado tipo="erro" tentar={() => lista.refetch()} />
  else if (lista.data.length === 0 && !busca && !grupo && !equipamento)
    corpo = <Estado tipo="vazio" texto={t.vazioExercicios} acao={novo} />
  else
    corpo = (
      <Tabela colunas={t.colunasExercicios}>
        {lista.data.map((e) => (
          <Linha key={e.id} e={e} abrir={setJanela} />
        ))}
        {lista.data.length === 0 && (
          <tr>
            <td colSpan={5} className="px-3.5 py-10 text-center text-[13px] text-suave">
              {t.semResultado}
            </td>
          </tr>
        )}
      </Tabela>
    )
  return (
    <QuadroTreinos acao={novo}>
      <BarraFiltros>
        <CampoBusca valor={busca} aoMudar={setBusca} rotulo={t.busca} />
      </BarraFiltros>
      <Filtros rotulo={t.filtroGrupo} valor={grupo} aoMudar={setGrupo} opcoes={opcoes(GRUPOS)} />
      <Filtros
        rotulo={t.filtroEquipamento}
        valor={equipamento}
        aoMudar={setEquipamento}
        opcoes={opcoes(EQUIPAMENTOS)}
      />
      {corpo}
      <Janelas janela={janela} fechar={() => setJanela(null)} />
    </QuadroTreinos>
  )
}
