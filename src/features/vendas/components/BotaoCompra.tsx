import type { Plano } from '@/domain/precos'
import { useAbrirCompra } from '../hooks/compraContexto'

type Variante = 'escuro' | 'claro'

type Props = { children: string; plano?: Plano; compacto?: boolean; variante?: Variante }

const cores: Record<Variante, string> = {
  escuro: 'bg-ora text-creme hover:bg-[#233d37]',
  claro: 'bg-creme text-ora hover:bg-white',
}

/** Todo botão de compra abre o mesmo popup. */
export function BotaoCompra({ children, plano, compacto, variante = 'escuro' }: Props) {
  const abrir = useAbrirCompra()
  const tamanho = compacto
    ? 'min-h-11 px-5 text-xs tracking-[0.16em]'
    : 'min-h-14 w-full px-6 text-sm tracking-[0.1em] sm:w-auto sm:px-10 sm:tracking-[0.16em]'
  return (
    <button
      type="button"
      onClick={() => abrir(plano)}
      className={`inline-flex items-center justify-center rounded-full font-semibold uppercase transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ora ${tamanho} ${cores[variante]}`}
    >
      {children}
    </button>
  )
}
