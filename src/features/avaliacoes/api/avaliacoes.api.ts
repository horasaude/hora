import { supabase } from '@/lib/supabase'
import { lerPerguntas, lerRespostas, type Pergunta, type Respostas } from '@/domain/anamnese'

export type Avaliacao = {
  id: string
  titulo: string
  descricao: string
  perguntas: Pergunta[]
  respostas: Respostas
  enviada_em: string | null
}

/** Anamneses publicadas com as respostas dela (a equipe também lê só as dela aqui). */
export async function listarAvaliacoes(): Promise<Avaliacao[]> {
  const { data: u } = await supabase.auth.getUser()
  const [anamneses, respostas] = await Promise.all([
    supabase
      .from('anamneses')
      .select('id, titulo, descricao, perguntas')
      .eq('publicada', true)
      .order('created_at'),
    supabase
      .from('anamnese_respostas')
      .select('anamnese_id, respostas, enviada_em')
      .eq('perfil_id', u.user?.id ?? ''),
  ])
  if (anamneses.error) throw anamneses.error
  if (respostas.error) throw respostas.error
  return anamneses.data.map((a) => {
    const r = respostas.data.find((x) => x.anamnese_id === a.id)
    return {
      ...a,
      perguntas: lerPerguntas(a.perguntas),
      respostas: lerRespostas(r?.respostas),
      enviada_em: r?.enviada_em ?? null,
    }
  })
}

/** Guarda o que já respondeu; com enviar, fecha a avaliação. */
export async function salvarRespostas(d: {
  anamnese: string
  respostas: Respostas
  enviar: boolean
}): Promise<void> {
  const { error } = await supabase.from('anamnese_respostas').upsert(
    {
      anamnese_id: d.anamnese,
      respostas: d.respostas,
      enviada_em: d.enviar ? new Date().toISOString() : null,
    },
    { onConflict: 'anamnese_id,perfil_id' },
  )
  if (error) throw error
}
