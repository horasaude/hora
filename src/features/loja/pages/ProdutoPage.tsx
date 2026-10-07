import { Link, useParams } from 'react-router-dom'
import { classeBrilho } from '@/components/ui'
import { registrarClique } from '../api/loja.api'
import { Cupom } from '../components/Cupom'
import { EstadoLoja } from '../components/Estado'
import { Precos } from '../components/Precos'
import { useVitrine } from '../hooks/useLoja'
import { textos as t } from '../textos'

/** Produto aberto: foto grande, preços, descrição, cupom e Comprar com desconto (abre o parceiro e registra o clique). */
export function ProdutoPage() {
  const { produtoId } = useParams()
  const vitrine = useVitrine()
  const p = vitrine.data?.find((x) => x.id === produtoId)
  const cupom = p?.cupom ?? p?.loja_parceiros?.cupom
  return (
    <section className="flex flex-col gap-4">
      <Link
        to="/app/loja"
        className="inline-flex min-h-11 items-center self-start text-sm text-suave underline underline-offset-4"
      >
        {t.voltar}
      </Link>
      {vitrine.isPending ? (
        <EstadoLoja tipo="carregando" />
      ) : vitrine.isError ? (
        <EstadoLoja tipo="erro" tentar={() => vitrine.refetch()} />
      ) : !p ? (
        <EstadoLoja tipo="aviso" texto={t.naoEncontrado} />
      ) : (
        <article className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10">
          <div className="-mx-5 aspect-square overflow-hidden bg-trilho sm:mx-0 sm:rounded-[22px] sm:shadow-cartao">
            {p.foto && <img src={p.foto} alt={p.nome} className="size-full object-cover" />}
          </div>
          <div className="flex flex-col gap-5">
            <header className="flex flex-col gap-1">
              <span className="text-sm text-suave">{p.loja_parceiros?.nome}</span>
              <h1 className="text-[26px] leading-tight font-bold text-verde-escuro lg:text-[30px]">
                {p.nome}
              </h1>
            </header>
            <Precos cheio={p.preco_centavos} final={p.preco_final_centavos} grande />
            {p.descricao && (
              <p className="text-base leading-relaxed whitespace-pre-line text-tinta">
                {p.descricao}
              </p>
            )}
            {cupom && <Cupom codigo={cupom} />}
            <a
              href={p.link_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => void registrarClique(p.id).catch(() => undefined)}
              className={`${classeBrilho('escuro', 'lg')} self-stretch sm:self-start`}
            >
              {t.comprar}
            </a>
          </div>
        </article>
      )}
    </section>
  )
}
