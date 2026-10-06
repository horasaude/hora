import type { Refeicao } from '@/domain/nutricao'
import { listarRefeicoes } from '../api/cardapios.api'
import { novoId, rascunhoDe, refeicaoDe, refeicaoDoModelo } from '../cardapioForm'
import { tCardapios as t, tRefeicoes } from '../textos2'
import { CarregarJanela } from './CarregarJanela'
import { RefeicaoJanela } from './RefeicaoJanela'

export type Editando =
  | { tipo: 'nova' }
  | { tipo: 'refeicao'; i: number }
  | { tipo: 'sub'; i: number; j: number | null }
  | { tipo: 'modelo' }
  | null

type Props = {
  ed: Editando
  setEd: (e: Editando) => void
  refeicoes: Refeicao[]
  textoLivre: boolean
  mudar: (fn: (r: Refeicao[]) => Refeicao[]) => void
  trocar: (i: number, fn: (r: Refeicao) => Refeicao) => void
}

function CarregarModelo({ aoFechar, mudar }: { aoFechar: () => void; mudar: Props['mudar'] }) {
  return (
    <CarregarJanela
      titulo={t.carregarModelo}
      tipo="modelo"
      aoFechar={aoFechar}
      aoEscolher={async (id) => {
        const m = (await listarRefeicoes('', '')).find((x) => x.id === id)
        if (m) mudar((l) => [...l, refeicaoDoModelo(m)])
      }}
    />
  )
}

/** Janelas da seção de refeições: refeição (nova ou editar), substituição e carregar modelo. */
export function JanelasRefeicao({ ed, setEd, refeicoes, textoLivre, mudar, trocar }: Props) {
  const fechar = () => setEd(null)
  if (ed?.tipo === 'modelo') return <CarregarModelo aoFechar={fechar} mudar={mudar} />
  if (ed?.tipo === 'nova' || ed?.tipo === 'refeicao') {
    const atual = ed.tipo === 'refeicao' ? refeicoes[ed.i] : undefined
    return (
      <RefeicaoJanela
        titulo={atual ? tRefeicoes.editar : t.adicionarRefeicao}
        inicial={rascunhoDe(atual)}
        textoLivre={textoLivre}
        aoFechar={fechar}
        aoSalvar={(r) => {
          if (ed.tipo === 'refeicao') return trocar(ed.i, (x) => refeicaoDe(r, x.id, x.substitutas))
          mudar((l) => [...l, refeicaoDe(r)])
          setEd({ tipo: 'refeicao', i: refeicoes.length })
        }}
      />
    )
  }
  if (ed?.tipo !== 'sub') return null
  const dona = refeicoes[ed.i]
  const sub = ed.j !== null ? dona?.substitutas[ed.j] : undefined
  return (
    <RefeicaoJanela
      titulo={t.substituta}
      inicial={rascunhoDe({
        nome: sub?.nome ?? dona?.nome ?? '',
        horario: '',
        itens: sub?.itens ?? [],
        texto: sub?.texto ?? '',
        observacao: '',
      })}
      textoLivre={textoLivre}
      semHorario
      aoFechar={fechar}
      aoSalvar={(r) => {
        const nova = { id: sub?.id ?? novoId(), nome: r.nome, itens: r.itens, texto: r.texto }
        trocar(ed.i, (x) => ({
          ...x,
          substitutas:
            ed.j === null
              ? [...x.substitutas, nova]
              : x.substitutas.map((s, k) => (k === ed.j ? nova : s)),
        }))
        if (ed.j === null) setEd({ ...ed, j: dona?.substitutas.length ?? 0 })
      }}
    />
  )
}
