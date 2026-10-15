import { z } from 'zod'

const esquema = z.object({
  VITE_SUPABASE_URL: z.url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
})

const lido = esquema.safeParse(import.meta.env)

/** Falso quando falta configuração na Vercel: o main.tsx mostra a tela de erro em vez da página em branco. */
export const configuracaoOk = lido.success

export const env = lido.success
  ? lido.data
  : { VITE_SUPABASE_URL: 'https://configuracao-ausente.invalid', VITE_SUPABASE_ANON_KEY: 'ausente' }
