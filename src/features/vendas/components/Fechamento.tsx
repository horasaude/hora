import { formatarPreco } from '@/lib/moeda'
import { usePrecos } from '../hooks/usePrecos'
import { textos } from '../textos'
import { BotaoCompra } from './BotaoCompra'
import { Secao } from './Secao'

export function CtaFinal() {
  const t = textos.ctaFinal
  const p = usePrecos()
  const parcelas = `${p.parcelas}x de ${formatarPreco(p.parceladoCentavos)}`
  return (
    <Secao titulo={t.titulo} fundo="ora">
      <p className="text-xl text-white/90 sm:text-2xl">
        {t.linha(parcelas, formatarPreco(p.pixCentavos))}
      </p>
      <div className="mt-10">
        <BotaoCompra claro>{t.botao}</BotaoCompra>
      </div>
    </Secao>
  )
}

export function Rodape() {
  const t = textos.rodape
  return (
    <footer className="bg-tinta px-5 pt-12 pb-28 text-sm text-white/80">
      <div className="mx-auto flex max-w-3xl flex-col gap-3">
        <p className="font-titulo text-2xl text-white">{t.marca}</p>
        <p>{t.cnpj}</p>
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          <a
            href="/termos"
            className="inline-flex min-h-11 items-center underline underline-offset-2"
          >
            {t.termos}
          </a>
          <a
            href="/privacidade"
            className="inline-flex min-h-11 items-center underline underline-offset-2"
          >
            {t.privacidade}
          </a>
        </nav>
        <p>{t.direitos}</p>
      </div>
    </footer>
  )
}
