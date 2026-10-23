// Ícones pequenos da trilha (voltar, abas do tema, relógio): traço fino, cor herdada do texto.

type Props = { className?: string }
const traco = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

export function IconeVoltar({ className = 'size-5' }: Props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path {...traco} d="m15 18-6-6 6-6" />
    </svg>
  )
}

export function IconeRelogio({ className = 'size-3' }: Props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <circle {...traco} cx="12" cy="12" r="9" />
      <path {...traco} d="M12 7v5l3 2" />
    </svg>
  )
}

const ABAS = {
  aulas: (
    <>
      <circle {...traco} cx="12" cy="12" r="9" />
      <path {...traco} d="m10 8.5 5 3.5-5 3.5Z" />
    </>
  ),
  cardapio: (
    <>
      <path {...traco} d="M3.5 12h17a8.5 8.5 0 0 1-17 0Z" />
      <path {...traco} d="M8 12c0-3 1.5-5 4-6m0 6c.5-2.5 2.5-4 5-4" />
    </>
  ),
  receitas: (
    <>
      <path {...traco} d="M5 21h14M6 21V11h12v10" />
      <path {...traco} d="M8 11a4 4 0 1 1 3-6.6A3.5 3.5 0 1 1 16 11" />
    </>
  ),
  treinos: <path {...traco} d="M6.5 7v10M4 9.5v5M17.5 7v10M20 9.5v5M6.5 12h11" />,
  desafio: (
    <>
      <path {...traco} d="M8 4h8v5a4 4 0 0 1-8 0V4Z" />
      <path {...traco} d="M8 6H5a3 3 0 0 0 3 3m8-3h3a3 3 0 0 1-3 3M12 13v4m-4 3h8" />
    </>
  ),
  materiais: (
    <>
      <path {...traco} d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
      <path {...traco} d="M14 3v5h5M9 13h6M9 17h6" />
    </>
  ),
}

/** Ícone de cada aba do tema (Aulas, Cardápio, Receitas, Treinos, Desafio, Materiais). */
export function IconeAba({ aba, className = 'size-4' }: Props & { aba: keyof typeof ABAS }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      {ABAS[aba]}
    </svg>
  )
}
