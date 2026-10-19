import { z } from 'zod'
import { cpfValido, PLANOS } from '../_shared/pagamento/regras.ts'

const texto = (max: number) => z.string().trim().max(max).optional()

/** Corpo do checkout. Preço nunca vem daqui: o servidor decide. */
export const esquemaPedido = z.object({
  acao: z.literal('criar').default('criar'),
  plano: z.enum(PLANOS),
  nome: z
    .string()
    .trim()
    .min(3)
    .max(120)
    .refine((v) => v.split(/\s+/).length >= 2),
  email: z.string().trim().toLowerCase().max(254).pipe(z.email()),
  cpf: z
    .string()
    .transform((v) => v.replace(/\D/g, ''))
    .refine(cpfValido),
  whatsapp: z
    .string()
    .transform((v) => v.replace(/\D/g, ''))
    .refine((v) => /^\d{10,11}$/.test(v)),
  indicacao: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9]{4,16}$/)
    .nullish(),
  utms: z
    .object({
      source: texto(200),
      medium: texto(200),
      campaign: texto(200),
      content: texto(200),
      term: texto(200),
    })
    .default({}),
})

export type EntradaPedido = z.infer<typeof esquemaPedido>
