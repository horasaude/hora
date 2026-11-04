import { FunctionsHttpError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { Prazo } from './textos'

/** Erro com o código da função (ja_tem_acesso, equipe, falha...). */
export class ErroParceira extends Error {}

async function chamar(corpo: object): Promise<boolean> {
  const { data, error } = await supabase.functions.invoke<{ ok: boolean; enviado?: boolean }>(
    'cadastrar-parceira',
    { body: corpo },
  )
  if (error) {
    let codigo = 'falha'
    if (error instanceof FunctionsHttpError) {
      const r: { erro?: string } = await error.context.json().catch(() => ({}))
      codigo = r.erro ?? 'falha'
    }
    throw new ErroParceira(codigo)
  }
  if (!data?.ok) throw new ErroParceira('falha')
  return Boolean(data.enviado)
}

/** Cria a conta (ou usa a existente), libera o acesso pelo prazo e manda o e-mail. Devolve se o e-mail saiu. */
export const cadastrarParceira = (d: { nome: string; email: string; meses: Prazo }) =>
  chamar({ acao: 'cadastrar', ...d })

/** Manda de novo o e-mail com o botão de criar a senha. */
export const reenviarEmailParceira = (perfil: string) => chamar({ acao: 'reenviar', perfil })

/** Corta o acesso da parceira na hora; a conta e o histórico ficam. */
export async function encerrarParceria(perfil: string): Promise<void> {
  const { error } = await supabase.rpc('encerrar_parceria', { p_perfil: perfil })
  if (error) throw error
}
