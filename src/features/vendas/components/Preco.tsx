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
    <Secao id="preco" titulo={t.titulo} fundo="areia">
      <div className="rounded-3xl border-2 border-ora bg-white p-7 sm:p-10">
        {p.ancoraCentavos !== null && (
          <p className="text-lg text-suave">
            {t.de} <s>{formatarPreco(p.ancoraCentavos)}</s>
          </p>
        )}
        <p className="mt-2 font-titulo leading-none font-semibold text-ora">
          <span className="text-4xl">{t.vezes(p.parcelas)} </span>
          <span className="text-7xl sm:text-8xl">{formatarPreco(p.parceladoCentavos)}</span>
        </p>
        <p className="mt-2 text-suave">{t.parcelado}</p>
        <p className="mt-6 text-xl font-semibold text-tinta">
          {t.pix(formatarPreco(p.pixCentavos))}
        </p>
        <p className="mt-1 text-tinta">
          {t.recorrente(p.parcelas, formatarPreco(p.recorrenteCentavos))}
        </p>
        <p className="mt-6 inline-block rounded-full bg-areia px-4 py-1.5 text-sm font-bold text-ora">
          {t.acesso(p.mesesAcesso)}
        </p>
        <div className="mt-8">
          <BotaoCompra>{t.botao}</BotaoCompra>
        </div>
      </div>
    </Secao>
  )
}
