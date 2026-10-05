import { formatarPreco } from '@/lib/moeda'
import { usePrecos } from '../hooks/usePrecos'
import { textos } from '../textos'
import { BotaoCompra } from './BotaoCompra'
import { Secao } from './Secao'

const t = textos.preco

/** Preço ancorado. Na oferta mostra o cheio riscado; depois de FIM_OFERTA_ORA troca sozinho. */
export function Preco() {
  const p = usePrecos()
  return (
    <Secao id="preco" etiqueta={t.etiqueta} titulo={t.titulo}>
      <div className="rounded-[2rem] border border-ora/25 bg-white p-6 sm:p-12">
        {p.ancoraCentavos !== null && (
          <p className="text-lg font-light text-suave">
            {t.de} <s>{formatarPreco(p.ancoraCentavos)}</s>
          </p>
        )}
        <p className="mt-2 leading-none text-ora">
          <span className="text-3xl font-light">{t.vezes(p.parcelas)} </span>
          <span className="font-titulo text-[5.5rem] sm:text-9xl">
            {formatarPreco(p.parceladoCentavos)}
          </span>
        </p>
        <p className="mt-3 text-sm font-light text-suave italic">{t.parcelado}</p>
        <div className="mt-8 border-t border-linha pt-6">
          <p className="text-xl font-medium text-tinta">{t.pix(formatarPreco(p.pixCentavos))}</p>
          <p className="mt-1 font-light text-tinta">
            {t.recorrente(p.parcelas, formatarPreco(p.recorrenteCentavos))}
          </p>
        </div>
        <p className="mt-8 inline-block rounded-full bg-creme px-4 py-1.5 text-[0.7rem] font-semibold tracking-[0.18em] text-ora uppercase">
          {t.acesso(p.mesesAcesso)}
        </p>
        <div className="mt-10">
          <BotaoCompra>{t.botao}</BotaoCompra>
        </div>
      </div>
    </Secao>
  )
}
