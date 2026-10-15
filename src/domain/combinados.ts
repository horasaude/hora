// Exercícios combinados (bi-set, como no MFIT): vizinhos com o mesmo número se alternam (A, B, C).

type ComGrupo = { combinado: number | null }

/** Letra do exercício dentro da combinação (A, B...) ou null quando está sozinho. */
export function letraCombinado(itens: ComGrupo[], i: number): string | null {
  const g = itens[i]?.combinado
  if (!g) return null
  let inicio = i
  while (inicio > 0 && itens[inicio - 1]?.combinado === g) inicio--
  return String.fromCharCode(65 + i - inicio)
}

/** Índices dos outros exercícios da mesma combinação. */
export function parceiros(itens: ComGrupo[], i: number): number[] {
  const g = itens[i]?.combinado
  if (!g) return []
  const juntos: number[] = []
  for (let j = i - 1; j >= 0 && itens[j]?.combinado === g; j--) juntos.unshift(j)
  for (let j = i + 1; j < itens.length && itens[j]?.combinado === g; j++) juntos.push(j)
  return juntos
}

/** Junta o exercício com o próximo (entra na combinação que já existir). */
export function combinarComProximo<T extends ComGrupo>(itens: T[], i: number): T[] {
  if (i >= itens.length - 1) return itens
  const usados = itens.map((x) => x.combinado ?? 0)
  const g = itens[i]?.combinado ?? itens[i + 1]?.combinado ?? Math.max(0, ...usados) + 1
  const outro = itens[i + 1]?.combinado
  return itens.map((x, j) =>
    j === i || j === i + 1 || (outro && x.combinado === outro) ? { ...x, combinado: g } : x,
  )
}

/** Tira da combinação; se sobrar um só, ele também volta a ficar sozinho. */
export function separar<T extends ComGrupo>(itens: T[], i: number): T[] {
  const sobra = parceiros(itens, i)
  const solto = itens.map((x, j) => (j === i ? { ...x, combinado: null } : x))
  return sobra.length === 1
    ? solto.map((x, j) => (j === sobra[0] ? { ...x, combinado: null } : x))
    : solto
}
