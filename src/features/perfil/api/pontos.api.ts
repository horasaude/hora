import { supabase } from '@/lib/supabase'

export type Indicacao = {
  id: string
  indicada_nome: string
  status: 'aguardando' | 'confirmada' | 'cancelada'
  created_at: string
  pontos: number
}

/** Indicações dela com os pontos ganhos (confirmada) ou o valor da regra (aguardando). */
export async function buscarIndicacoes(): Promise<{ lista: Indicacao[]; pontosRegra: number }> {
  const [ind, lanc, regra] = await Promise.all([
    supabase
      .from('indicacoes')
      .select('id, indicada_nome, status, created_at')
      .order('created_at', { ascending: false }),
    supabase.from('lancamentos_pontos').select('referencia, pontos').eq('acao', 'indicacao'),
    supabase.from('regras_pontos').select('pontos').eq('acao', 'indicacao').maybeSingle(),
  ])
  if (ind.error) throw ind.error
  const ganhos = new Map((lanc.data ?? []).map((l) => [l.referencia, l.pontos]))
  const pontosRegra = regra.data?.pontos ?? 0
  const lista = (ind.data ?? []).map((i) => ({
    ...i,
    status: i.status as Indicacao['status'],
    pontos:
      i.status === 'confirmada'
        ? (ganhos.get(i.id) ?? 0)
        : i.status === 'aguardando'
          ? pontosRegra
          : 0,
  }))
  return { lista, pontosRegra }
}

export type Lancamento = {
  id: string
  acao: string
  pontos: number
  motivo: string | null
  dia: string
  nome: string | null
}

/** Uma página do histórico de pontos dela, do mais novo ao mais antigo, com o nome da regra. */
export async function buscarHistorico(pagina: number, tamanho: number) {
  const de = (pagina - 1) * tamanho
  const [lanc, regras] = await Promise.all([
    supabase
      .from('lancamentos_pontos')
      .select('id, acao, pontos, motivo, dia', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(de, de + tamanho - 1),
    supabase.from('regras_pontos').select('acao, nome'),
  ])
  if (lanc.error) throw lanc.error
  const nomes = new Map((regras.data ?? []).map((r) => [r.acao, r.nome]))
  const linhas: Lancamento[] = (lanc.data ?? []).map((l) => ({
    ...l,
    nome: nomes.get(l.acao) ?? null,
  }))
  return { linhas, total: lanc.count ?? 0 }
}
