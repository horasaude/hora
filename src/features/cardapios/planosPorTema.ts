// Agrupa os planos alimentares pelo tema, na ordem dos temas da trilha.
import type { Cardapio } from './api/cardapios.api'

export type GrupoPlanos = { temaId: string | null; titulo: string | null; planos: Cardapio[] }

/** Um grupo por tema que tem plano (na ordem dada); planos sem tema ou de tema desconhecido ficam no fim. */
export function planosPorTema(
  planos: Cardapio[],
  temas: { id: string; titulo: string }[],
): GrupoPlanos[] {
  const grupos: GrupoPlanos[] = temas
    .map((t) => ({
      temaId: t.id,
      titulo: t.titulo,
      planos: planos.filter((p) => p.tema_id === t.id),
    }))
    .filter((g) => g.planos.length > 0)
  const conhecidos = new Set(temas.map((t) => t.id))
  const resto = planos.filter((p) => !p.tema_id || !conhecidos.has(p.tema_id))
  if (resto.length > 0) grupos.push({ temaId: null, titulo: null, planos: resto })
  return grupos
}
