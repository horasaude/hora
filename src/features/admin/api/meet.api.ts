import { FunctionsHttpError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { ok } from './conteudo.api'

/** Erro com o código da função (sem_conexao, falha...). */
export class ErroMeet extends Error {}

type Resposta = { ok: boolean; url?: string; link?: string; erro?: string }

async function chamar(corpo: object): Promise<Resposta> {
  const { data, error } = await supabase.functions.invoke<Resposta>('google-meet', { body: corpo })
  if (error) {
    const r: Resposta | null =
      error instanceof FunctionsHttpError ? await error.context.json().catch(() => null) : null
    throw new ErroMeet(r?.erro ?? 'falha')
  }
  if (!data?.ok) throw new ErroMeet(data?.erro ?? 'falha')
  return data
}

/** Conta Google conectada (só a profissional enxerga); null quando ainda não conectou. */
export async function contaGoogle(): Promise<string | null> {
  const linhas = ok(await supabase.rpc('google_conectado'))
  return linhas[0]?.conta ?? null
}

/** Endereço do Google para autorizar a conta da ORA. */
export const linkConectar = async (): Promise<string> =>
  (await chamar({ acao: 'conectar' })).url ?? ''

/** Cria a sala do Meet da live (se ela ainda não tem link) e devolve o link. */
export const criarSala = async (live: string): Promise<string> =>
  (await chamar({ acao: 'sala', live })).link ?? ''
