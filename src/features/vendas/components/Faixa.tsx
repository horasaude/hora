import { DESCONTO_OFERTA_CENTAVOS, tempoRestanteOferta } from '@/domain/precos'
import { formatarPreco } from '@/lib/moeda'
import { useAgora } from '../hooks/useAgora'
import { textos } from '../textos'
import { BotaoCompra } from './BotaoCompra'

const t = textos.faixa
const dois = (n: number) => String(n).padStart(2, '0')

/** Faixa fixa da oferta do ORA com contagem. Some sozinha quando a oferta acaba. */
export function Faixa() {
  const tempo = tempoRestanteOferta(useAgora())
  if (!tempo) return null
  const u = t.unidades
  return (
    <div className="sticky top-0 z-30 bg-ora text-white">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold">
            {t.oferta(formatarPreco(DESCONTO_OFERTA_CENTAVOS))}
          </p>
          <p role="timer" aria-live="off" className="font-titulo text-lg text-ocre tabular-nums">
            {tempo.dias}
            {u.dias} {dois(tempo.horas)}
            {u.horas} {dois(tempo.minutos)}
            {u.minutos} {dois(tempo.segundos)}
            {u.segundos}
          </p>
        </div>
        <BotaoCompra compacto claro>
          {t.botao}
        </BotaoCompra>
      </div>
    </div>
  )
}
