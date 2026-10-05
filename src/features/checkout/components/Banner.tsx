import { DESCONTO_OFERTA_CENTAVOS } from '@/domain/precos'
import { formatarPreco } from '@/lib/moeda'
import { textos } from '../textos'

/** Faixa de topo como a do Hotmart, com a foto das três e a oferta quando ela vale. */
export function Banner({ emOferta }: { emOferta: boolean }) {
  return (
    <div className="relative isolate overflow-hidden rounded-[1.75rem] bg-ora text-creme">
      <img
        src="/fotos/tres-em-pe.webp"
        alt=""
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[50%_30%]"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-tinta/60" />
      <div className="flex min-h-36 flex-col items-center justify-center gap-3 px-5 py-6 text-center sm:min-h-44">
        <img
          src="/logo-ora.png"
          alt="ORA"
          width={482}
          height={189}
          className="h-9 w-auto brightness-0 invert"
        />
        {emOferta && (
          <p className="rounded-full bg-creme px-4 py-1.5 text-xs font-semibold tracking-[0.16em] text-ora uppercase">
            {textos.oferta(formatarPreco(DESCONTO_OFERTA_CENTAVOS))}
          </p>
        )}
      </div>
    </div>
  )
}
