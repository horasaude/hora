import { VideoFundo } from '@/components/shared/VideoFundo'
import { DESCONTO_OFERTA_CENTAVOS } from '@/domain/precos'
import { formatarPreco } from '@/lib/moeda'
import { textos } from '../textos'

const t = textos.banner

/** Topo do checkout com o mesmo vídeo da página de vendas passando atrás. */
export function Banner({ emOferta }: { emOferta: boolean }) {
  return (
    <div className="relative isolate overflow-hidden rounded-[1.75rem] bg-ora px-6 py-12 text-center text-creme text-shadow-md sm:py-14">
      <VideoFundo className="absolute inset-0 -z-20 h-full w-full object-cover" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-tinta/40" />
      <img
        src="/logo-ora.png"
        alt="ORA"
        width={482}
        height={189}
        className="entrada mx-auto h-8 w-auto brightness-0 invert"
      />
      <p className="entrada mt-4 text-[0.7rem] font-medium tracking-[0.24em] text-creme/80 uppercase italic">
        {t.etiqueta}
      </p>
      <p className="entrada font-titulo text-6xl leading-none sm:text-7xl">{t.nome}</p>
      <p className="entrada-2 mx-auto mt-3 max-w-md text-sm text-creme/90">{t.frase}</p>
      {emOferta && (
        <p className="entrada-3 mt-5 inline-block rounded-full bg-creme px-4 py-1.5 text-xs font-semibold tracking-[0.12em] text-ora uppercase text-shadow-none">
          {textos.oferta(formatarPreco(DESCONTO_OFERTA_CENTAVOS))}
        </p>
      )}
    </div>
  )
}
