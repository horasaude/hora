// Ícone e tag de cada tema (a frase vem do painel).
import { tomDoTema } from './corDoTema'

type Icone = { className?: string }
const traco = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

const ICONES: Record<string, (p: Icone) => React.JSX.Element> = {
  emagrecimento: (p) => (
    <svg viewBox="0 0 24 24" aria-hidden {...p}>
      <path {...traco} d="M5 19c9 0 14-5 14-14-9 0-14 5-14 14Zm0 0 8-8" />
    </svg>
  ),
  composicao: (p) => (
    <svg viewBox="0 0 24 24" aria-hidden {...p}>
      <path {...traco} d="M12 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm-6 9h12M12 9v12m-4 0 4-6 4 6" />
    </svg>
  ),
  lipedema: (p) => (
    <svg viewBox="0 0 24 24" aria-hidden {...p}>
      <path {...traco} d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" />
    </svg>
  ),
  menopausa: (p) => (
    <svg viewBox="0 0 24 24" aria-hidden {...p}>
      <path
        {...traco}
        d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 0c0 4-2 6-2 9m2-9c0 4 2 6 2 9M12 3V2m6 7h1M5 9h1"
      />
    </svg>
  ),
  ganho_massa: (p) => (
    <svg viewBox="0 0 24 24" aria-hidden {...p}>
      <path {...traco} d="M3 10v4m3-6v8m0-4h12m0-4v8m3-6v4" />
    </svg>
  ),
}

export function IconeTema({ chave, className = 'size-5' }: { chave: string | null } & Icone) {
  const Desenho = ICONES[chave ?? '']
  return Desenho ? <Desenho className={className} /> : null
}

/** Tag colorida do tema, com ícone. */
export function TagTema({ chave, titulo }: { chave: string | null; titulo: string }) {
  return (
    <span
      className={`brilho ${tomDoTema(chave)} inline-flex min-h-8 items-center gap-1.5 rounded-full px-3 text-[13px] font-bold`}
    >
      <IconeTema chave={chave} className="size-4" />
      {titulo}
    </span>
  )
}
