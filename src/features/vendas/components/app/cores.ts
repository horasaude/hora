/** Paleta do app na página: cada área com a sua cor da família ORA (classes escritas por extenso para o Tailwind). */
export type Cor = 'terracota' | 'salvia' | 'ocre' | 'ora'

export const cores: Record<Cor, { forte: string; suave: string; texto: string; borda: string }> = {
  terracota: {
    forte: 'bg-terracota-escuro',
    suave: 'bg-terracota-suave',
    texto: 'text-terracota-escuro',
    borda: 'border-terracota-escuro',
  },
  salvia: {
    forte: 'bg-salvia',
    suave: 'bg-salvia-suave',
    texto: 'text-ora',
    borda: 'border-salvia',
  },
  ocre: {
    forte: 'bg-[#a77a32]',
    suave: 'bg-ocre-suave',
    texto: 'text-[#8a6326]',
    borda: 'border-[#a77a32]',
  },
  ora: { forte: 'bg-ora', suave: 'bg-ora-suave', texto: 'text-ora', borda: 'border-ora' },
}

export const SEQUENCIA: Cor[] = ['terracota', 'salvia', 'ocre', 'ora']
