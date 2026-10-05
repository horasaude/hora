import { z } from 'zod'

const esquema = z.object({
  VITE_SUPABASE_URL: z.url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
})

export const env = esquema.parse(import.meta.env)
