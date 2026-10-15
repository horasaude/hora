// Apelido do ranking: o que ela digita vira um apelido válido sempre que der.

/** Tira espaços das pontas e o @ do começo; espaço no meio vira ponto ("Laís Moraes" vira "Laís.Moraes"). */
export function normalizarApelido(valor: string): string {
  return valor.trim().replace(/^@+/, '').replace(/\s+/g, '.')
}

export const APELIDO_VALIDO = /^[\p{L}\p{N}._-]+$/u
