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

async function chamar(corpo: object): Promise<string | null> {
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
  if (!data?.ok) throw new ErroEquipe('falha')
  return data.link ?? null
}

/** Cria a conta da profissional já com a senha cadastrada pelo painel. */
export const cadastrarProfissional = async (
  d: DadosProfissional & { email: string; senha: string },
): Promise<void> => {
  await chamar({ acao: 'convidar', ...d })
}

/** Define uma nova senha para quem já está na equipe. */
export const definirSenhaProfissional = async (d: { perfil: string; senha: string }) => {
  await chamar({ acao: 'senha', ...d })
}

/** Novo link de acesso (convite que expirou ou senha esquecida). */
export const novoLinkDeAcesso = async (perfil: string): Promise<string> => {
  const link = await chamar({ acao: 'link', perfil })
  if (!link) throw new ErroEquipe('falha')
  return link
}
