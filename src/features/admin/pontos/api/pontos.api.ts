import { supabase } from '@/lib/supabase'
import type { Tables } from '@/types/database'
import { ok } from '../../api/conteudo.api'

export type Regra = Tables<'regras_pontos'>
type Pessoa = { nome: string; apelido: string | null }
export type Lancamento = Tables<'lancamentos_pontos'> & { perfis: Pessoa | null }
export type Foto = Tables<'checkins'> & {
  perfis: Pessoa | null
  denuncias_checkin: { perfil_id: string }[]
  url?: string
}
export type Indicacao = Tables<'indicacoes'> & {
  indicadora: (Pessoa & { codigo_indicacao: string }) | null
  indicada: { nome: string } | null
}

export async function resumoPontos() {
  const linhas = ok(await supabase.rpc('painel_pontos'))
  return linhas[0] ?? { pontos_mes: 0, checkins_hoje: 0, indicacoes_mes: 0, fotos_denunciadas: 0 }
}

export async function listarRegras(): Promise<Regra[]> {
  return ok(await supabase.from('regras_pontos').select('*').order('ordem'))
}

export type DadosRegra = Pick<Regra, 'acao' | 'pontos' | 'limite_tipo' | 'limite_qtd' | 'ativo'> & {
  nome?: string
}

/** Só os campos que o banco deixa mudar (pontos, limite, ligada e nome). */
export async function salvarRegra(r: DadosRegra) {
  const { acao, pontos, limite_tipo, limite_qtd, ativo, nome } = r
  const campos = { pontos, limite_tipo, limite_qtd, ativo, ...(nome ? { nome } : {}) }
  ok(await supabase.from('regras_pontos').update(campos).eq('acao', acao))
}

/** Ação criada pelas profissionais; o banco gera o código (extra_...). */
export async function criarAcao(r: Omit<DadosRegra, 'acao' | 'ativo'> & { nome: string }) {
  return ok(
    await supabase.rpc('criar_acao', {
      p_nome: r.nome,
      p_pontos: r.pontos,
      p_limite_tipo: r.limite_tipo,
      p_limite_qtd: r.limite_qtd,
    }),
  )
}

/** Dá os pontos de uma ação própria às alunas marcadas; volta quantas receberam. */
export async function darPontosAcao(d: { acao: string; perfis: string[] }) {
  return ok(await supabase.rpc('dar_pontos_acao', { p_acao: d.acao, p_perfis: d.perfis }))
}

export type FiltroHistorico = {
  perfil: string
  acao: string
  mes: string
  pagina: number
  tamanho: number
}

/** Mês AAAA-MM vira o intervalo de dias [início, início do mês seguinte). */
export function intervaloDoMes(mes: string): [string, string] {
  const [a = 0, m = 1] = mes.split('-').map(Number)
  const proximo = m === 12 ? `${a + 1}-01` : `${a}-${String(m + 1).padStart(2, '0')}`
  return [`${mes}-01`, `${proximo}-01`]
}

export async function listarLancamentos(
  f: FiltroHistorico,
): Promise<{ lista: Lancamento[]; total: number }> {
  let q = supabase
    .from('lancamentos_pontos')
    .select('*, perfis!lancamentos_pontos_perfil_id_fkey(nome, apelido)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((f.pagina - 1) * f.tamanho, f.pagina * f.tamanho - 1)
  if (f.perfil) q = q.eq('perfil_id', f.perfil)
  if (f.acao) q = q.eq('acao', f.acao)
  if (f.mes) {
    const [de, ate] = intervaloDoMes(f.mes)
    q = q.gte('dia', de).lt('dia', ate)
  }
  const { data, error, count } = await q
  if (error) throw error
  return { lista: (data ?? []) as Lancamento[], total: count ?? 0 }
}

export async function listarAlunasSimples(): Promise<
  { id: string; nome: string; apelido: string | null }[]
> {
  return ok(
    await supabase.from('perfis').select('id, nome, apelido').eq('papel', 'aluna').order('nome'),
  )
}

export async function lancarAjuste(d: { perfil: string; pontos: number; motivo: string }) {
  return ok(
    await supabase.rpc('lancar_ajuste', {
      p_perfil: d.perfil,
      p_pontos: d.pontos,
      p_motivo: d.motivo,
    }),
  )
}

/** Fotos de check-in (as 60 mais recentes) com link assinado, já que o espaço é privado. */
export async function listarFotos(): Promise<Foto[]> {
  const linhas = ok(
    await supabase
      .from('checkins')
      .select('*, perfis!checkins_perfil_id_fkey(nome, apelido), denuncias_checkin(perfil_id)')
      .not('foto_path', 'is', null)
      .order('created_at', { ascending: false })
      .limit(60),
  ) as Foto[]
  if (linhas.length === 0) return []
  const { data } = await supabase.storage.from('checkins').createSignedUrls(
    linhas.map((l) => l.foto_path ?? ''),
    3600,
  )
  return linhas.map((l, i) => ({ ...l, url: data?.[i]?.signedUrl ?? undefined }))
}

export async function invalidarFoto(d: { id: string; motivo: string }) {
  return ok(await supabase.rpc('invalidar_checkin', { p_checkin: d.id, p_motivo: d.motivo }))
}

export async function listarIndicacoes(): Promise<Indicacao[]> {
  return ok(
    await supabase
      .from('indicacoes')
      .select(
        '*, indicadora:perfis!indicacoes_indicadora_id_fkey(nome, apelido, codigo_indicacao), indicada:perfis!indicacoes_indicada_id_fkey(nome)',
      )
      .order('created_at', { ascending: false }),
  ) as Indicacao[]
}

export async function codigoIndicacao(perfil: string): Promise<string> {
  const linha: { codigo_indicacao: string } = ok(
    await supabase.from('perfis').select('codigo_indicacao').eq('id', perfil).single(),
  )
  return linha.codigo_indicacao
}
