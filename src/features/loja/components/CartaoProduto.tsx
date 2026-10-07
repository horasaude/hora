import { Link } from 'react-router-dom'
import type { ProdutoVitrine } from '../api/loja.api'
import { textos as t } from '../textos'
import { Precos } from './Precos'

/** Cartão da vitrine: foto, nome e preços. */
export function CartaoProduto({ p }: { p: ProdutoVitrine }) {
  return (
    <Link
      to={`/app/loja/${p.id}`}
      aria-label={t.abrir(p.nome)}
      className="flex h-full flex-col overflow-hidden rounded-[22px] bg-white shadow-cartao transition hover:shadow-menu"
    >
      <span className="block aspect-square bg-trilho">
        {p.foto && <img src={p.foto} alt="" loading="lazy" className="size-full object-cover" />}
      </span>
      <span className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <span className="text-xs text-suave">{p.loja_parceiros?.nome}</span>
        <span className="line-clamp-2 text-[15px] leading-snug font-bold text-tinta">{p.nome}</span>
        <span className="mt-auto">
          <Precos cheio={p.preco_centavos} final={p.preco_final_centavos} />
        </span>
      </span>
    </Link>
  )
}
