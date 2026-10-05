import { Campo } from '@/components/ui'
import type { Plano } from '@/domain/precos'
import { linkWhatsApp } from '@/lib/whatsapp'
import { useCompraForm } from '../../hooks/useCompraForm'
import { usePrecos } from '../../hooks/usePrecos'
import { textos } from '../../textos'
import { EscolhaPagamento } from './EscolhaPagamento'
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

function SemLink() {
  const whats = linkWhatsApp(import.meta.env.VITE_WHATSAPP_NUMERO, textos.whatsapp.mensagem)
  return (
    <p role="alert" className="rounded-xl bg-white p-3 text-sm text-tinta">
      {t.semLink}{' '}
      {whats && (
        <a href={whats} className={`font-semibold ${link}`}>
          {t.chamarWhatsApp}
        </a>
      )}
    </p>
  )
}

export function CompraForm({ planoInicial }: { planoInicial: Plano }) {
  const { form, enviar, whatsapp, semLink, ocupado } = useCompraForm(planoInicial)
  const { register } = form
  const erros = form.formState.errors
  const opcoes = opcoesPagamento(usePrecos())
  return (
    <form onSubmit={enviar} noValidate className="flex flex-col gap-4">
      <EscolhaPagamento opcoes={opcoes} campo={register('plano')} erro={erros.plano?.message} />
      <Campo rotulo={t.nome} autoComplete="name" erro={erros.nome?.message} {...register('nome')} />
      <Campo
        rotulo={t.email}
        type="email"
        autoComplete="email"
        erro={erros.email?.message}
        {...register('email')}
      />
      <Campo
        rotulo={t.whatsapp}
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
      {semLink && <SemLink />}
      <button
        type="submit"
        disabled={ocupado}
        className="min-h-14 rounded-full bg-ora px-6 text-sm font-semibold tracking-[0.16em] text-creme uppercase transition hover:bg-[#233d37] disabled:opacity-70"
      >
        {ocupado ? t.indo : t.botao}
      </button>
      <Concordo />
    </form>
  )
}
