import type { ButtonHTMLAttributes } from 'react'

type Variante = 'primario' | 'secundario'

const estilos: Record<Variante, string> = {
  primario: 'bg-ora text-white hover:opacity-90',
  secundario: 'bg-white text-ora border border-ora hover:bg-areia',
}

export function Botao({
  variante = 'primario',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variante?: Variante }) {
  return (
    <button
      className={`min-h-11 rounded-lg px-5 font-semibold transition disabled:opacity-50 ${estilos[variante]} ${className}`}
      {...props}
    />
  )
}
