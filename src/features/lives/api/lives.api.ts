import { FunctionsHttpError } from '@supabase/supabase-js'
import type { Profissional } from '@/domain/lives'
import { supabase } from '@/lib/supabase'

export type Live = {
  id: string
  tema: string
  data: string
  profissionais: Profissional[]
  duracao_minutos: number
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
      .select('id, tema, data, profissionais, duracao_minutos, gravacao_url, capa_path')
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
    profissionais: l.profissionais as Profissional[],
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

/** Erro da entrada na live (sem_acesso, fora_do_horario, sem_live, falha). */
export class ErroEntrar extends Error {}

/**
 * Entra pelo servidor: o banco confere a janela e dá os pontos uma vez; a aluna vira membro da
 * sala restrita do Meet e recebe o link (que, repassado, cai no "Pedir para participar").
 */
export async function entrarLive(live: string): Promise<{ link: string | null; pontos: number }> {
  type Resposta = { ok: boolean; link?: string | null; pontos?: number; erro?: string }
  const { data, error } = await supabase.functions.invoke<Resposta>('live-entrar', {
    body: { live },
  })
  if (error) {
    const r: Resposta | null =
      error instanceof FunctionsHttpError ? await error.context.json().catch(() => null) : null
    throw new ErroEntrar(r?.erro ?? 'falha')
  }
  return { link: data?.link ?? null, pontos: data?.pontos ?? 0 }
}
