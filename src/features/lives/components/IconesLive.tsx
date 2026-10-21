// Ícones da live: traço fino, cantos redondos, cor herdada do texto.

type Props = { className?: string }

const traco = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

export function IconeSino({ className = 'size-4' }: Props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        d="M6 9a6 6 0 0 1 12 0c0 6 2.5 7.5 2.5 7.5h-17S6 15 6 9ZM10 20a2.2 2.2 0 0 0 4 0"
        {...traco}
      />
    </svg>
  )
}

export function IconeAgenda({ className = 'size-4' }: Props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path d="M4 6.5h16V20H4zM4 10.5h16M8 4v4M16 4v4" {...traco} />
    </svg>
  )
}

export function IconeVideo({ className = 'size-4' }: Props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path d="M3.5 7h11v10h-11zM14.5 10.5 20.5 7v10l-6-3.5" {...traco} />
    </svg>
  )
}

export function IconeRadio({ className = 'size-3.5' }: Props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <path
        d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4M5 5a10 10 0 0 0 0 14M19 5a10 10 0 0 1 0 14"
        {...traco}
      />
    </svg>
  )
}
