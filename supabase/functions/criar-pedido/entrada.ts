import { z } from 'zod'
import { cpfValido, PLANOS } from '../_shared/pagamento/regras.ts'

const texto = (max: number) => z.string().trim().max(max).optional()
const digitos = (re: RegExp) =>
  z
    .string()
    .transform((v) => v.replace(/\D/g, ''))
    .pipe(z.string().regex(re))

/** Cartão digitado no checkout. Só passa por aqui a caminho do Asaas: nunca é gravado. */
const cartao = z.object({
  numero: digitos(/^\d{13,19}$/),
  nome: z.string().trim().min(2).max(80),
  mes: z.number().int().min(1).max(12),
  ano: z.number().int().min(2024).max(2099),
  cvv: digitos(/^\d{3,4}$/),
  cep: digitos(/^\d{8}$/),
  numero_casa: z.string().trim().min(1).max(10),
})

/** Corpo do checkout. Preço nunca vem daqui: o servidor decide. */
export const esquemaPedido = z
  .object({
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
    rastreio: z
      .object({ fbp: texto(200), fbc: texto(500), recusou: z.boolean().optional() })
      .default({}),
    cupom: z
      .string()
      .trim()
      .toUpperCase()
      .regex(/^[A-Z0-9]{3,20}$/)
      .nullish(),
    cartao: cartao.optional(),
    parcelas: z.number().int().min(1).max(12).optional(),
  })
  .refine((d) => d.plano === 'pix' || d.cartao)

export type EntradaPedido = z.infer<typeof esquemaPedido>
export type Cartao = z.infer<typeof cartao>
