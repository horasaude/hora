import { z } from 'zod'
import { tAlimentos } from '../textos'

export { lerItens, lerLista, lerRefeicoes } from '@/domain/formatoCardapio'

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
