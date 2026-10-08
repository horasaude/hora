import { createClient } from '@supabase/supabase-js'

/** Cliente com a chave de serviço: só dentro das Edge Functions, nunca no navegador. */
export const servico = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  { auth: { persistSession: false, autoRefreshToken: false } },
)

const endereco = (nome: string) =>
  (Deno.env.get(nome) || 'https://hora-snowy.vercel.app').replace(/\/$/, '')

/** Endereço do site (comunidadeora.com.br): vendas e checkout na raiz, plataforma da aluna em /app. */
export const SITE = endereco('SITE_URL')

export function json(corpo: unknown, status = 200, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(corpo), {
    status,
    headers: { ...extra, 'Content-Type': 'application/json' },
  })
}
