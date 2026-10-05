import { DESCONTO_OFERTA_CENTAVOS, tempoRestanteOferta } from '@/domain/precos'
import { formatarPreco } from '@/lib/moeda'
import { useAgora } from '../hooks/useAgora'
import { textos } from '../textos'

const t = textos.preco.oferta
const dois = (n: number) => String(n).padStart(2, '0')

/** Aviso da oferta do ORA com contagem, dentro da seção de preço. Some quando a oferta acaba. */
export function ContagemOferta() {
  const tempo = tempoRestanteOferta(useAgora())
  if (!tempo) return null
  const partes = [
    [tempo.dias, t.unidades.dias],
    [tempo.horas, t.unidades.horas],
    [tempo.minutos, t.unidades.minutos],
    [tempo.segundos, t.unidades.segundos],
  ] as const
  return (
    <div className="rounded-[1.75rem] bg-ora px-5 py-6 text-center text-creme sm:px-8">
      <p className="text-sm font-semibold tracking-[0.18em] uppercase">
        {t.selo(formatarPreco(DESCONTO_OFERTA_CENTAVOS))}
      </p>
      <p className="mt-1 text-sm text-creme/85">{t.prazo}</p>
      <div role="timer" aria-live="off" className="mx-auto mt-4 grid max-w-sm grid-cols-4 gap-2">
        {partes.map(([valor, unidade]) => (
          <div key={unidade} className="rounded-2xl bg-creme/10 py-2">
            <p className="text-3xl leading-none font-semibold tabular-nums">{dois(valor)}</p>
            <p className="mt-1 text-[0.65rem] tracking-[0.14em] text-creme/75 uppercase">
              {unidade}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-creme/75 italic">{t.depois}</p>
    </div>
  )
}
