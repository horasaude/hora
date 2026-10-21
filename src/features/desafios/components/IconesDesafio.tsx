// Ícones do desafio: traço fino, cantos redondos, cor herdada do texto (mesmo desenho de src/components/ui/Icones.tsx).

type P = { className?: string }

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

export const IconePresente = ({ className = 'size-4' }: P) => (
  <svg {...base} className={className}>
    <path d="M4 11h16v9H4zM3 7h18v4H3zM12 7v13" />
    <path d="M12 7c-1.5-3-5-3.5-5-1.2C7 7 9 7 12 7Zm0 0c1.5-3 5-3.5 5-1.2C17 7 15 7 12 7Z" />
  </svg>
)

export const IconeVoltar = ({ className = 'size-5' }: P) => (
  <svg {...base} className={className}>
    <path d="m15 5-7 7 7 7" />
  </svg>
)
