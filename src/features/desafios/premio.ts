import type { Desafio } from './api/desafios.api'
import { textos } from './textos'

/** Texto do prêmio: o que as profissionais escreveram e, se marcado, a caixa surpresa. */
export function textoPremio(d: Pick<Desafio, 'premio' | 'premio_surpresa'>) {
  return [d.premio, d.premio_surpresa ? textos.surpresa : ''].filter(Boolean).join(' · ')
}
