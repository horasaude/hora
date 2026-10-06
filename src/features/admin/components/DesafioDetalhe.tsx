import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'
import { useState } from 'react'
import { BarraProgresso } from '@/components/ui'
import { progressoDesafio, type SituacaoDesafio } from '@/domain/painel'
import { diaEmBrasilia, diaMesDeData } from '@/lib/datas'
import { salvarDesafio, type Desafio, type NumerosDesafio } from '../api/modulos.api'
import { useSalvar } from '../hooks/usePainel'
import { esquemaDesafio } from '../schemas/modulos'
import { textos } from '../textos'
import { BotaoPublicar } from './BotaoPublicar'
import { CartaoDetalhe, Dados } from './CartaoDetalhe'
import { FormAgenda, type CampoDef } from './FormAgenda'
import { EtiquetaDesafio } from './SituacaoDesafio'
import { BotaoEncerrar, Vencedoras } from './Vencedoras'

const t = textos.desafios
type Entrada = z.input<typeof esquemaDesafio>
const opcoes = (o: Record<string, string>) =>
  Object.entries(o).map(([valor, nome]) => ({ valor, nome }))
const ehNumero = (v: Entrada) => v.tipo_checkin === 'numero'
const CAMPOS: CampoDef<Entrada>[] = [
  { nome: 'nome', rotulo: t.campoNome },
  { nome: 'descricao', rotulo: t.campoDescricao, tipo: 'area' },
  { nome: 'inicio', rotulo: t.campoInicio, tipo: 'data' },
  { nome: 'fim', rotulo: t.campoFim, tipo: 'data' },
  { nome: 'tipo_checkin', rotulo: t.campoTipo, tipo: 'escolha', opcoes: opcoes(t.tipos) },
  { nome: 'unidade', rotulo: t.campoUnidade, quando: ehNumero },
  { nome: 'meta_diaria', rotulo: t.campoMetaDiaria, tipo: 'numero', quando: ehNumero },
  { nome: 'meta_dias', rotulo: t.campoMetaDias, tipo: 'numero' },
  { nome: 'pontos_por_dia', rotulo: t.campoPontos, tipo: 'numero' },
  { nome: 'bonus_conclusao', rotulo: t.campoBonus, tipo: 'numero' },
  { nome: 'premio', rotulo: t.campoPremio },
  { nome: 'publico', rotulo: t.campoPublico, tipo: 'escolha', opcoes: opcoes(t.publicos) },
]

function inicial(d?: Desafio): Entrada {
  return {
    nome: d?.nome ?? '',
    descricao: d?.descricao ?? '',
    inicio: d?.inicio ?? '',
    fim: d?.fim ?? '',
    tipo_checkin: d?.tipo_checkin ?? 'sim_nao',
    unidade: d?.unidade ?? '',
    meta_diaria: d?.meta_diaria ? String(d.meta_diaria) : '',
    meta_dias: String(d?.meta_dias ?? ''),
    pontos_por_dia: String(d?.pontos_por_dia ?? 10),
    bonus_conclusao: String(d?.bonus_conclusao ?? 0),
    premio: d?.premio ?? '',
    publico: d?.publico ?? 'todas',
  }
}

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

type Props = { desafio?: Desafio; situacao?: SituacaoDesafio; numeros?: NumerosDesafio }

function Resumo({ desafio: d, situacao, numeros }: Required<Props>) {
  const diaria = d.meta_diaria && d.unidade ? `${d.meta_diaria} ${d.unidade}` : undefined
  return (
    <>
      <Dados
        itens={[
          [t.dadoPeriodo, t.periodo(diaMesDeData(d.inicio), diaMesDeData(d.fim))],
          [t.campoTipo, t.tipos[d.tipo_checkin]],
          [t.dadoMeta, t.meta(d.meta_dias, diaria)],
          [t.dadoPontos, t.pontos(d.pontos_por_dia, d.bonus_conclusao)],
          ...(d.premio ? [[t.dadoPremio, d.premio] as [string, string]] : []),
          [t.campoPublico, t.publicos[d.publico]],
          [t.dadoGente, String(numeros.participantes)],
          [t.dadoConcluiram, String(numeros.concluintes)],
          [textos.status, <EtiquetaDesafio key="s" situacao={situacao} />],
        ]}
      />
      <Andamento desafio={d} situacao={situacao} />
      <div className="flex gap-2">
        <BotaoPublicar tabela="desafios" id={d.id} publicado={d.publicado} />
        {situacao !== 'encerrado' && <BotaoEncerrar id={d.id} />}
      </div>
      {situacao === 'encerrado' && <Vencedoras id={d.id} />}
      <hr className="border-linha" />
    </>
  )
}

/** Cartão do desafio aberto (ou novo): dados, publicar, encerrar, vencedoras e o formulário. */
export function DesafioDetalhe({ desafio, situacao, numeros }: Props) {
  const salvar = useSalvar(salvarDesafio)
  const navegar = useNavigate()
  return (
    <CartaoDetalhe titulo={desafio ? desafio.nome : t.novo}>
      {desafio && situacao && (
        <Resumo
          desafio={desafio}
          situacao={situacao}
          numeros={numeros ?? { id: desafio.id, participantes: 0, concluintes: 0 }}
        />
      )}
      <FormAgenda<Entrada, z.output<typeof esquemaDesafio>>
        campos={CAMPOS}
        inicial={inicial(desafio)}
        resolver={zodResolver(esquemaDesafio)}
        aoCancelar={() => navegar('/app/admin/desafios')}
        aoSalvar={async (d) => {
          const salvo = await salvar.mutateAsync({ ...d, id: desafio?.id })
          navegar(`/app/admin/desafios/${salvo.id}`)
        }}
      />
    </CartaoDetalhe>
  )
}
