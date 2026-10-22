import { useParams } from 'react-router-dom'
import { linkComCupom } from '@/domain/loja'
import { classeBrilho, Voltar } from '@/components/ui'
import { registrarClique } from '../api/loja.api'
import { Cupom } from '../components/Cupom'
import { EstadoLoja } from '../components/Estado'
import { Precos } from '../components/Precos'
import { useVitrine } from '../hooks/useLoja'
import { textos as t } from '../textos'

/** Produto aberto: foto contida, preços, cupom e Comprar com desconto logo abaixo (abre o parceiro e registra o clique); descrição por último. */
export function ProdutoPage() {
  const { produtoId } = useParams()
  const vitrine = useVitrine()
  const p = vitrine.data?.find((x) => x.id === produtoId)
  const cupom = p?.cupom ?? p?.loja_parceiros?.cupom
  return (
    <section className="flex flex-col gap-4">
      <Voltar para="/app/loja" rotulo={t.voltar}>
        {t.voltar}
      </Voltar>
      {vitrine.isPending ? (
        <EstadoLoja tipo="carregando" />
      ) : vitrine.isError ? (
        <EstadoLoja tipo="erro" tentar={() => vitrine.refetch()} />
      ) : !p ? (
        <EstadoLoja tipo="aviso" texto={t.naoEncontrado} />
      ) : (
        <article className="grid gap-5 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:items-start lg:gap-10">
          <div className="mx-auto aspect-square w-full max-w-[300px] overflow-hidden rounded-[22px] bg-white p-3 shadow-cartao sm:max-w-[360px] lg:max-w-none">
            {p.foto && <img src={p.foto} alt={p.nome} className="size-full object-contain" />}
          </div>
          <div className="flex flex-col gap-4">
            <header className="flex flex-col gap-1">
              <span className="text-sm text-suave">{p.loja_parceiros?.nome}</span>
              <h1 className="text-[22px] leading-tight font-bold text-verde-escuro lg:text-[28px]">
                {p.nome}
              </h1>
            </header>
            <Precos cheio={p.preco_centavos} final={p.preco_final_centavos} grande />
            {cupom && <Cupom codigo={cupom} />}
            <a
              href={linkComCupom(p.link_url, cupom)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => void registrarClique(p.id).catch(() => undefined)}
              className={`${classeBrilho('escuro', 'lg')} self-stretch sm:self-start`}
            >
              {t.comprar}
            </a>
            {p.descricao && (
              <p className="text-[15px] leading-relaxed whitespace-pre-line text-tinta">
                {p.descricao}
              </p>
            )}
          </div>
        </article>
      )}
    </section>
  )
}
