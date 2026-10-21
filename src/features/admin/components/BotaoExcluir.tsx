import { useState } from 'react'
import { BotaoBrilho } from '@/components/ui'

type Props = {
  rotulo: string
  confirmar: string
  excluindo: string
  aoExcluir: () => Promise<unknown>
  /** Mensagem para cada erro (volta null para a mensagem padrão). */
  mensagemDe: (erro: unknown) => string
  className?: string
}

/** Excluir em dois toques: o primeiro pede a confirmação; erro aparece logo abaixo. */
export function BotaoExcluir({
  rotulo,
  confirmar,
  excluindo,
  aoExcluir,
  mensagemDe,
  className,
}: Props) {
  const [etapa, setEtapa] = useState<'inicio' | 'confirmar' | 'indo'>('inicio')
  const [erro, setErro] = useState('')
  const clicar = async () => {
    if (etapa === 'inicio') return setEtapa('confirmar')
    setEtapa('indo')
    try {
      await aoExcluir()
    } catch (e) {
      setErro(mensagemDe(e))
      setEtapa('inicio')
    }
  }
  return (
    <span className={`flex flex-col gap-1 ${className ?? ''}`}>
      <BotaoBrilho tom="coral" disabled={etapa === 'indo'} onClick={clicar}>
        {etapa === 'indo' ? excluindo : etapa === 'confirmar' ? confirmar : rotulo}
      </BotaoBrilho>
      {erro && (
        <span role="alert" className="text-xs text-terracota-escuro">
          {erro}
        </span>
      )}
    </span>
  )
}
