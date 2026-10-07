import { EtiquetaBrilho } from '@/components/ui'
import { percentualDesconto } from '@/domain/loja'
import { formatarPreco } from '@/lib/moeda'
import { textos as t } from '../textos'

/** Preço antigo riscado, preço com desconto em destaque e a etiqueta dourada com o %. */
export function Precos({
  cheio,
  final,
  grande = false,
}: {
  cheio: number
  final: number
  grande?: boolean
}) {
  const pct = percentualDesconto(cheio, final)
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
      {pct > 0 && (
        <span className={`text-suave line-through ${grande ? 'text-base' : 'text-[13px]'}`}>
          <span className="sr-only">{t.de} </span>
          {formatarPreco(cheio)}
        </span>
      )}
      <span className={`font-bold text-verde-escuro ${grande ? 'text-[28px]' : 'text-lg'}`}>
        <span className="sr-only">{t.por} </span>
        {formatarPreco(final)}
      </span>
      {pct > 0 && <EtiquetaBrilho tom="dourado">{t.desconto(pct)}</EtiquetaBrilho>}
    </div>
  )
}
