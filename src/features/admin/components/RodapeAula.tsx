import type { ReactNode } from 'react'
import { BotaoBrilho } from '@/components/ui'
import { textos } from '../textos'

type Props = {
  /** Na aula já salva, o Excluir fica à esquerda. */
  excluir?: ReactNode
  salvando: boolean
  aoCancelar: () => void
  aoRascunho: () => void
  aoPublicar: () => void
}

/** Rodapé da janela da aula: Cancelar, Salvar rascunho e Publicar (verde). */
export function RodapeAula({ excluir, salvando, aoCancelar, aoRascunho, aoPublicar }: Props) {
  return (
    <>
      {excluir && <span className="mr-auto">{excluir}</span>}
      <BotaoBrilho tom="cinza" onClick={aoCancelar}>
        {textos.cancelar}
      </BotaoBrilho>
      <BotaoBrilho onClick={aoRascunho} disabled={salvando}>
        {salvando ? textos.salvando : textos.conteudo.salvarRascunho}
      </BotaoBrilho>
      <BotaoBrilho tom="verde" onClick={aoPublicar} disabled={salvando}>
        {textos.conteudo.publicar}
      </BotaoBrilho>
    </>
  )
}
