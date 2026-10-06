// Ícones de linha fina dos blocos de refeição (duplicar, editar, remover).

const traco = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

export function IconeDuplicar() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className="size-4" {...traco}>
      <rect x="5" y="5" width="8.5" height="8.5" rx="2" />
      <path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5" />
    </svg>
  )
}

export function IconeEditar() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className="size-4" {...traco}>
      <path d="M10.5 2.5 13.5 5.5 6 13H3v-3z" />
    </svg>
  )
}

export function IconeRemover() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className="size-4" {...traco}>
      <path d="M2.5 4.5h11M6 4.5V3h4v1.5M4 4.5l.7 8.5h6.6l.7-8.5" />
    </svg>
  )
}
