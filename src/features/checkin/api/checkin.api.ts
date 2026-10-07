import { subirFoto } from '@/lib/fotos'
import { supabase, semValor } from '@/lib/supabase'
import type { Habito } from '../textos'

export type MeusCheckins = { hoje: Habito[]; dias: string[] }

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
