// Ícones dos treinos: traço fino, cantos redondos, cor herdada do texto (mesmo desenho de src/components/ui/Icones.tsx).

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

export const IconeHalter = ({ className = 'size-4' }: P) => (
  <svg {...base} className={className}>
    <path d="M6 8v8M3.5 10v4M18 8v8M20.5 10v4M6 12h12" />
  </svg>
)

export const IconeNivel = ({ className = 'size-3.5' }: P) => (
  <svg {...base} className={className}>
    <path d="M5 19v-3M12 19v-7M19 19V8" />
  </svg>
)

export const IconeCasa = ({ className = 'size-3.5' }: P) => (
  <svg {...base} className={className}>
    <path d="M4 11 12 4l8 7M6 9.5V20h12V9.5" />
  </svg>
)

export const IconeRelogio = ({ className = 'size-3.5' }: P) => (
  <svg {...base} className={className}>
    <circle cx="12" cy="13" r="7" />
    <path d="M12 10v3l2 1.5M10 3h4" />
  </svg>
)
