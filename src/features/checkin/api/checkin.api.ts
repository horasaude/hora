import { subirFoto } from '@/lib/fotos'
import { supabase, semValor } from '@/lib/supabase'
import type { Habito } from '../textos'

export type MeusCheckins = { hoje: Habito[]; dias: string[]; porDia: Record<string, Habito[]> }

/** Check-ins válidos desde a data (AAAA-MM-DD): os hábitos de hoje e os dias com algum check-in. */
export async function buscarMeusCheckins(desde: string, hoje: string): Promise<MeusCheckins> {
  const { data, error } = await supabase
    .from('checkins')
    .select('tipo, dia')
    .gte('dia', desde)
    .is('invalidado_em', null)
  if (error) throw error
  const linhas = data ?? []
  return {
    hoje: linhas.filter((l) => l.dia === hoje).map((l) => l.tipo as Habito),
    dias: [...new Set(linhas.map((l) => l.dia))],
    porDia: linhas.reduce<Record<string, Habito[]>>((acc, l) => {
      acc[l.dia] = [...(acc[l.dia] ?? []), l.tipo as Habito]
      return acc
    }, {}),
  }
}

export type NovoCheckin = {
  tipo: Habito
  arquivo?: File
  tipoTreino?: string
  duracao?: number | null
}

/** Registra o hábito do dia (foto comprimida antes); devolve os pontos ganhos (0 se já tinha). */
export async function fazerCheckin(d: NovoCheckin): Promise<number> {
  const foto = d.arquivo ? await subirFoto('checkins', d.tipo, d.arquivo) : undefined
  const { data, error } = await supabase.rpc('fazer_checkin', {
    p_tipo: d.tipo,
    p_foto_path: foto ?? semValor,
    p_tipo_treino: d.tipoTreino ?? semValor,
    p_duracao: d.duracao ?? (semValor as unknown as number),
  })
  if (error) throw error
  return data?.[0]?.pontos ?? 0
}

const ACOES_DA_SEMANA = ['sono', 'agua', 'dieta', 'treino_foto', 'venci']

/** Pontos dos hábitos do quadro desde a segunda-feira (só os dela). */
export async function pontosDaSemana(desde: string): Promise<number> {
  const { data: u } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('lancamentos_pontos')
    .select('pontos')
    .eq('perfil_id', u.user?.id ?? '')
    .gte('dia', desde)
    .in('acao', ACOES_DA_SEMANA)
  if (error) throw error
  return (data ?? []).reduce((s, l) => s + l.pontos, 0)
}

export type AguaHoje = { total: number; meta: number }

/** Água de hoje (soma dos copos dela) e a meta diária em ml definida pela equipe. */
export async function buscarAguaHoje(hoje: string): Promise<AguaHoje> {
  const { data: u } = await supabase.auth.getUser()
  const [copos, config] = await Promise.all([
    supabase
      .from('agua_registros')
      .select('ml')
      .eq('perfil_id', u.user?.id ?? '')
      .eq('dia', hoje),
    supabase.from('configuracoes').select('agua_meta_ml').single(),
  ])
  if (copos.error) throw copos.error
  return {
    total: (copos.data ?? []).reduce((s, c) => s + c.ml, 0),
    meta: config.data?.agua_meta_ml ?? 2000,
  }
}

/** Soma um copo (ml positivo) ou desfaz o último (ml negativo); bater a meta dá os pontos de Água. */
export async function registrarAgua(
  ml: number,
): Promise<{ total: number; meta: number; pontos: number }> {
  const { data, error } = await supabase.rpc('registrar_agua', { p_ml: ml })
  if (error) throw error
  const r = data?.[0]
  return { total: r?.total ?? 0, meta: r?.meta ?? 2000, pontos: r?.pontos ?? 0 }
}

export type AcaoDePontos = {
  acao: string
  nome: string
  pontos: number
  limite_tipo: string
  limite_qtd: number | null
  feitas_hoje: number
  pontos_hoje: number
  propria: boolean
}

/** Tudo que dá ponto (regras ligadas no painel) e o que ela já fez hoje. */
export async function meusPontosDoDia(): Promise<AcaoDePontos[]> {
  const { data, error } = await supabase.rpc('meus_pontos_do_dia')
  if (error) throw error
  return data ?? []
}

/** Guarda a inscrição deste aparelho para os lembretes de água. */
export async function salvarInscricao(i: {
  endpoint: string
  p256dh: string
  auth: string
}): Promise<void> {
  const { error } = await supabase
    .from('push_inscricoes')
    .upsert({ ...i, lembrete_agua: true }, { onConflict: 'endpoint' })
  if (error) throw error
}

export async function removerInscricao(endpoint: string): Promise<void> {
  const { error } = await supabase.from('push_inscricoes').delete().eq('endpoint', endpoint)
  if (error) throw error
}

export type PreferenciasPush = { lembrete_agua: boolean; lembrete_live: boolean }

/** O que este aparelho recebe (null se ele ainda não ativou as notificações). */
export async function preferenciasPush(endpoint: string): Promise<PreferenciasPush | null> {
  const { data, error } = await supabase
    .from('push_inscricoes')
    .select('lembrete_agua, lembrete_live')
    .eq('endpoint', endpoint)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function salvarPreferenciasPush(
  d: { endpoint: string } & Partial<PreferenciasPush>,
): Promise<void> {
  const { endpoint, ...campos } = d
  const { error } = await supabase.from('push_inscricoes').update(campos).eq('endpoint', endpoint)
  if (error) throw error
}
