import { Campo } from '@/components/ui'
import type { Plano } from '@/domain/precos'
import { useCompraForm } from '../../hooks/useCompraForm'
import { usePrecos } from '../../hooks/usePrecos'
import { textos } from '../../textos'
import { opcoesPagamento } from './opcoes'

const t = textos.compra
const link = 'text-ora underline underline-offset-2'

function Concordo() {
  const [antes, meio, fim] = t.concordo
  return (
    <p className="text-center text-xs leading-relaxed text-suave">
      {antes}
      <a href="/termos" target="_blank" rel="noopener" className={link}>
        {textos.rodape.termos}
      </a>
      {meio}
      <a href="/privacidade" target="_blank" rel="noopener" className={link}>
        {textos.rodape.privacidade}
      </a>
      {fim}
    </p>
  )
}

export type OfertaCompra = { cupom: string; valor: string }

function PlanoEscolhido({ plano, oferta }: { plano: Plano; oferta?: OfertaCompra }) {
  const achada = opcoesPagamento(usePrecos()).find((o) => o.plano === plano)
  if (!achada) return null
  const escolhida = oferta ? { ...achada, valor: oferta.valor } : achada
  return (
    <p className="mb-1 rounded-2xl bg-white px-4 py-3 text-sm text-tinta">
      <span className="block text-[0.65rem] font-semibold tracking-[0.18em] text-suave uppercase">
        {t.escolhido}
      </span>
      <span className="font-semibold text-ora">{escolhida.valor}</span> {escolhida.rotulo}
    </p>
  )
}

/** Só os três campos: o plano já veio do cartão escolhido na página. */
export function CompraForm({
  planoInicial,
  oferta,
}: {
  planoInicial: Plano
  oferta?: OfertaCompra
}) {
  const { form, enviar, whatsapp, ocupado } = useCompraForm(planoInicial, oferta?.cupom)
  const { register } = form
  const erros = form.formState.errors
  return (
    <form onSubmit={enviar} noValidate className="flex flex-col gap-3">
      <PlanoEscolhido plano={planoInicial} oferta={oferta} />
      <Campo
        rotulo={t.nome.rotulo}
        rotuloOculto
        placeholder={t.nome.exemplo}
        autoComplete="name"
        erro={erros.nome?.message}
        {...register('nome')}
      />
      <Campo
        rotulo={t.email.rotulo}
        rotuloOculto
        placeholder={t.email.exemplo}
        type="email"
        autoComplete="email"
        erro={erros.email?.message}
        {...register('email')}
      />
      <Campo
        rotulo={t.whatsapp.rotulo}
        rotuloOculto
        placeholder={t.whatsapp.exemplo}
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        erro={erros.whatsapp?.message}
        {...whatsapp}
      />
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="site">{t.site}</label>
        <input id="site" type="text" tabIndex={-1} autoComplete="off" {...register('site')} />
      </div>
      <button
        type="submit"
        disabled={ocupado}
        className="mt-2 min-h-14 rounded-full bg-ora px-6 text-sm font-semibold tracking-[0.16em] text-creme uppercase transition hover:bg-[#233d37] disabled:opacity-70"
      >
        {ocupado ? t.indo : t.botao}
      </button>
      <Concordo />
    </form>
  )
}
