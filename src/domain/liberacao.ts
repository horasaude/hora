// Liberação de tema e aula pelas profissionais: disponível agora, em breve (cadeado) ou numa data e hora.
// Quem decide o que a aluna vê é o banco (public.fechado); aqui o painel só monta e lê o estado.

export type ModoLiberacao = 'aberta' | 'breve' | 'data'
export type Liberacao = { bloqueado: boolean; libera_em: string | null }

/** Como o item está agora: data já passada conta como disponível. */
export function modoDe(l: Liberacao, agora = new Date()): ModoLiberacao {
  if (l.bloqueado) return 'breve'
  if (l.libera_em && new Date(l.libera_em) > agora) return 'data'
  return 'aberta'
}

/** Colunas do banco para o modo escolhido no painel. */
export function liberacaoPara(modo: ModoLiberacao, quando: Date | null): Liberacao {
  if (modo === 'breve') return { bloqueado: true, libera_em: null }
  if (modo === 'data' && quando) return { bloqueado: false, libera_em: quando.toISOString() }
  return { bloqueado: false, libera_em: null }
}
