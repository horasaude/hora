import { z } from 'zod'
import { cpfValido } from '@/domain/cpf'
import { PLANOS } from '@/domain/precos'
import { soDigitos } from '@/lib/telefone'
import { textos } from '../textos'

const e = textos.erros

export const esquemaCheckout = z.object({
  plano: z.enum(PLANOS),
  email: z.string().trim().max(254, e.email).pipe(z.email(e.email)),
  nome: z
    .string()
    .trim()
    .max(120, e.nome)
    .refine((v) => v.split(/\s+/).filter(Boolean).length >= 2, e.nome),
  cpf: z.string().refine(cpfValido, e.cpf),
  whatsapp: z.string().refine((v) => /^[0-9]{10,11}$/.test(soDigitos(v)), e.whatsapp),
})

export type EntradaCheckout = z.input<typeof esquemaCheckout>
export type DadosCheckout = z.output<typeof esquemaCheckout>
