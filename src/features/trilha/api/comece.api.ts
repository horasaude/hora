import { supabase } from '@/lib/supabase'

export const ITENS_COMECE = ['perfil', 'medidas', 'foto', 'regras', 'app'] as const
export type ItemComece = (typeof ITENS_COMECE)[number]

export type ComeceAqui = { video_url: string | null; texto: string; feitos: ItemComece[] }

/** Vídeo e texto do painel e os passos que ela já fez (medidas contam se já houver registro). */
export async function buscarComeceAqui(): Promise<ComeceAqui> {
  const [conteudo, feitos, medidas] = await Promise.all([
    supabase.from('comece_aqui').select('video_url, texto').maybeSingle(),
    supabase.from('comece_aqui_feitos').select('item'),
    supabase.from('medidas').select('id, foto_path'),
  ])
  if (conteudo.error) throw conteudo.error
  if (feitos.error) throw feitos.error
  const lista = new Set((feitos.data ?? []).map((f) => f.item as ItemComece))
  if ((medidas.data ?? []).length > 0) lista.add('medidas')
  if ((medidas.data ?? []).some((m) => m.foto_path)) lista.add('foto')
  return {
    video_url: conteudo.data?.video_url ?? null,
    texto: conteudo.data?.texto ?? '',
    feitos: ITENS_COMECE.filter((i) => lista.has(i)),
  }
}

export async function marcarComece(item: ItemComece): Promise<void> {
  const { error } = await supabase.from('comece_aqui_feitos').insert({ item })
  if (error && error.code !== '23505') throw error
}

export type Regra = { acao: string; nome: string; pontos: number }

/** Regras de pontos ligadas, para "ler as regras de pontuação". */
export async function buscarRegras(): Promise<Regra[]> {
  const { data, error } = await supabase
    .from('regras_pontos')
    .select('acao, nome, pontos')
    .eq('ativo', true)
    .gt('pontos', 0)
    .order('ordem')
  if (error) throw error
  return data ?? []
}
