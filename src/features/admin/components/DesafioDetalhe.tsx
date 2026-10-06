import { useState } from 'react'
import { BarraProgresso, BotaoBrilho } from '@/components/ui'
import { progressoDesafio, type SituacaoDesafio } from '@/domain/painel'
import { diaEmBrasilia, diaMesDeData } from '@/lib/datas'
import type { Desafio, NumerosDesafio } from '../api/modulos.api'
import { textos } from '../textos'
import { BotaoPublicar } from './BotaoPublicar'
import { CartaoDetalhe, Dados } from './CartaoDetalhe'
import { DesafioForm } from './DesafioForm'
import { Participantes } from './Participantes'
import { EtiquetaDesafio } from './SituacaoDesafio'
import { BotaoEncerrar, Vencedoras } from './Vencedoras'

const t = textos.desafios

/** Barra dourada do período: em que dia está e quantos faltam. */
function Andamento({ desafio: d, situacao }: { desafio: Desafio; situacao: SituacaoDesafio }) {
  const [hoje] = useState(() => diaEmBrasilia(new Date()))
  if (situacao === 'rascunho') return null
  if (situacao === 'agendado')
    return <p className="text-sm text-suave">{t.comeca(diaMesDeData(d.inicio))}</p>
  const p = progressoDesafio(d, hoje)
  return (
    <BarraProgresso
      pct={p.pct}
      rotulo={t.progresso}
      legenda={t.andamento(p.dia, p.total, p.faltam)}
    />
  )
}

type Props = { desafio: Desafio; situacao: SituacaoDesafio; numeros: NumerosDesafio }

function Resumo({ desafio: d, situacao, numeros, aoEditar }: Props & { aoEditar: () => void }) {
  const diaria = d.meta_diaria && d.unidade ? `${d.meta_diaria} ${d.unidade}` : undefined
  return (
    <>
      <Dados
        itens={[
          [t.dadoPeriodo, t.periodo(diaMesDeData(d.inicio), diaMesDeData(d.fim))],
          [t.campoTipo, t.tipos[d.tipo_checkin]],
          [t.dadoMeta, t.meta(d.meta_dias, diaria)],
          [t.dadoPontos, t.pontos(d.pontos_por_dia, d.bonus_conclusao)],
          ...(d.premio || d.premio_surpresa
            ? [
                [
                  t.dadoPremio,
                  [d.premio, d.premio_surpresa ? t.surpresa : ''].filter(Boolean).join(' · '),
                ] as [string, string],
              ]
            : []),
          [t.campoPublico, t.publicos[d.publico]],
          [t.dadoGente, String(numeros.participantes)],
          [t.dadoConcluiram, String(numeros.concluintes)],
          [textos.status, <EtiquetaDesafio key="s" situacao={situacao} />],
        ]}
      />
      <Andamento desafio={d} situacao={situacao} />
      <div className="flex flex-wrap gap-2">
        <BotaoBrilho onClick={aoEditar}>{textos.editar}</BotaoBrilho>
        <BotaoPublicar tabela="desafios" id={d.id} publicado={d.publicado} />
        {situacao !== 'encerrado' && <BotaoEncerrar id={d.id} />}
      </div>
      {situacao === 'encerrado' && <Vencedoras id={d.id} />}
      {situacao !== 'rascunho' && <Participantes desafio={d.id} />}
    </>
  )
}

/** Detalhes do desafio: dados, andamento, publicar, encerrar e vencedoras; editar abre a janela. */
export function DesafioDetalhe({ desafio, situacao, numeros }: Props) {
  const [editando, setEditando] = useState(false)
  return (
    <CartaoDetalhe titulo={desafio.nome}>
      <Resumo
        desafio={desafio}
        situacao={situacao}
        numeros={numeros}
        aoEditar={() => setEditando(true)}
      />
      {editando && <DesafioForm desafio={desafio} aoFechar={() => setEditando(false)} />}
    </CartaoDetalhe>
  )
}
