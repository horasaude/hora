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

export function IconeVoltar({ className = 'size-5' }: Props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        d="m15 18-6-6 6-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Logo do Instagram nas cores da marca. */
export function IconeInstagram({ className = 'size-5' }: Props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <defs>
        <linearGradient id="ig-cores" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#FEDA75" />
          <stop offset="0.3" stopColor="#FA7E1E" />
          <stop offset="0.55" stopColor="#D62976" />
          <stop offset="0.8" stopColor="#962FBF" />
          <stop offset="1" stopColor="#4F5BD5" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#ig-cores)" />
      <rect
        x="6"
        y="6"
        width="12"
        height="12"
        rx="3.6"
        fill="none"
        stroke="#fff"
        strokeWidth="1.7"
      />
      <circle cx="12" cy="12" r="2.9" fill="none" stroke="#fff" strokeWidth="1.7" />
      <circle cx="16" cy="8" r="1" fill="#fff" />
    </svg>
  )
}
