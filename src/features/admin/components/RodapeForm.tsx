import { BotaoBrilho } from '@/components/ui'
import { textos } from '../textos'

type Props = { formId: string; salvando: boolean; aoCancelar: () => void }

/** Rodapé fixo da janela: Cancelar e Salvar (o Salvar envia o formulário pelo id). */
export function RodapeForm({ formId, salvando, aoCancelar }: Props) {
  return (
    <>
      <BotaoBrilho tom="cinza" onClick={aoCancelar}>
        {textos.cancelar}
      </BotaoBrilho>
      <BotaoBrilho type="submit" form={formId} disabled={salvando}>
        {salvando ? textos.salvando : textos.salvar}
      </BotaoBrilho>
    </>
  )
}

/** Erro geral do formulário, ocupando a largura toda. */
export function ErroForm({ mensagem }: { mensagem?: string }) {
  if (!mensagem) return null
  return (
    <p role="alert" className="text-sm text-terracota-escuro sm:col-span-2">
      {mensagem}
    </p>
  )
}
