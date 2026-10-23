import { useParams } from 'react-router-dom'
import { Carregando, Cartao, ErroCarregar, EtiquetaBrilho, Vazio } from '@/components/ui'
import { macros, totalCardapio } from '@/domain/nutricao'
import { AcoesCardapio } from '../components/AcoesCardapio'
import { RefeicaoCartao } from '../components/RefeicaoCartao'
import { TopoVoltar } from '../components/TopoVoltar'
import { useCardapios } from '../hooks/useCardapios'
import { textos } from '../textos'

function TotalDia({ refeicoes }: { refeicoes: Parameters<typeof totalCardapio>[0] }) {
  const total = totalCardapio(refeicoes)
  if (total.kcal <= 0) return null
  const m = macros(total)
  return (
    <Cartao className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
      <span className="font-bold text-tinta">{textos.totalDia}</span>
      <span className="text-suave">
        {textos.totais(total.kcal, m.proteina.gramas, m.carboidrato.gramas, m.gordura.gramas)}
      </span>
    </Cartao>
  )
}

/** Cardápio aberto: topo com voltar, refeições em cartões (ordem de horário), total do dia, Lista de compras e PDF. */
export function CardapioPage() {
  const { cardapioId = '' } = useParams()
  const cardapios = useCardapios()
  const c = cardapios.data?.find((x) => x.id === cardapioId)
  if (!c)
    return (
      <section className="flex flex-col gap-4">
        <TopoVoltar titulo={textos.titulo} para="/app/trilha" rotulo={textos.voltar} />
        {cardapios.isPending ? (
          <Carregando texto={textos.carregando} />
        ) : cardapios.isError ? (
          <ErroCarregar
            texto={textos.erro}
            tentar={textos.tentar}
            aoTentar={() => cardapios.refetch()}
          />
        ) : (
          <Vazio>{textos.naoEncontrado}</Vazio>
        )}
      </section>
    )
  return (
    <section className="flex flex-col gap-4 lg:gap-5">
      <TopoVoltar
        titulo={c.titulo}
        para={c.tema_id ? `/app/trilha/tema/${c.tema_id}?aba=cardapio` : '/app/trilha'}
        rotulo={textos.voltar}
      />
      {(c.objetivo || c.descricao) && (
        <div className="flex flex-wrap items-center gap-2 text-[14px] text-suave">
          {c.objetivo && <EtiquetaBrilho tom="verde">{c.objetivo}</EtiquetaBrilho>}
          {c.descricao && <p className="max-w-2xl">{c.descricao}</p>}
        </div>
      )}
      {c.refeicoes.length === 0 ? (
        !c.pdf_path && <Vazio>{textos.semRefeicoes}</Vazio>
      ) : (
        <ul className="grid gap-3 lg:grid-cols-2 lg:gap-4">
          {c.refeicoes.map((r, i) => (
            <li key={r.id}>
              <RefeicaoCartao r={r} texto={c.texto} ordem={i} />
            </li>
          ))}
        </ul>
      )}
      {!c.texto && <TotalDia refeicoes={c.refeicoes} />}
      <AcoesCardapio c={c} />
    </section>
  )
}
