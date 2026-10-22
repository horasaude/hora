import { useState } from 'react'
import { excluir as tx } from '../textos/excluir'

/** Excluir na linha da lista, pílula coral igual à de Publicado · Tirar do ar: o primeiro toque pede confirmação, o segundo apaga. */
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
        className="brilho brilho-coral inline-flex min-h-7 items-center rounded-full px-3 text-[11px] font-bold whitespace-nowrap disabled:opacity-50"
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
