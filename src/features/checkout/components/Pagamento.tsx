import { classeBrilho } from '@/components/ui'
import type { Plano } from '@/domain/precos'
import { ID_BRICK, type EstadoBrick } from '../hooks/useBrick'
import { textos } from '../textos'

type Props = {
  plano: Plano
  valor: string
  brick: EstadoBrick
  enviando: boolean
  erro: string | null
}

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

const AVISO: Partial<Record<EstadoBrick, string>> = {
  carregando: t.carregando,
  sem_chave: t.semChave,
  erro: t.erroBrick,
}

/**
 * Forma de pagamento conforme o plano: o Payment Brick do Mercado Pago em #pagamento-mp,
 * só com Pix no à vista e só com cartão no parcelado e no mensal. O botão é nosso (vidro verde).
 */
export function Pagamento({ plano, valor, brick, enviando, erro }: Props) {
  const metodo = plano === 'pix' ? t.pix : t.cartao
  const bloqueado = enviando || brick === 'sem_chave' || brick === 'erro' || brick === 'carregando'
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-ora">{t.titulo}</h2>
      <div className="rounded-2xl border border-ora bg-white p-4">
        <p className="flex items-center gap-3 text-sm font-semibold text-tinta">
          <span aria-hidden="true" className="size-4 rounded-full border-4 border-ora" />
          {metodo.nome}
        </p>
        {AVISO[brick] && <p className="mt-4 text-center text-sm text-suave">{AVISO[brick]}</p>}
        <div id={ID_BRICK} className="mt-4 bg-white font-sistema" />
      </div>
      <p className="flex items-baseline justify-between border-t border-linha pt-4 text-tinta">
        <span className="text-sm">{t.total}</span>
        <span className="text-xl font-semibold text-ora">{valor}</span>
      </p>
      {erro && (
        <p
          role="alert"
          className="rounded-xl bg-terracota-suave p-3 text-center text-sm text-tinta"
        >
          {erro}
        </p>
      )}
      <button
        type="submit"
        disabled={bloqueado}
        aria-busy={enviando}
        className={`${classeBrilho('verde', 'lg')} min-h-12 w-full text-sm tracking-[0.12em] uppercase`}
      >
        {enviando ? t.enviando : t.botao}
      </button>
      <Concordo />
    </section>
  )
}
