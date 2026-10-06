import { useState } from 'react'
import { BotaoBrilho, Janela } from '@/components/ui'
import { textos } from '../textos'

type Props = {
  nome: string
  aoConfirmar: () => Promise<void>
  aoFechar: () => void
  erroDe?: (e: unknown) => string
}

/** Confirmação de remover, com o erro do banco quando houver (ex.: em uso). */
export function Confirmar({ nome, aoConfirmar, aoFechar, erroDe }: Props) {
  const [ocupado, setOcupado] = useState(false)
  const [erro, setErro] = useState('')
  const confirmar = async () => {
    setOcupado(true)
    try {
      await aoConfirmar()
      aoFechar()
    } catch (e) {
      setErro(erroDe?.(e) ?? textos.erro)
      setOcupado(false)
    }
  }
  return (
    <Janela
      titulo={textos.confirmarRemover}
      aoFechar={aoFechar}
      rotuloFechar={textos.fechar}
      rodape={
        <>
          <BotaoBrilho tom="cinza" onClick={aoFechar}>
            {textos.cancelar}
          </BotaoBrilho>
          <BotaoBrilho tom="coral" disabled={ocupado} onClick={confirmar}>
            {textos.remover}
          </BotaoBrilho>
        </>
      }
    >
      <p className="text-[15px] font-bold text-tinta">{nome}</p>
      {erro && (
        <p role="alert" className="mt-3 text-sm text-terracota-escuro">
          {erro}
        </p>
      )}
    </Janela>
  )
}
