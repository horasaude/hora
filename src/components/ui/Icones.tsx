// Ícones desenhados para a ORA: traço fino, cantos redondos, cor herdada do texto.

type Props = { className?: string }

export function IconePlay({ className = 'size-4' }: Props) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className={className}>
      <path
        d="M5 3.2v9.6a.6.6 0 0 0 .9.5l7.4-4.8a.6.6 0 0 0 0-1L5.9 2.7a.6.6 0 0 0-.9.5Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function IconeCheck({ className = 'size-4' }: Props) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className={className}>
      <path
        d="m3.5 8.5 3 3 6-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IconeCadeado({ className = 'size-4' }: Props) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className={className}>
      <path
        d="M4.5 7.5V5.5a3.5 3.5 0 0 1 7 0v2M3.5 7.5h9v6h-9z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
