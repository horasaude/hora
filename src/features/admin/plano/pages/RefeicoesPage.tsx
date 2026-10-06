import { useState, type ReactNode } from 'react'
import { classeBrilho, EtiquetaBrilho } from '@/components/ui'
import { totalItens } from '@/domain/nutricao'
import { Estado } from '../../components/Estado'
import { Quadro } from '../../components/Quadro'
import { Tabela } from '../../components/Tabela'
import { removerRefeicao, salvarRefeicao, type RefeicaoModelo } from '../api/cardapios.api'
import { Confirmar } from '../components/Confirmar'
import { BarraFiltros, CampoBusca, Filtros } from '../components/Ferramentas'
import { MenuAcoes } from '../components/MenuAcoes'
import { RefeicaoModeloJanela } from '../components/RefeicaoModeloJanela'
import { useAcaoPlano, useRefeicoes } from '../hooks/usePlano'
import { lerItens } from '../schemas/plano'
import { textos, TIPOS_REFEICAO } from '../textos'
import { tRefeicoes as t } from '../textos2'

type Janela = { tipo: 'nova' } | { tipo: 'editar' | 'remover'; r: RefeicaoModelo } | null

function Linha({ r, abrir }: { r: RefeicaoModelo; abrir: (j: Janela) => void }) {
  const duplicar = useAcaoPlano(salvarRefeicao)
  const { id: _id, created_at: _c, updated_at: _u, busca: _b, ...copia } = r
  return (
    <tr
      className="cursor-pointer border-b border-[#F4F5F4] last:border-b-0 hover:bg-[#F8FAF9]"
      onClick={() => abrir({ tipo: 'editar', r })}
    >
      <td className="px-3.5 py-3 font-bold text-tinta">
        {r.nome}
        {r.horario && <span className="ml-2 font-normal text-suave">{r.horario.slice(0, 5)}</span>}
      </td>
      <td className="px-3.5 py-3">
        <EtiquetaBrilho tom="cinza">{TIPOS_REFEICAO[r.tipo]}</EtiquetaBrilho>
      </td>
      <td className="px-3.5 py-3">
        <EtiquetaBrilho tom="dourado">
          {textos.kcal(totalItens(lerItens(r.itens)).kcal)}
        </EtiquetaBrilho>
      </td>
      <td className="w-12 px-2 py-2">
        <MenuAcoes
          nome={r.nome}
          acoes={[
            { nome: textos.editar, aoEscolher: () => abrir({ tipo: 'editar', r }) },
            {
              nome: textos.duplicar,
              aoEscolher: () => duplicar.mutate({ ...copia, nome: `${r.nome} (cópia)` }),
            },
            { nome: textos.remover, perigo: true, aoEscolher: () => abrir({ tipo: 'remover', r }) },
          ]}
        />
      </td>
    </tr>
  )
}

function Janelas({ janela, fechar }: { janela: Janela; fechar: () => void }) {
  const remover = useAcaoPlano(removerRefeicao)
  if (janela?.tipo === 'nova') return <RefeicaoModeloJanela aoFechar={fechar} />
  if (janela?.tipo === 'editar')
    return <RefeicaoModeloJanela refeicao={janela.r} aoFechar={fechar} />
  if (janela?.tipo === 'remover')
    return (
      <Confirmar
        nome={janela.r.nome}
        aoConfirmar={() => remover.mutateAsync(janela.r.id)}
        aoFechar={fechar}
      />
    )
  return null
}

/** Refeições modelo: busca, filtro por tipo, etiquetas de tipo e kcal; criar e editar na janela. */
export function RefeicoesPage() {
  const [busca, setBusca] = useState('')
  const [tipo, setTipo] = useState('')
  const [janela, setJanela] = useState<Janela>(null)
  const lista = useRefeicoes(busca, tipo)
  const nova = (
    <button
      type="button"
      className={classeBrilho('dourado')}
      onClick={() => setJanela({ tipo: 'nova' })}
    >
      {t.nova}
    </button>
  )
  let corpo: ReactNode
  if (lista.isPending) corpo = <Estado tipo="carregando" />
  else if (lista.isError) corpo = <Estado tipo="erro" tentar={() => lista.refetch()} />
  else if (lista.data.length === 0 && !busca && !tipo)
    corpo = <Estado tipo="vazio" texto={t.vazio} acao={nova} />
  else {
    corpo = (
      <Tabela colunas={t.colunas}>
        {lista.data.map((r) => (
          <Linha key={r.id} r={r} abrir={setJanela} />
        ))}
        {lista.data.length === 0 && (
          <tr>
            <td colSpan={4} className="px-3.5 py-10 text-center text-[13px] text-suave">
              {textos.semResultado}
            </td>
          </tr>
        )}
      </Tabela>
    )
  }
  return (
    <Quadro
      titulo={t.titulo}
      acao={nova}
      numeros={[{ valor: String(lista.data?.length ?? '-'), rotulo: t.total, tom: 'salvia' }]}
    >
      <BarraFiltros>
        <Filtros
          rotulo={t.filtroTipo}
          valor={tipo}
          aoMudar={setTipo}
          opcoes={Object.entries(TIPOS_REFEICAO).map(([valor, nome]) => ({ valor, nome }))}
        />
        <CampoBusca valor={busca} aoMudar={setBusca} />
      </BarraFiltros>
      {corpo}
      <Janelas janela={janela} fechar={() => setJanela(null)} />
    </Quadro>
  )
}
