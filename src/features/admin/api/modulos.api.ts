import { supabase } from '@/lib/supabase'
import type { Tables, TablesInsert, TablesUpdate } from '@/types/database'
import { ok } from './conteudo.api'

export type Desafio = Tables<'desafios'>
export type Configuracoes = Tables<'configuracoes'>
export type NumerosDesafio = { id: string; participantes: number; concluintes: number }
export type Vencedora = { perfil_id: string; nome: string; apelido: string | null; dias: number }
export type AlunaPainel = {
  id: string
  nome: string
  apelido: string | null
  acesso_inicio_em: string | null
  acesso_fim_em: string | null
  ultimo_acesso_em: string | null
  dia: number | null
  aulas_liberadas: number
  aulas_concluidas: number
}

export async function listarDesafios(): Promise<Desafio[]> {
  return ok(await supabase.from('desafios').select('*').order('inicio', { ascending: false }))
}

export async function salvarDesafio(dados: TablesInsert<'desafios'>): Promise<Desafio> {
  const { id, ...campos } = dados
  const consulta = id
    ? supabase.from('desafios').update(campos).eq('id', id)
    : supabase.from('desafios').insert(campos)
  return ok(await consulta.select('*').single())
}

export async function encerrarDesafio(id: string): Promise<void> {
  ok(
    await supabase.from('desafios').update({ encerrado_em: new Date().toISOString() }).eq('id', id),
  )
}

/** Participantes e concluintes por desafio, e alunas distintas nos ativos. */
export async function numerosDesafios(): Promise<{ porDesafio: NumerosDesafio[]; alunas: number }> {
  const [por, alunas] = await Promise.all([
    supabase.rpc('painel_desafios'),
    supabase.rpc('alunas_em_desafios_ativos'),
  ])
  return { porDesafio: ok(por), alunas: ok(alunas) ?? 0 }
}

export async function listarVencedoras(desafio: string): Promise<Vencedora[]> {
  return ok(await supabase.rpc('vencedoras_desafio', { p_desafio: desafio }))
}

export async function listarAlunas(): Promise<AlunaPainel[]> {
  return ok(await supabase.rpc('painel_alunas'))
}

export async function buscarConfiguracoes(): Promise<Configuracoes> {
  return ok(await supabase.from('configuracoes').select('*').single())
}

export async function salvarConfiguracoes(campos: TablesUpdate<'configuracoes'>): Promise<void> {
  ok(await supabase.from('configuracoes').update(campos).eq('id', true))
}

export async function listarParticipantes(desafio: string) {
  return ok(await supabase.rpc('participantes_desafio', { p_desafio: desafio }))
}
