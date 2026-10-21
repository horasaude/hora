// Ícones do cardápio: traço fino, cantos redondos, cor herdada do texto (mesmo desenho de src/components/ui/Icones.tsx).
import type { ReactNode } from 'react'

function Svg({ className = 'size-4', children }: { className?: string; children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  )
}

type P = { className?: string }

export const IconeSol = (p: P) => (
  <Svg {...p}>
    <path d="M12 3v2M5.6 7.6 4.2 6.2M18.4 7.6l1.4-1.4M3 15h2M19 15h2M7 15a5 5 0 0 1 10 0M3 19h18" />
  </Svg>
)
export const IconePrato = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="4" />
  </Svg>
)
export const IconeMaca = (p: P) => (
  <Svg {...p}>
    <path d="M12 7c-1.5-1-5-1.5-6.5 1.5S5 16 7.5 19c1.5 1.8 3 1.5 4.5.8 1.5.7 3 1 4.5-.8 2.5-3 3.5-7.5 2-10.5S13.5 6 12 7Z" />
    <path d="M12 7c0-2 1-3.5 3-4" />
  </Svg>
)
export const IconeLua = (p: P) => (
  <Svg {...p}>
    <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
  </Svg>
)
export const IconeTroca = (p: P) => (
  <Svg {...p}>
    <path d="M4 9h13l-3-3M20 15H7l3 3" />
  </Svg>
)
export const IconeCarrinho = (p: P) => (
  <Svg {...p}>
    <path d="M3 4h2l2.2 10.5h10.6L20 7H6.2" />
    <circle cx="9" cy="19" r="1.4" />
    <circle cx="17" cy="19" r="1.4" />
  </Svg>
)
export const IconeBaixar = (p: P) => (
  <Svg {...p}>
    <path d="M14 3H6v18h12V7l-4-4Z" />
    <path d="M12 10v7M9 14l3 3 3-3" />
  </Svg>
)
export const IconeVoltar = (p: P) => (
  <Svg {...p}>
    <path d="m15 5-7 7 7 7" />
  </Svg>
)
