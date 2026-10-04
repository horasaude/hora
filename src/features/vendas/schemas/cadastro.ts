import { z } from 'zod'
import { PLANOS } from '@/domain/precos'
import { soDigitos } from '@/lib/telefone'
import { textos } from '../textos'

const e = textos.cadastro.erros

export const esquemaCadastro = z.object({
  nome: z.string().trim().min(2, e.nome).max(120, e.nome),
  email: z.string().trim().max(254, e.email).pipe(z.email(e.email)),
  whatsapp: z.string().refine((v) => /^[0-9]{10,11}$/.test(soDigitos(v)), e.whatsapp),
  plano: z.enum(PLANOS, { error: e.plano }),
  aceite: z.literal(true, { error: e.aceite }),
  site: z.string().optional(),
})

export type EntradaCadastro = z.input<typeof esquemaCadastro>
export type Cadastro = z.output<typeof esquemaCadastro>
