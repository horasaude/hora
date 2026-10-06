import type { Cardapio } from './api/modulos.api'

export const REFEICOES = [
  'cafe',
  'lanche_manha',
  'almoco',
  'lanche_tarde',
  'jantar',
  'ceia',
] as const

/** Quantas das 6 refeições do cardápio estão preenchidas. */
export const refeicoesPreenchidas = (c: Cardapio) => REFEICOES.filter((r) => c[r].trim()).length
