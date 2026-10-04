import type { Plano } from '@/domain/precos'
import { useAbrirCompra } from '../hooks/compraContexto'

type Props = { children: string; plano?: Plano; compacto?: boolean; claro?: boolean }

/** Todo botão de compra abre o mesmo popup. */
export function BotaoCompra({ children, plano, compacto, claro }: Props) {
  const abrir = useAbrirCompra()
  const tamanho = compacto
    ? 'min-h-11 px-4 text-base'
    : 'min-h-14 w-full px-8 text-[1.1875rem] sm:w-auto'
  const cor = claro
    ? 'bg-ocre text-tinta hover:bg-[#d4a960]'
    : 'bg-terracota text-white hover:bg-[#b0603f]'
  return (
    <button
      type="button"
      onClick={() => abrir(plano)}
      className={`inline-flex items-center justify-center rounded-full font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ora ${tamanho} ${cor}`}
    >
      {children}
    </button>
  )
}
