// Classes do estilo brilho delicado (docs/referencias/estilo-aluna.html e estilo-painel.html). Base de Brilho.tsx.

export type TomBrilho = 'verde' | 'coral' | 'dourado' | 'escuro' | 'cinza'
export type TamanhoBrilho = 'sm' | 'md' | 'lg'

const TOM: Record<TomBrilho, string> = {
  verde: 'brilho-verde',
  coral: 'brilho-coral',
  dourado: 'brilho-dourado',
  escuro: 'brilho-escuro',
  cinza: 'brilho-cinza',
}

const TAMANHO: Record<TamanhoBrilho, string> = {
  sm: 'min-h-7 px-3 text-[11px]',
  md: 'min-h-9 px-4 text-[13px]',
  lg: 'min-h-10 px-5 text-[13px]',
}

/** Só a cor do vidro (para elementos que já têm forma própria). */
export const classeTom = (tom: TomBrilho) => TOM[tom]

/** Classe de vidro brilhante: cor do tom e tamanho; pílula por padrão (pilula=false deixa só arredondado). */
export function classeBrilho(tom: TomBrilho, tamanho: TamanhoBrilho = 'md', pilula = true) {
  const forma = pilula ? 'rounded-full' : 'rounded-xl'
  return `brilho ${TOM[tom]} ${TAMANHO[tamanho]} ${forma} inline-flex items-center justify-center gap-1.5 font-bold leading-tight transition hover:brightness-105 active:brightness-95 disabled:opacity-50 disabled:hover:brightness-100`
}
