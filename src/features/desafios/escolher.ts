import { desafioEmAndamento } from '@/domain/engajamento'
import type { Desafio } from './api/desafios.api'

/** O desafio em andamento de que ela participa; senão, o do tema dela (ou o geral do mês) para entrar. */
export function escolher(lista: Desafio[], hoje: string, temaId: string | null) {
  const aberto = (x: Desafio) => !x.participando && desafioEmAndamento(x, hoje)
  return (
    lista.find((x) => x.participando && desafioEmAndamento(x, hoje)) ??
    lista.find((x) => aberto(x) && temaId !== null && x.tema_id === temaId) ??
    lista.find((x) => aberto(x) && x.tema_id === null)
  )
}
