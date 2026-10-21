// Ícones do fórum: traço fino, cantos redondos, cor herdada do texto.

type Props = { className?: string }

const traco = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

export function IconeCoracao({ className = 'size-3.5' }: Props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        d="M12 20s-7.5-4.4-7.5-10A4.2 4.2 0 0 1 12 7.6 4.2 4.2 0 0 1 19.5 10c0 5.6-7.5 10-7.5 10Z"
        {...traco}
      />
    </svg>
  )
}

export function IconeConversa({ className = 'size-3.5' }: Props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path d="M4.5 18.5 6 15a7.5 7.5 0 1 1 3 3l-4.5.5Z" {...traco} />
    </svg>
  )
}

export function IconePergunta({ className = 'size-4' }: Props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path d="M4.5 18.5 6 15a7.5 7.5 0 1 1 3 3l-4.5.5ZM12 9v6M9 12h6" {...traco} />
    </svg>
  )
}
