import { z } from 'zod'

/** Link opcional: vazio conta como ausente, para a página não quebrar se faltar na Vercel. */
const linkOpcional = z.preprocess((v) => (v === '' ? undefined : v), z.url().optional())

const esquema = z.object({
  VITE_SUPABASE_URL: z.url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
  VITE_MP_LINK_PIX: linkOpcional,
  VITE_MP_LINK_PARCELADO: linkOpcional,
  VITE_MP_LINK_RECORRENTE: linkOpcional,
})

export const env = esquema.parse(import.meta.env)
