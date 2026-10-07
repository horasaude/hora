import type { TipoMaterial } from '@/domain/arquivos'

const traco = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

/** Ícone pelo tipo: PDF terracota, imagem sálvia, link verde. */
export function IconeArquivo({
  tipo,
  className = 'size-5',
}: {
  tipo: TipoMaterial
  className?: string
}) {
  if (tipo === 'pdf')
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={`${className} shrink-0 text-terracota`}>
        <path {...traco} d="M7 3h7l5 5v13H7zM14 3v5h5M9.5 13h5M9.5 16.5h5" />
      </svg>
    )
  if (tipo === 'imagem')
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={`${className} shrink-0 text-salvia`}>
        <path {...traco} d="M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4" />
        <circle cx="15.5" cy="9" r="1.4" fill="currentColor" />
      </svg>
    )
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={`${className} shrink-0 text-verde-escuro`}>
      <path
        {...traco}
        d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"
      />
    </svg>
  )
}
