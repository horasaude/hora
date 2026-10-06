import type { HTMLAttributes } from 'react'

/** Cartão do sistema (estilo brilho): branco e liso, cantos bem arredondados, sombra bem leve. */
export function Cartao({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`rounded-[22px] bg-white p-5 shadow-cartao ${className}`} {...props} />
}
