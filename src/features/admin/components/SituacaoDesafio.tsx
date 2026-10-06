import type { SituacaoDesafio } from '@/domain/painel'
import { textos } from '../textos'
import { Etiqueta } from './Tabela'

const TOM = { rascunho: 'ocre', agendado: 'neutro', ativo: 'verde', encerrado: 'neutro' } as const

/** Etiqueta da situação do desafio. */
export function EtiquetaDesafio({ situacao }: { situacao: SituacaoDesafio }) {
  return <Etiqueta tom={TOM[situacao]}>{textos.desafios.situacao[situacao]}</Etiqueta>
}
