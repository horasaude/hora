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
    <Secao etiqueta={t.etiqueta} titulo={t.titulo} fundo="ora" marca>
      <p className="text-xl text-creme/90 sm:text-2xl">
        {t.linha(parcelas, formatarPreco(p.pixCentavos))}
      </p>
      <div className="mt-10">
        <BotaoCompra variante="claro">{t.botao}</BotaoCompra>
      </div>
    </Secao>
  )
}

export function Rodape() {
  const t = textos.rodape
  return (
    <footer className="bg-tinta px-5 pt-14 pb-28 text-sm text-creme/75">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:px-3">
        <img
          src="/logo-ora.png"
          alt="ORA"
          width={482}
          height={189}
          loading="lazy"
          className="h-9 w-auto self-start brightness-0 invert"
        />
        <p className="mt-4">{t.cnpj}</p>
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          <a
            href="/termos"
            className="inline-flex min-h-11 items-center underline underline-offset-4"
          >
            {t.termos}
          </a>
          <a
            href="/privacidade"
            className="inline-flex min-h-11 items-center underline underline-offset-4"
          >
            {t.privacidade}
          </a>
        </nav>
        <p>{t.direitos}</p>
      </div>
    </footer>
  )
}
