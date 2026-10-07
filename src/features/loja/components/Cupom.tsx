import { useState } from 'react'
import { textos as t } from '../textos'

/** Cupom num campo com Copiar cupom; mostra Copiado! ao tocar. */
export function Cupom({ codigo }: { codigo: string }) {
  const [copiado, setCopiado] = useState(false)
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(codigo)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2500)
    } catch {
      setCopiado(false)
    }
  }
  return (
    <div className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium">{t.cupom}</span>
      <div className="flex items-center gap-2 rounded-full border border-dashed border-[#D9B56A] bg-[#FBF5E8] p-1.5 pl-5">
        <input
          readOnly
          aria-label={t.cupom}
          value={codigo}
          onFocus={(e) => e.target.select()}
          className="min-w-0 flex-1 bg-transparent text-base font-bold tracking-[0.12em] text-tinta focus:outline-none"
        />
        <button
          type="button"
          onClick={copiar}
          aria-live="polite"
          className={`min-h-9 shrink-0 rounded-full px-4 text-[13px] font-bold ${copiado ? 'brilho brilho-verde' : 'brilho brilho-dourado'}`}
        >
          {copiado ? t.copiado : t.copiar}
        </button>
      </div>
    </div>
  )
}
