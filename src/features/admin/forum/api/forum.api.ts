import type { Categoria, Especialidade } from '@/domain/forum'
import { semValor, supabase } from '@/lib/supabase'
import type { Tables } from '@/types/database'
import { ok } from '../../api/conteudo.api'

export type Situacao = 'abertas' | 'respondidas' | 'ocultas'
export type FiltroFila = {
  categoria: Categoria | ''
  aula: string
  situacao: Situacao
  pagina: number
  tamanho: number
}
export type ItemFila = Tables<'forum_topicos'> & {
  perfis: { apelido: string | null; nome: string } | null
  aulas: { titulo: string } | null
}

export async function resumoForum() {
  const linhas = ok(await supabase.rpc('painel_forum'))
  return linhas[0] ?? { abertas: 0, perto: 0, vencidas: 0, respondidas_semana: 0 }
}

/** Fila do painel, sempre pelo prazo (a que vence primeiro no topo). */
export async function listarFila(f: FiltroFila): Promise<{ lista: ItemFila[]; total: number }> {
  let q = supabase
    .from('forum_topicos')
    .select('*, perfis!forum_topicos_perfil_id_fkey(apelido, nome), aulas(titulo)', {
      count: 'exact',
    })
    .order('prazo_em')
    .range((f.pagina - 1) * f.tamanho, f.pagina * f.tamanho - 1)
  if (f.situacao === 'ocultas') q = q.not('oculto_em', 'is', null)
  else q = q.is('oculto_em', null)
  if (f.situacao === 'abertas') q = q.is('respondida_em', null)
  if (f.situacao === 'respondidas') q = q.not('respondida_em', 'is', null)
  if (f.categoria) q = q.eq('categoria', f.categoria)
  if (f.aula === 'geral') q = q.is('aula_id', null)
  else if (f.aula) q = q.eq('aula_id', f.aula)
  const { data, error, count } = await q
  if (error) throw error
  return { lista: (data ?? []) as ItemFila[], total: count ?? 0 }
}

export async function listarAulasSimples() {
  return ok(await supabase.from('aulas').select('id, titulo').order('titulo'))
}

export async function listarDenuncias() {
  return ok(await supabase.rpc('painel_denuncias_forum'))
}

export async function marcarUtil(topico: string) {
  return ok(await supabase.rpc('forum_marcar_util', { p_topico: topico }))
}

export async function ocultar(d: { topico?: string; resposta?: string; motivo: string }) {
  ok(
    await supabase.rpc('forum_ocultar', {
      p_topico: d.topico ?? semValor,
      p_resposta: d.resposta ?? semValor,
      p_motivo: d.motivo,
    }),
  )
}

export async function manter(d: { topico?: string; resposta?: string }) {
  ok(
    await supabase.rpc('forum_manter', {
      p_topico: d.resposta ? semValor : (d.topico ?? semValor),
      p_resposta: d.resposta ?? semValor,
    }),
  )
}

export type PerfilEquipe = {
  nome: string
  especialidade: Especialidade | null
  titulo_profissional: string | null
  foto_path: string | null
}

async function meuId() {
  const { data } = await supabase.auth.getSession()
  const id = data.session?.user.id
  if (!id) throw new Error('sem sessão')
  return id
}

export async function meuPerfilEquipe(): Promise<PerfilEquipe> {
  const id = await meuId()
  return ok(
    await supabase
      .from('perfis')
      .select('nome, especialidade, titulo_profissional, foto_path')
      .eq('id', id)
      .single(),
  ) as PerfilEquipe
}

/** Salva o perfil; a foto nova vai para a pasta da profissional no espaço público equipe. */
export async function salvarPerfilEquipe(d: PerfilEquipe & { arquivo?: File }) {
  let foto = d.foto_path
  if (d.arquivo) {
    const id = await meuId()
    foto = `${id}/${crypto.randomUUID()}.${d.arquivo.name.split('.').pop() ?? 'jpg'}`
    const { error } = await supabase.storage
      .from('equipe')
      .upload(foto, d.arquivo, { contentType: d.arquivo.type })
    if (error) throw error
  }
  ok(
    await supabase.rpc('salvar_perfil_equipe', {
      p_nome: d.nome,
      p_especialidade: d.especialidade ?? semValor,
      p_titulo: d.titulo_profissional ?? semValor,
      p_foto_path: foto ?? semValor,
    }),
  )
}
