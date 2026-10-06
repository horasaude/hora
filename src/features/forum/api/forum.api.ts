import type { Categoria } from '@/domain/forum'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'

type Linha = Database['public']['Functions']['forum_listar']['Returns'][number]

export type RespostaForum = {
  id: string
  texto: string
  created_at: string
  da_equipe: boolean
  autora: string
  titulo: string | null
  foto: string | null
  curtidas: number
  curti: boolean
  minha: boolean
  oculto: boolean
}
export type Duvida = Omit<Linha, 'respostas'> & { respostas: RespostaForum[] }
export type Filtro = {
  aula?: string
  categoria?: Categoria | ''
  busca?: string
  minhas?: boolean
  limite?: number
}

const duvida = (l: Linha): Duvida => ({ ...l, respostas: (l.respostas ?? []) as RespostaForum[] })

export async function listarDuvidas(f: Filtro): Promise<Duvida[]> {
  const { data, error } = await supabase.rpc('forum_listar', {
    p_aula: f.aula,
    p_categoria: f.categoria || undefined,
    p_busca: f.busca?.trim() || undefined,
    p_minhas: f.minhas ?? false,
    p_limite: f.limite ?? 30,
  })
  if (error) throw error
  return (data ?? []).map(duvida)
}

/** Uma dúvida com a conversa inteira; null quando não existe ou foi ocultada. */
export async function buscarDuvida(id: string): Promise<Duvida | null> {
  const { data, error } = await supabase.rpc('forum_listar', { p_id: id })
  if (error) throw error
  const l = data?.[0]
  return l ? duvida(l) : null
}

export async function perguntar(d: { texto: string; categoria: Categoria; aula?: string }) {
  const { data, error } = await supabase.rpc('forum_perguntar', {
    p_texto: d.texto,
    p_categoria: d.categoria,
    p_aula: d.aula,
  })
  if (error) throw error
  return data
}

export async function responder(d: { topico: string; texto: string }) {
  const { error } = await supabase.rpc('forum_responder', { p_topico: d.topico, p_texto: d.texto })
  if (error) throw error
}

export async function curtir(d: { resposta: string; curtir: boolean }) {
  const { error } = await supabase.rpc('forum_curtir', {
    p_resposta: d.resposta,
    p_curtir: d.curtir,
  })
  if (error) throw error
}

export async function denunciar(d: { topico?: string; resposta?: string; motivo: string }) {
  const { error } = await supabase.rpc('forum_denunciar', {
    p_topico: d.topico ?? null,
    p_resposta: d.resposta ?? null,
    p_motivo: d.motivo,
  })
  if (error) throw error
}

/** Se a aluna já viu as regras do fórum. */
export async function regrasAceitas(): Promise<boolean> {
  const { data: sessao } = await supabase.auth.getSession()
  const id = sessao.session?.user.id
  if (!id) return true
  const { data, error } = await supabase
    .from('perfis')
    .select('forum_regras_em')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return Boolean(data?.forum_regras_em)
}

export async function aceitarRegras() {
  const { error } = await supabase.rpc('forum_aceitar_regras')
  if (error) throw error
}

export async function marcarVista(id: string) {
  const { error } = await supabase.rpc('forum_marcar_vista', { p_topico: id })
  if (error) throw error
}

export async function minhasRespondidas() {
  const { data, error } = await supabase.rpc('forum_minhas_respondidas')
  if (error) throw error
  return data ?? []
}

/** Link público da foto da profissional (espaço equipe). */
export const fotoEquipe = (caminho: string) =>
  supabase.storage.from('equipe').getPublicUrl(caminho).data.publicUrl
