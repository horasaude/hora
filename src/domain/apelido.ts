// Apelido do ranking: o que ela digita vira um apelido válido sempre que der.

/** Tira espaços das pontas e o @ do começo; espaço no meio vira ponto ("Laís Moraes" vira "Laís.Moraes"). */
export function normalizarApelido(valor: string): string {
  return valor.trim().replace(/^@+/, '').replace(/\s+/g, '.')
}

export const APELIDO_VALIDO = /^[\p{L}\p{N}._-]+$/u

/** O banco recusou porque outra aluna já usa esse apelido (índice único). */
export const apelidoEmUso = (erro: unknown) =>
  typeof erro === 'object' && erro !== null && (erro as { code?: string }).code === '23505'
