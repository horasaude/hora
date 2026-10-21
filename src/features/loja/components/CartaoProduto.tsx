import { Link } from 'react-router-dom'
import { EtiquetaBrilho, type TomBrilho } from '@/components/ui'
import type { ProdutoVitrine } from '../api/loja.api'
import { textos as t } from '../textos'
import { Precos } from './Precos'

/** A etiqueta do cupom muda de cor de um cartão para o outro, como no protótipo. */
const TONS: TomBrilho[] = ['coral', 'dourado', 'verde', 'lilas']

/** Cartão da vitrine: foto quadrada, nome, descrição curta, etiqueta do cupom e preços. */
export function CartaoProduto({ p, indice = 0 }: { p: ProdutoVitrine; indice?: number }) {
  const temCupom = Boolean(p.cupom || p.loja_parceiros?.cupom)
  return (
    <Link
      to={`/app/loja/${p.id}`}
      aria-label={t.abrir(p.nome)}
      className="flex h-full flex-col overflow-hidden rounded-[18px] border border-linha bg-white transition hover:shadow-menu active:scale-[0.98]"
    >
      <span className="block aspect-square bg-white p-2">
        {p.foto && <img src={p.foto} alt="" loading="lazy" className="size-full object-contain" />}
      </span>
      <span className="flex flex-1 flex-col gap-1 p-2.5 text-[13px]">
        <span className="line-clamp-2 leading-tight font-bold text-tinta">{p.nome}</span>
        {p.descricao && <span className="line-clamp-1 text-suave">{p.descricao}</span>}
        {temCupom && (
          <span className="self-start">
            <EtiquetaBrilho tom={TONS[indice % TONS.length] ?? 'verde'}>
              {t.cupomOra}
            </EtiquetaBrilho>
          </span>
        )}
        <span className="mt-auto pt-1">
          <Precos cheio={p.preco_centavos} final={p.preco_final_centavos} />
        </span>
      </span>
    </Link>
  )
}
