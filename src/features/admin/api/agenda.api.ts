import { supabase } from '@/lib/supabase'
import type { Tables, TablesInsert } from '@/types/database'
import { ok } from './conteudo.api'

export type Convidada = { nome: string; email: string }
/** Live do painel com o link da sala (só a equipe vê) e as convidadas. */
export type Live = Tables<'lives'> & { sala: string | null; convidadas: Convidada[] }
export type Aviso = Tables<'avisos'>

const CAMPOS_LIVE = '*, lives_salas(link_url), lives_convidadas(nome, email)'

type LinhaLive = Tables<'lives'> & {
  lives_salas: { link_url: string | null } | null
  lives_convidadas: Convidada[]
}

const paraLive = ({ lives_salas, lives_convidadas, ...l }: LinhaLive): Live => ({
  ...l,
  sala: lives_salas?.link_url ?? null,
  convidadas: lives_convidadas,
})

export async function listarLives(): Promise<Live[]> {
  const linhas = ok(
    await supabase.from('lives').select(CAMPOS_LIVE).order('data', { ascending: false }),
  )
  return (linhas as unknown as LinhaLive[]).map(paraLive)
}

/** Salva a live e troca a lista de convidadas (o banco limpa os e-mails). */
export async function salvarLive(
  dados: TablesInsert<'lives'> & { convidadas: Convidada[] },
): Promise<Live> {
  const { id, convidadas, ...campos } = dados
  const consulta = id
    ? supabase.from('lives').update(campos).eq('id', id)
    : supabase.from('lives').insert(campos)
  const { id: live } = ok(await consulta.select('id').single()) as { id: string }
  ok(await supabase.rpc('salvar_convidadas', { p_live: live, p_lista: convidadas }))
  const linha = ok(await supabase.from('lives').select(CAMPOS_LIVE).eq('id', live).single())
  return paraLive(linha as unknown as LinhaLive)
}

export async function listarAvisos(): Promise<Aviso[]> {
  return ok(await supabase.from('avisos').select('*').order('publicar_em', { ascending: false }))
}

export async function salvarAviso(dados: TablesInsert<'avisos'>): Promise<Aviso> {
  const { id, ...campos } = dados
  const consulta = id
    ? supabase.from('avisos').update(campos).eq('id', id)
    : supabase.from('avisos').insert(campos)
  return ok(await consulta.select('*').single())
}
