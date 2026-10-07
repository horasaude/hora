import { useParams } from 'react-router-dom'
import {
  Carregando,
  Cartao,
  ErroCarregar,
  EtiquetaBrilho,
  LinkBrilho,
  Vazio,
} from '@/components/ui'
import { macros, totalCardapio } from '@/domain/nutricao'
import { RefeicaoCartao } from '../components/RefeicaoCartao'
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

/** Cardápio aberto: refeições em ordem de horário, total do dia e a lista de compras. */
export function CardapioPage() {
  const { cardapioId = '' } = useParams()
  const cardapios = useCardapios()
  const voltar = (
    <LinkBrilho to="/app/cardapios" tom="cinza" tamanho="sm" className="self-start">
      {textos.voltar}
    </LinkBrilho>
  )
  if (cardapios.isPending) return <Carregando texto={textos.carregando} />
  if (cardapios.isError)
    return (
      <ErroCarregar
        texto={textos.erro}
        tentar={textos.tentar}
        aoTentar={() => cardapios.refetch()}
      />
    )
  const c = cardapios.data.find((x) => x.id === cardapioId)
  if (!c)
    return (
      <section className="flex flex-col gap-4">
        {voltar}
        <Vazio>{textos.naoEncontrado}</Vazio>
      </section>
    )
  return (
    <section className="flex flex-col gap-5 lg:gap-6">
      {voltar}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <span className="self-start">
            <EtiquetaBrilho tom="verde">{c.objetivo}</EtiquetaBrilho>
          </span>
          <h1 className="text-[28px] leading-tight font-bold text-verde-escuro lg:text-[30px]">
            {c.titulo}
          </h1>
          {c.descricao && <p className="max-w-2xl text-[15px] text-suave">{c.descricao}</p>}
        </div>
        {!c.texto && (
          <LinkBrilho to={`/app/cardapios/${c.id}/compras`} tom="escuro">
            {textos.compras.botao}
          </LinkBrilho>
        )}
      </header>
      <ul className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {c.refeicoes.map((r) => (
          <li key={r.id}>
            <RefeicaoCartao r={r} texto={c.texto} />
          </li>
        ))}
      </ul>
      {!c.texto && <TotalDia refeicoes={c.refeicoes} />}
    </section>
  )
}
