// Regras de leitura do painel das profissionais: situação do desafio e status da aluna.

export type SituacaoDesafio = 'rascunho' | 'agendado' | 'ativo' | 'encerrado'

type Desafio = { publicado: boolean; inicio: string; fim: string; encerrado_em: string | null }

/** Situação pelo dia de hoje em Brasília (AAAA-MM-DD): encerrado à mão ou depois do fim. */
export function situacaoDesafio(d: Desafio, hoje: string): SituacaoDesafio {
  if (d.encerrado_em || hoje > d.fim) return 'encerrado'
  if (!d.publicado) return 'rascunho'
  return hoje < d.inicio ? 'agendado' : 'ativo'
}

export type StatusAluna = 'em_dia' | 'atencao' | 'sumiu' | 'sem_acesso'

type Aluna = {
  acesso_inicio_em: string | null
  acesso_fim_em: string | null
  ultimo_acesso_em: string | null
}

const DIA_MS = 86_400_000

/** Acesso valendo agora: começou e ainda não terminou. */
export function acessoAtivo(a: Aluna, agora: Date): boolean {
  if (!a.acesso_inicio_em || new Date(a.acesso_inicio_em) > agora) return false
  return !a.acesso_fim_em || agora < new Date(a.acesso_fim_em)
}

/** Em dia; Atenção com 3 dias sem entrar; Sumiu com 7 ou mais. Sem entrada ainda, conta do início do acesso. */
export function statusAluna(a: Aluna, agora: Date): StatusAluna {
  if (!acessoAtivo(a, agora)) return 'sem_acesso'
  const referencia = new Date(a.ultimo_acesso_em ?? a.acesso_inicio_em ?? agora)
  const dias = Math.floor((agora.getTime() - referencia.getTime()) / DIA_MS)
  if (dias >= 7) return 'sumiu'
  if (dias >= 3) return 'atencao'
  return 'em_dia'
}

export type ProgressoDesafio = { dia: number; total: number; faltam: number; pct: number }

/** Em que dia do desafio estamos (hoje em AAAA-MM-DD), quantos faltam e a porcentagem do período. */
export function progressoDesafio(
  d: Pick<Desafio, 'inicio' | 'fim'>,
  hoje: string,
): ProgressoDesafio {
  const dias = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / DIA_MS)
  const total = dias(d.inicio, d.fim) + 1
  const dia = Math.min(Math.max(dias(d.inicio, hoje) + 1, 0), total)
  return { dia, total, faltam: total - dia, pct: Math.round((dia / total) * 100) }
}
