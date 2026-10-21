// Ícones do menu do perfil: traço fino, cantos redondos, cor herdada do texto.

type Props = { className?: string }

const traco = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

function Icone({ d, className = 'size-[18px]' }: Props & { d: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path d={d} {...traco} />
    </svg>
  )
}

export const IconePrancheta = (p: Props) => (
  <Icone {...p} d="M9 4.5h6v2.5H9zM9 5.5H6.5v15h11v-15H15M9.5 11.5h5M9.5 15h5" />
)
export const IconePresente = (p: Props) => (
  <Icone
    {...p}
    d="M4.5 9.5h15v3.5h-15zM6 13v7h12v-7M12 9.5V20M12 9.5S10.5 5 8.5 5.5 9 9.5 12 9.5Zm0 0s1.5-4.5 3.5-4S15 9.5 12 9.5Z"
  />
)
export const IconeRegua = (p: Props) => (
  <Icone {...p} d="M3.5 15.5 15.5 3.5l5 5-12 12zM7.5 11.5l2 2M10.5 8.5l2 2M13.5 5.5l2 2" />
)
export const IconeCelular = (p: Props) => <Icone {...p} d="M7.5 3h9v18h-9zM11 18h2" />
export const IconeEngrenagem = (p: Props) => (
  <Icone
    {...p}
    d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19 12l1.8-1.2-1.5-3-2.1.4-1.3-1.3.4-2.1-3-1.5L12 5 10.7 3.3l-3 1.5.4 2.1-1.3 1.3-2.1-.4-1.5 3L5 12l-1.8 1.2 1.5 3 2.1-.4 1.3 1.3-.4 2.1 3 1.5L12 19l1.3 1.7 3-1.5-.4-2.1 1.3-1.3 2.1.4 1.5-3Z"
  />
)
export const IconeSeta = (p: Props) => <Icone {...p} d="m9.5 6 6 6-6 6" />
export const IconeVoltar = (p: Props) => <Icone {...p} d="m14.5 6-6 6 6 6" />
export const IconeLink = (p: Props) => (
  <Icone
    {...p}
    d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"
  />
)
