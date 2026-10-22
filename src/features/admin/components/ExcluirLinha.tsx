import { useState } from 'react'
import { excluir as tx } from '../textos/excluir'

/** Excluir pequeno, na linha da lista: o primeiro toque pede confirmação, o segundo apaga. */
export function ExcluirLinha({ aoExcluir }: { aoExcluir: () => Promise<unknown> }) {
  const [etapa, setEtapa] = useState<'inicio' | 'confirmar' | 'indo'>('inicio')
  const [erro, setErro] = useState(false)
  const clicar = async () => {
    if (etapa === 'inicio') return setEtapa('confirmar')
    setEtapa('indo')
    try {
      await aoExcluir()
    } catch {
      setErro(true)
      setEtapa('inicio')
    }
  }
  return (
    <span className="flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={clicar}
        onBlur={() => etapa === 'confirmar' && setEtapa('inicio')}
        disabled={etapa === 'indo'}
        className={`inline-flex min-h-7 items-center rounded-full px-3 text-[11px] font-bold whitespace-nowrap disabled:opacity-50 ${etapa === 'inicio' ? 'text-terracota-escuro underline underline-offset-2' : 'brilho brilho-coral'}`}
      >
        {etapa === 'indo' ? tx.excluindo : etapa === 'confirmar' ? tx.confirmarLinha : tx.curto}
      </button>
      {erro && (
        <span role="alert" className="text-xs text-terracota-escuro">
          {tx.erro}
        </span>
      )}
    </span>
  )
}
