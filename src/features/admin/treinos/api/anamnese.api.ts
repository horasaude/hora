import { supabase } from '@/lib/supabase'
import { lerPerguntas, lerRespostas, type Pergunta, type Respostas } from '@/domain/anamnese'
import { ok } from '../../api/conteudo.api'

/** Treino (Laís), nutrição (Ana) ou saúde (Dra. Clara): cada área tem as suas anamneses no painel. */
export type AreaAnamnese = 'treino' | 'nutricao' | 'saude'

export type Anamnese = {
  id: string
  area: string
  titulo: string
  descricao: string
  perguntas: Pergunta[]
  publicada: boolean
  enviadas: number
}

export async function listarAnamneses(area: AreaAnamnese): Promise<Anamnese[]> {
  const linhas = ok(
    await supabase
      .from('anamneses')
      .select('id, area, titulo, descricao, perguntas, publicada, anamnese_respostas(enviada_em)')
      .eq('area', area)
      .order('created_at'),
  ) as (Omit<Anamnese, 'perguntas' | 'enviadas'> & {
    perguntas: unknown
    anamnese_respostas: { enviada_em: string | null }[]
  })[]
  return linhas.map(({ anamnese_respostas, ...a }) => ({
    ...a,
    perguntas: lerPerguntas(a.perguntas),
    enviadas: anamnese_respostas.filter((r) => r.enviada_em).length,
  }))
}

export async function salvarAnamnese(d: Omit<Anamnese, 'enviadas' | 'id'> & { id?: string }) {
  const { id, area, titulo, descricao, perguntas, publicada } = d
  const campos = { area, titulo, descricao, perguntas, publicada }
  ok(
    id
      ? await supabase.from('anamneses').update(campos).eq('id', id)
      : await supabase.from('anamneses').insert(campos),
  )
}

export async function removerAnamnese(id: string): Promise<void> {
  ok(await supabase.from('anamneses').delete().eq('id', id))
}

export type RespostaDaAluna = {
  anamnese_id: string
  titulo: string
  perguntas: Pergunta[]
  respostas: Respostas
  enviada_em: string | null
}

/** Anamneses que a aluna respondeu (ou começou), para o cartão dela em Alunas. */
export async function respostasDaAluna(perfil: string): Promise<RespostaDaAluna[]> {
  const linhas = ok(
    await supabase
      .from('anamnese_respostas')
      .select('anamnese_id, respostas, enviada_em, anamneses(titulo, perguntas)')
      .eq('perfil_id', perfil),
  ) as {
    anamnese_id: string
    respostas: unknown
    enviada_em: string | null
    anamneses: { titulo: string; perguntas: unknown } | null
  }[]
  return linhas.map((r) => ({
    anamnese_id: r.anamnese_id,
    titulo: r.anamneses?.titulo ?? '',
    perguntas: lerPerguntas(r.anamneses?.perguntas),
    respostas: lerRespostas(r.respostas),
    enviada_em: r.enviada_em,
  }))
}

/** Apaga a resposta para a aluna responder de novo. */
export async function pedirDeNovo(d: { anamnese: string; perfil: string }): Promise<void> {
  ok(
    await supabase
      .from('anamnese_respostas')
      .delete()
      .eq('anamnese_id', d.anamnese)
      .eq('perfil_id', d.perfil),
  )
}
