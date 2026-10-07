import { FunctionsHttpError } from '@supabase/supabase-js'
import type { Especialidade } from '@/domain/forum'
import { semValor, supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'
import { ok } from '../../api/conteudo.api'

export type Profissional = Database['public']['Functions']['painel_equipe']['Returns'][number]
export type DadosProfissional = {
  nome: string
  especialidade: Especialidade | null
  titulo: string
}

export async function listarEquipe(): Promise<Profissional[]> {
  return ok(await supabase.rpc('painel_equipe'))
}

export async function editarProfissional(d: DadosProfissional & { perfil: string }) {
  ok(
    await supabase.rpc('editar_profissional', {
      p_perfil: d.perfil,
      p_nome: d.nome,
      p_especialidade: d.especialidade ?? semValor,
      p_titulo: d.titulo || semValor,
    }),
  )
}

export async function removerProfissional(perfil: string) {
  ok(await supabase.rpc('remover_profissional', { p_perfil: perfil }))
}

/** Erro com o código da função (ja_existe, falha...). */
export class ErroEquipe extends Error {}

async function chamar(corpo: object): Promise<string> {
  const { data, error } = await supabase.functions.invoke<{ ok: boolean; link?: string }>(
    'convidar-profissional',
    { body: corpo },
  )
  if (error) {
    let codigo = 'falha'
    if (error instanceof FunctionsHttpError) {
      const r: { erro?: string } = await error.context.json().catch(() => ({}))
      codigo = r.erro ?? 'falha'
    }
    throw new ErroEquipe(codigo)
  }
  if (!data?.link) throw new ErroEquipe('falha')
  return data.link
}

/** Cria a conta da profissional e devolve o link para ela criar a senha. */
export const convidarProfissional = (d: DadosProfissional & { email: string }) =>
  chamar({ acao: 'convidar', ...d })

/** Novo link de acesso (convite que expirou ou senha esquecida). */
export const novoLinkDeAcesso = (perfil: string) => chamar({ acao: 'link', perfil })
