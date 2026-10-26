import { z } from 'zod'
import { PLANOS } from '@/domain/precos'
import type { Cupom } from '@/domain/cupom'
import { env } from '@/lib/env'

const linha = z.object({
  codigo: z.string(),
  tipo: z.enum(['porcentagem', 'valor']),
  valor: z.number(),
  planos: z.array(z.enum(PLANOS)),
})

/** Confere o cupom no banco (ativo, no prazo e com uso livre). Sem cupom válido: null. */
export async function consultarCupom(codigo: string): Promise<Cupom | null> {
  const r = await fetch(`${env.VITE_SUPABASE_URL}/rest/v1/rpc/consultar_cupom`, {
    method: 'POST',
    headers: {
      apikey: env.VITE_SUPABASE_ANON_KEY,
      Authorization: `Bearer ${env.VITE_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ p_codigo: codigo }),
  })
  if (!r.ok) throw new Error('cupom')
  const lido = z.array(linha).safeParse(await r.json())
  return lido.success ? (lido.data[0] ?? null) : null
}
