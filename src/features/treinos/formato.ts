import type { TreinoResumo } from './api/treinos.api'
import { textos } from './textos'

/** "40 min · 6 exercícios". */
export const detalhe = (x: TreinoResumo) =>
  [x.duracao_minutos ? textos.minutos(x.duracao_minutos) : null, textos.exercicios(x.qtd)]
    .filter(Boolean)
    .join(' · ')
