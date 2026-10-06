import type { Plano } from '@/domain/precos'
import { textos } from '../textos'

type Props = { plano: Plano; valor: string; aguardando: boolean }

const link = 'text-ora underline underline-offset-2'

/** Aceite dos termos sem checkbox, em letra pequena logo abaixo do botão. */
function Concordo() {
  const [antes, meio, fim] = textos.pagamento.concordo
  return (
    <p className="text-center text-xs leading-relaxed text-suave">
      {antes}
      <a href="/termos" target="_blank" rel="noopener" className={link}>
        {textos.pagamento.termos}
      </a>
      {meio}
      <a href="/privacidade" target="_blank" rel="noopener" className={link}>
        {textos.pagamento.privacidade}
      </a>
      {fim}
    </p>
  )
}

const t = textos.pagamento

/**
 * Forma de pagamento conforme o plano: Pix no à vista, cartão no parcelado e no mensal.
 * O quadro #pagamento-mp recebe os campos seguros do Mercado Pago quando a conta for ligada.
 */
export function Pagamento({ plano, valor, aguardando }: Props) {
  const metodo = plano === 'pix' ? t.pix : t.cartao
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-ora">{t.titulo}</h2>
      <div className="rounded-2xl border border-ora bg-white p-4">
        <p className="flex items-center gap-3 text-sm font-semibold text-tinta">
          <span aria-hidden="true" className="size-4 rounded-full border-4 border-ora" />
          {metodo.nome}
        </p>
        <div
          id="pagamento-mp"
          className="mt-4 rounded-xl border border-dashed border-linha bg-creme px-4 py-6 text-center text-sm text-suave"
        >
          {metodo.texto}
        </div>
      </div>
      <p className="flex items-baseline justify-between border-t border-linha pt-4 text-tinta">
        <span className="text-sm">{t.total}</span>
        <span className="text-xl font-semibold text-ora">{valor}</span>
      </p>
      {aguardando && (
        <p role="status" className="rounded-xl bg-white p-3 text-center text-sm text-tinta">
          {t.emBreve}
        </p>
      )}
      <button
        type="submit"
        className="min-h-14 rounded-full bg-ora px-6 text-sm font-semibold tracking-[0.16em] text-creme uppercase transition hover:bg-[#233d37]"
      >
        {t.botao}
      </button>
      <Concordo />
    </section>
  )
}
