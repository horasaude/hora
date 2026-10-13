// Classes do item do menu lateral (painel escuro e área da aluna clara).

export type TomMenu = 'escuro' | 'claro'

const BASE = 'flex min-h-10 items-center gap-2.5 rounded-xl px-3 text-sm transition'
const TOM: Record<TomMenu, (ativo: boolean) => string> = {
  escuro: (ativo) => `text-[#E9EFEC] ${ativo ? 'bg-white/12 font-bold' : 'hover:bg-white/6'}`,
  claro: (ativo) =>
    ativo ? 'brilho brilho-verde font-bold text-white' : 'text-tinta hover:bg-trilho',
}

/** Classe do item do menu (também para botões que abrem grupos). */
export const classeItemMenu = (ativo: boolean, tom: TomMenu = 'escuro') =>
  `${BASE} ${TOM[tom](ativo)}`
