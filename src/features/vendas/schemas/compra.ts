import { z } from 'zod'
import { PLANOS } from '@/domain/precos'
import { soDigitos } from '@/lib/telefone'
import { textos } from '../textos'

const e = textos.compra.erros

export const esquemaCompra = z.object({
  plano: z.enum(PLANOS, { error: e.plano }),
  nome: z.string().trim().min(2, e.nome).max(120, e.nome),
  email: z.string().trim().max(254, e.email).pipe(z.email(e.email)),
  whatsapp: z.string().refine((v) => /^[0-9]{10,11}$/.test(soDigitos(v)), e.whatsapp),
  site: z.string().optional(),
})

export type EntradaCompra = z.input<typeof esquemaCompra>
export type Compra = z.output<typeof esquemaCompra>
