import { createClient } from '@supabase/supabase-js'

/** Cliente com a chave de serviço: só dentro das Edge Functions, nunca no navegador. */
export const servico = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  { auth: { persistSession: false, autoRefreshToken: false } },
)

const endereco = (nome: string) =>
  (Deno.env.get(nome) || 'https://hora-snowy.vercel.app').replace(/\/$/, '')

/** Página de vendas e checkout (comunidadeora.com.br). */
export const SITE = endereco('SITE_URL')

/** Plataforma da aluna (app.comunidadeora.com.br): login, definir senha e o app instalável. */
export const APP = endereco('APP_URL')

export function json(corpo: unknown, status = 200, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(corpo), {
    status,
    headers: { ...extra, 'Content-Type': 'application/json' },
  })
}
