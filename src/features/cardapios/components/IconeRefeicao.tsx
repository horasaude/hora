import { IconeLua, IconeMaca, IconePrato, IconeSol } from './IconesCardapio'

type Tom = { Icone: typeof IconeSol; cor: string }

const SOL: Tom = { Icone: IconeSol, cor: 'bg-[#fdf1d8] text-[#a86d05]' }
const PRATO: Tom = { Icone: IconePrato, cor: 'bg-[#e2f4eb] text-[#14774d]' }
const MACA: Tom = { Icone: IconeMaca, cor: 'bg-[#fde7df] text-[#c2461f]' }
const LUA: Tom = { Icone: IconeLua, cor: 'bg-[#eee9fb] text-[#6a4fbd]' }

/** Ícone pelo nome da refeição (café, almoço, lanche, jantar); sem palavra conhecida, alterna pela ordem. */
function tomDe(nome: string, ordem: number): Tom {
  const n = nome.toLowerCase()
  if (/caf|desjejum|manh/.test(n)) return SOL
  if (/almo/.test(n)) return PRATO
  if (/lanche|colação|colacao/.test(n)) return MACA
  if (/jantar|ceia|noite/.test(n)) return LUA
  return [SOL, PRATO, MACA, LUA][ordem % 4] ?? SOL
}

/** Quadradinho colorido de 30 px com o ícone da refeição. */
export function IconeRefeicao({ nome, ordem }: { nome: string; ordem: number }) {
  const { Icone, cor } = tomDe(nome, ordem)
  return (
    <span className={`grid size-[30px] shrink-0 place-items-center rounded-[10px] ${cor}`}>
      <Icone className="size-4" />
    </span>
  )
}
