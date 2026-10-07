// Formato do cardápio guardado no banco (jsonb de refeições e lista de compras).
// Usado pelo painel ao editar e pela aluna ao ler; fora do formato vira lista vazia.
import { z } from 'zod'
import type { ListaCompras } from './listaCompras'
import type { Refeicao } from './nutricao'

const numero = z.number().finite()
const nutrientes = z.object({
  kcal: numero,
  proteina: numero,
  carboidrato: numero,
  gordura: numero,
  fibra: numero,
})
const opcao = z.object({
  tipo: z.enum(['alimento', 'receita']),
  ref_id: z.string(),
  nome: z.string(),
  grupo: z.string(),
  medida: z.string(),
  gramas_medida: numero,
  quantidade: numero,
  gramas: numero,
  nutrientes,
})
const item = z.object({ opcoes: z.array(opcao).min(1) })
const substituta = z.object({
  id: z.string(),
  nome: z.string(),
  itens: z.array(item),
  texto: z.string(),
})
const refeicao = z.object({
  id: z.string(),
  nome: z.string(),
  horario: z.string(),
  itens: z.array(item),
  texto: z.string(),
  observacao: z.string(),
  substitutas: z.array(substituta),
})
const lista = z.array(
  z.object({
    grupo: z.enum(['Hortifruti', 'Proteínas', 'Laticínios', 'Grãos', 'Outros']),
    itens: z.array(z.object({ nome: z.string(), quantidade: z.string() })),
  }),
)

export const lerRefeicoes = (valor: unknown): Refeicao[] =>
  z.array(refeicao).safeParse(valor).data ?? []
export const lerItens = (valor: unknown) => z.array(item).safeParse(valor).data ?? []
export const lerLista = (valor: unknown): ListaCompras => lista.safeParse(valor).data ?? []
