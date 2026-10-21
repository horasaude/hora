import type { ReactNode } from 'react'
import { LogoOra } from '@/components/ui'
import { textos } from '../textos'

const traco = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  className: 'size-3.5 text-dourado',
}

const ICONES: Record<string, ReactNode> = {
  aulas: (
    <svg {...traco}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m10 8.5 5 3.5-5 3.5z" />
    </svg>
  ),
  cardapios: (
    <svg {...traco}>
      <path d="M4 12h16a8 8 0 0 1-16 0ZM8 9c0-2 2-3 4-3M14 8.5c.5-1.5 2-2.5 3.5-2.5" />
    </svg>
  ),
  treinos: (
    <svg {...traco}>
      <path d="M6.5 8v8M4 10v4M17.5 8v8M20 10v4M6.5 12h11" />
    </svg>
  ),
  lives: (
    <svg {...traco}>
      <circle cx="12" cy="12" r="2" />
      <path d="M8 8a5.5 5.5 0 0 0 0 8M16 8a5.5 5.5 0 0 1 0 8M5 5a9.5 9.5 0 0 0 0 14M19 5a9.5 9.5 0 0 1 0 14" />
    </svg>
  ),
}

/** Boas-vindas do /entrar: foto das três profissionais com degradê para o verde ORA, logo, título e o que tem dentro. */
export function BoasVindas() {
  const t = textos.boasVindas
  return (
    <section className="relative isolate flex min-h-[62svh] flex-col justify-end overflow-hidden bg-verde-escuro text-white lg:min-h-svh">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-[72%] bg-cover bg-[center_30%] lg:h-full"
        style={{ backgroundImage: 'url(/fotos/tres-sentadas.webp)' }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-[72%] bg-gradient-to-b from-verde-escuro/10 from-30% to-verde-escuro to-[98%] lg:h-full lg:from-40%"
      />
      <div className="flex flex-col gap-3.5 px-6 pt-8 pb-8 lg:max-w-xl lg:px-14 lg:pb-14">
        <LogoOra largura={98} clara />
        <h1 className="font-titulo text-[30px] leading-[1.12] font-semibold lg:text-[42px]">
          {t.titulo}
        </h1>
        <p className="text-[14.5px] opacity-85 lg:text-base">{t.subtitulo}</p>
        <ul className="flex flex-wrap gap-1.5">
          {t.chips.map((c) => (
            <li
              key={c.id}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/12 px-2.5 py-1.5 text-xs font-semibold"
            >
              {ICONES[c.id]}
              {c.nome}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
