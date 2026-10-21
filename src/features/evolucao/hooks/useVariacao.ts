import type { CampoMedida, Medida } from '../api/medidas.api'
import { useMedidas } from './useMedidas'

/** Diferença entre o registro mais novo e o mais antigo de uma medida; null com menos de dois. */
export function variacao(lista: Medida[], campo: CampoMedida): number | null {
  const valores = lista.flatMap((m) => (m[campo] === null ? [] : [Number(m[campo])]))
  if (valores.length < 2) return null
  const mais = valores[0] ?? 0
  const menos = valores.at(-1) ?? 0
  return Math.round((mais - menos) * 10) / 10
}

/** Quanto o peso e a cintura mudaram desde o primeiro registro (a lista vem do mais novo ao mais antigo). */
export function useVariacao() {
  const medidas = useMedidas()
  const lista = medidas.data ?? []
  return {
    isPending: medidas.isPending,
    peso: variacao(lista, 'peso'),
    cintura: variacao(lista, 'cintura'),
  }
}
