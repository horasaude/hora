import { BotaoBrilho } from '@/components/ui'
import { textos } from '../textos'

type Props = {
  salvando: boolean
  aoCancelar: () => void
  aoRascunho: () => void
  aoPublicar: () => void
}

/** Rodapé da janela da aula: Cancelar, Salvar rascunho e Publicar (verde). */
export function RodapeAula({ salvando, aoCancelar, aoRascunho, aoPublicar }: Props) {
  return (
    <>
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
