import type { HTMLAttributes } from 'react'

/** Cartão da área da aluna: fundo areia, cantos bem arredondados, borda fina, sem sombra. */
export function Cartao({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`rounded-[1.25rem] border border-linha bg-areia p-4 ${className}`} {...props} />
  )
}
