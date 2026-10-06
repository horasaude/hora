import { useState, type ReactNode } from 'react'
import { classeBrilho } from '@/components/ui'
import { Estado } from '../../components/Estado'
import { Quadro } from '../../components/Quadro'
import { Tabela } from '../../components/Tabela'
import { EmUso, removerAlimento, type Origem } from '../api/alimentos.api'
import { AlimentoJanela } from '../components/AlimentoJanela'
import { Confirmar } from '../components/Confirmar'
import { BarraFiltros, CampoBusca, Paginacao } from '../components/Ferramentas'
import { Abas, Linha, type Janela } from '../components/AlimentoLinha'
import { useAcaoPlano, useAlimentos, useContagemAlimentos } from '../hooks/usePlano'
import { tAlimentos as t, textos } from '../textos'

function Janelas({ janela, fechar }: { janela: Janela; fechar: () => void }) {
  const remover = useAcaoPlano(removerAlimento)
  if (janela?.tipo === 'novo') return <AlimentoJanela aoFechar={fechar} />
  if (janela?.tipo === 'editar')
    return <AlimentoJanela alimento={janela.alimento} aoFechar={fechar} />
  if (janela?.tipo === 'remover') {
    return (
      <Confirmar
        nome={janela.alimento.nome}
        aoConfirmar={() => remover.mutateAsync(janela.alimento.id)}
        aoFechar={fechar}
        erroDe={(e) => (e instanceof EmUso ? textos.emUso : textos.erro)}
      />
    )
  }
  return null
}

type Filtro = { origem: Origem; busca: string; pagina: number; tamanho: number }

function Lista({
  f,
  mudar,
  abrir,
  novo,
}: {
  f: Filtro
  mudar: (p: Partial<Filtro>) => void
  abrir: (j: Janela) => void
  novo: ReactNode
}) {
  const lista = useAlimentos(f.origem, f.busca, f.pagina, f.tamanho)
  if (lista.isPending) return <Estado tipo="carregando" />
  if (lista.isError) return <Estado tipo="erro" tentar={() => lista.refetch()} />
  if (lista.data.total === 0 && !f.busca && f.origem === 'proprio')
    return <Estado tipo="vazio" texto={t.vazio} acao={novo} />
  return (
    <>
      <Tabela colunas={t.colunas}>
        {lista.data.lista.map((a) => (
          <Linha key={a.id} a={a} abrir={abrir} />
        ))}
        {lista.data.total === 0 && (
          <tr>
            <td colSpan={4} className="px-3.5 py-10 text-center text-[13px] text-suave">
              {textos.semResultado}
            </td>
          </tr>
        )}
      </Tabela>
      <Paginacao
        pagina={f.pagina}
        tamanho={f.tamanho}
        total={lista.data.total}
        aoMudar={(pagina, tamanho) => mudar({ pagina, tamanho })}
      />
    </>
  )
}

/** Alimentos: abas Meus alimentos e TACO, busca sem acento, paginação e janela de cadastro. */
export function AlimentosPage() {
  const [f, setF] = useState<Filtro>({ origem: 'proprio', busca: '', pagina: 1, tamanho: 10 })
  const [janela, setJanela] = useState<Janela>(null)
  const c = useContagemAlimentos().data
  const mudar = (p: Partial<Filtro>) => setF((x) => ({ ...x, pagina: 1, ...p }))
  const novo = (
    <button
      type="button"
      className={classeBrilho('dourado')}
      onClick={() => setJanela({ tipo: 'novo' })}
    >
      {t.adicionar}
    </button>
  )
  return (
    <Quadro
      titulo={t.titulo}
      acao={novo}
      numeros={[
        { valor: String(c?.meus ?? '-'), rotulo: t.meus, tom: 'salvia' },
        { valor: String(c?.taco ?? '-'), rotulo: t.naTaco, tom: 'ocre' },
        { valor: String(c?.comMedida ?? '-'), rotulo: t.comMedida, tom: 'terracota' },
      ]}
    >
      <BarraFiltros>
        <Abas origem={f.origem} aoMudar={(origem) => mudar({ origem })} />
        <CampoBusca valor={f.busca} aoMudar={(busca) => mudar({ busca })} />
      </BarraFiltros>
      {f.origem === 'taco' && <p className="text-xs text-suave">{t.fonte}</p>}
      <Lista f={f} mudar={mudar} abrir={setJanela} novo={novo} />
      <Janelas janela={janela} fechar={() => setJanela(null)} />
    </Quadro>
  )
}
