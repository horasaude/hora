// Ícones do Início: traço fino, cantos redondos, cor herdada do texto.

type P = { className?: string }
const traco = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

export const IconeSino = ({ className = 'size-5' }: P) => (
  <svg {...traco} className={className}>
    <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15L6 16ZM10 20.5a2.2 2.2 0 0 0 4 0" />
  </svg>
)

export const IconeEstrela = ({ className = 'size-5' }: P) => (
  <svg {...traco} className={className}>
    <path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.5Z" />
  </svg>
)

export const IconeSeta = ({ className = 'size-5' }: P) => (
  <svg {...traco} className={className}>
    <path d="m9.5 6 6 6-6 6" />
  </svg>
)
