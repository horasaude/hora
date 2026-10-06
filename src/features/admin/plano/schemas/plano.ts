import { z } from 'zod'
import type { ListaCompras } from '@/domain/listaCompras'
import type { Refeicao } from '@/domain/nutricao'
import { tAlimentos } from '../textos'

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
    grupo: z.enum(['Hortifruti', 'Carnes e ovos', 'Laticínios', 'Grãos', 'Outros']),
    itens: z.array(z.object({ nome: z.string(), quantidade: z.string() })),
  }),
)

/** Refeições guardadas no banco (jsonb); fora do formato vira lista vazia. */
export const lerRefeicoes = (valor: unknown): Refeicao[] =>
  z.array(refeicao).safeParse(valor).data ?? []
export const lerItens = (valor: unknown) => z.array(item).safeParse(valor).data ?? []
export const lerLista = (valor: unknown): ListaCompras => lista.safeParse(valor).data ?? []

const valorPor100 = z
  .string()
  .trim()
  .refine(
    (v) => v === '' || (/^\d{1,4}([.,]\d{1,2})?$/.test(v) && Number(v.replace(',', '.')) <= 9999),
    tAlimentos.erroNumero,
  )
  .transform((v) => (v === '' ? null : Number(v.replace(',', '.'))))

export const esquemaAlimento = z.object({
  nome: z.string().trim().min(1, tAlimentos.erroNome).max(200),
  grupo: z.string().max(80),
  kcal: valorPor100,
  proteina: valorPor100,
  carboidrato: valorPor100,
  gordura: valorPor100,
  fibra: valorPor100,
  medidas: z.array(
    z.object({
      nome: z.string().trim().min(1, tAlimentos.erroNome).max(60),
      gramas: z
        .string()
        .trim()
        .refine(
          (v) => /^\d{1,4}([.,]\d{1,2})?$/.test(v) && Number(v.replace(',', '.')) > 0,
          tAlimentos.erroNumero,
        )
        .transform((v) => Number(v.replace(',', '.'))),
    }),
  ),
})
export type EntradaAlimento = z.input<typeof esquemaAlimento>
