import type { Convidada } from '../api/agenda.api'
import { esquemaConvidada } from './formularios'

/** Convidada preenchida pela metade ou com e-mail inválido (linha toda vazia é ignorada). */
export const convidadaInvalida = (c: Convidada) =>
  Boolean(c.nome.trim() || c.email.trim()) && !esquemaConvidada.safeParse(c).success

/** Convidadas prontas para salvar: sem linhas vazias, e-mail limpo; null se alguma está errada. */
export function convidadasValidas(lista: Convidada[]): Convidada[] | null {
  if (lista.some(convidadaInvalida)) return null
  return lista.filter((c) => c.nome.trim() || c.email.trim()).map((c) => esquemaConvidada.parse(c))
}
