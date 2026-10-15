const CORES = { 1: '#F2A922', 2: '#A9B4BD', 3: '#C98A5A' } as const

/** Coroinha de quem está no pódio: ouro (1º), prata (2º) e bronze (3º). */
export function Coroa({ lugar, className = '' }: { lugar: 1 | 2 | 3; className?: string }) {
  return (
    <svg viewBox="0 0 24 18" aria-hidden className={className}>
      <path
        d="M2 6l5 4 5-8 5 8 5-4-2 10H4L2 6Z"
        fill={CORES[lugar]}
        stroke="#ffffff"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="2" cy="5.5" r="1.6" fill={CORES[lugar]} />
      <circle cx="12" cy="1.8" r="1.6" fill={CORES[lugar]} />
      <circle cx="22" cy="5.5" r="1.6" fill={CORES[lugar]} />
    </svg>
  )
}
