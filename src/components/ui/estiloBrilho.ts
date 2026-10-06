// Classes do estilo brilho (docs/referencias/estilo-brilho.html). Base dos componentes em Brilho.tsx.

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
  sm: 'min-h-9 px-3.5 text-sm',
  md: 'min-h-11 px-5 text-sm',
  lg: 'min-h-14 px-6 text-base',
}

/** Só a cor do vidro (para elementos que já têm forma própria). */
export const classeTom = (tom: TomBrilho) => TOM[tom]

/** Classe de vidro brilhante: cor do tom, tamanho e forma (pílula ou arredondado). */
export function classeBrilho(tom: TomBrilho, tamanho: TamanhoBrilho = 'md', pilula = false) {
  const forma = pilula ? 'rounded-full' : 'rounded-2xl'
  const leve = tamanho === 'sm' ? 'brilho-leve' : ''
  return `brilho ${leve} ${TOM[tom]} ${TAMANHO[tamanho]} ${forma} inline-flex items-center justify-center gap-1.5 font-bold transition hover:brightness-105 active:brightness-95 disabled:opacity-50 disabled:hover:brightness-100`
}
