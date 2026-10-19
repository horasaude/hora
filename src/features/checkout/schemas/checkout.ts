import { z } from 'zod'
import { cpfValido } from '@/domain/cpf'
import { PLANOS } from '@/domain/precos'
import { cartaoValido, validadeValida } from '@/lib/cartao'
import { soDigitos } from '@/lib/telefone'
import { textos } from '../textos'

const e = textos.erros

export const esquemaCheckout = z
  .object({
    plano: z.enum(PLANOS),
    email: z.string().trim().max(254, e.email).pipe(z.email(e.email)),
    nome: z
      .string()
      .trim()
      .max(120, e.nome)
      .refine((v) => v.split(/\s+/).filter(Boolean).length >= 2, e.nome),
    cpf: z.string().refine(cpfValido, e.cpf),
    whatsapp: z.string().refine((v) => /^[0-9]{10,11}$/.test(soDigitos(v)), e.whatsapp),
    numeroCartao: z.string().default(''),
    nomeCartao: z.string().default(''),
    validade: z.string().default(''),
    cvv: z.string().default(''),
    cep: z.string().default(''),
    numeroCasa: z.string().default(''),
    parcelas: z.coerce.number<string>().int().min(1).max(12).default(12),
  })
  .superRefine((d, ctx) => {
    if (d.plano === 'pix') return
    const erro = (campo: string, message: string) =>
      ctx.addIssue({ code: 'custom', path: [campo], message })
    if (!cartaoValido(d.numeroCartao)) erro('numeroCartao', e.numeroCartao)
    if (d.nomeCartao.trim().length < 2) erro('nomeCartao', e.nomeCartao)
    if (!validadeValida(d.validade)) erro('validade', e.validade)
    if (!/^\d{3,4}$/.test(d.cvv)) erro('cvv', e.cvv)
    if (soDigitos(d.cep).length !== 8) erro('cep', e.cep)
    if (!d.numeroCasa.trim()) erro('numeroCasa', e.numeroCasa)
  })

export type EntradaCheckout = z.input<typeof esquemaCheckout>
export type DadosCheckout = z.output<typeof esquemaCheckout>
