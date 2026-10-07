import { supabase } from '@/lib/supabase'

export type Live = {
  id: string
  tema: string
  data: string
  profissional: 'ana' | 'clara' | 'lais' | null
  duracao_minutos: number
  link_url: string | null
  gravacao_url: string | null
  capa_path: string | null
  capa: string | null
  lembrete: boolean
  presente: boolean
}

/** Lives publicadas (o banco só entrega as publicadas), com lembrete e presença dela. */
export async function listarLives(): Promise<Live[]> {
  const [lives, lembretes, presencas] = await Promise.all([
    supabase
      .from('lives')
      .select('id, tema, data, profissional, duracao_minutos, link_url, gravacao_url, capa_path')
      .order('data'),
    supabase.from('lives_lembretes').select('live_id'),
    supabase.from('lives_presencas').select('live_id'),
  ])
  if (lives.error) throw lives.error
  const caminhos = (lives.data ?? []).flatMap((l) => (l.capa_path ? [l.capa_path] : []))
  const { data: assinadas } = caminhos.length
    ? await supabase.storage.from('materiais').createSignedUrls(caminhos, 3600)
    : { data: [] }
  const capas = new Map((assinadas ?? []).map((a) => [a.path, a.signedUrl]))
  const lembrete = new Set((lembretes.data ?? []).map((l) => l.live_id))
  const presente = new Set((presencas.data ?? []).map((l) => l.live_id))
  return (lives.data ?? []).map((l) => ({
    ...l,
    profissional: l.profissional as Live['profissional'],
    capa: l.capa_path ? (capas.get(l.capa_path) ?? null) : null,
    lembrete: lembrete.has(l.id),
    presente: presente.has(l.id),
  }))
}

export async function alternarLembrete(live: string, ligar: boolean): Promise<void> {
  const { error } = ligar
    ? await supabase.from('lives_lembretes').insert({ live_id: live })
    : await supabase.from('lives_lembretes').delete().eq('live_id', live)
  if (error && error.code !== '23505') throw error
}

/** Registra a presença (o banco confere a janela e dá os pontos uma vez) e devolve o link da sala. */
export async function entrarLive(live: string): Promise<{ link: string | null; pontos: number }> {
  const { data, error } = await supabase.rpc('entrar_live', { p_live: live })
  if (error) throw error
  const r = (data ?? {}) as { link?: string | null; pontos?: number }
  return { link: r.link ?? null, pontos: r.pontos ?? 0 }
}
