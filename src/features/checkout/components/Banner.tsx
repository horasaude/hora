import { DESCONTO_OFERTA_CENTAVOS } from '@/domain/precos'
import { formatarPreco } from '@/lib/moeda'
import { textos } from '../textos'

const t = textos.banner

/** Topo do checkout no estilo das lâminas do ORA: creme, "A" de marca d'água, nome do programa. */
export function Banner({ emOferta }: { emOferta: boolean }) {
  return (
    <div className="relative isolate overflow-hidden rounded-[1.75rem] border border-ora/10 bg-white px-6 py-7 text-center sm:py-9">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -right-8 -z-10 font-titulo text-[18rem] leading-none text-salvia/[0.12] select-none"
      >
        A
      </span>
      <img src="/logo-ora.png" alt="ORA" width={482} height={189} className="mx-auto h-8 w-auto" />
      <p className="mt-4 text-[0.7rem] font-medium tracking-[0.24em] text-suave uppercase italic">
        {t.etiqueta}
      </p>
      <p className="font-titulo text-6xl leading-none text-ora sm:text-7xl">{t.nome}</p>
      <p className="mx-auto mt-3 max-w-md text-sm text-tinta">{t.frase}</p>
      {emOferta && (
        <p className="mt-5 inline-block rounded-full bg-ora px-4 py-1.5 text-xs font-semibold tracking-[0.14em] text-creme uppercase">
          {textos.oferta(formatarPreco(DESCONTO_OFERTA_CENTAVOS))}
        </p>
      )}
    </div>
  )
}
