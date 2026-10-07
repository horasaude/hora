import { useEffect, useState } from 'react'
import { classeBrilho, LogoOra } from '@/components/ui'
import { pedidoValido, situacaoPedido } from '@/lib/pedido'
import { trocarCartao } from '../api/pedido.api'
import { ID_BRICK, useBrick } from '../hooks/useBrick'
import { textos } from '../textos'

const t = textos.troca

type Fase = 'carregando' | 'pronto' | 'enviando' | 'feito' | 'invalido'

/** Link do e-mail de cobrança recusada: troca o cartão da assinatura mensal. */
export function TrocarCartaoPage() {
  const [id] = useState(() => new URLSearchParams(window.location.search).get('pedido'))
  const [valor, setValor] = useState(0)
  const [fase, setFase] = useState<Fase>(() => (pedidoValido(id) ? 'carregando' : 'invalido'))
  const [erro, setErro] = useState<string | null>(null)
  const brick = useBrick('recorrente', valor, '', valor > 0 && fase !== 'feito')

  useEffect(() => {
    if (!pedidoValido(id)) return
    situacaoPedido(id)
      .then((s) => {
        if (s?.plano !== 'recorrente' || s.status !== 'aprovado') return setFase('invalido')
        setValor(s.valor_centavos)
        setFase('pronto')
      })
      .catch(() => setFase('invalido'))
  }, [id])

  async function salvar() {
    setErro(null)
    setFase('enviando')
    const cartao = await brick.cartao().catch(() => null)
    const r = cartao && pedidoValido(id) ? await trocarCartao(id, cartao) : null
    if (r?.ok) return setFase('feito')
    setErro(
      r?.status === 'recusado' || !cartao ? textos.recusado.motivos.dados : textos.pagamento.falha,
    )
    setFase('pronto')
  }

  return (
    <main className="min-h-dvh bg-white px-5 py-10 font-sistema">
      <div className="mx-auto flex max-w-lg flex-col gap-5">
        <LogoOra largura={120} className="h-10 w-auto self-start" />
        <h1 className="text-2xl font-bold text-ora">{t.titulo}</h1>
        {fase === 'invalido' && <p role="alert">{t.naoEncontrado}</p>}
        {fase === 'feito' && (
          <p role="status" className="text-tinta">
            {t.feito}
          </p>
        )}
        {(fase === 'pronto' || fase === 'enviando') && (
          <>
            <div id={ID_BRICK} className="bg-white" />
            {erro && (
              <p role="alert" className="rounded-xl bg-terracota-suave p-3 text-sm">
                {erro}
              </p>
            )}
            <button
              type="button"
              onClick={salvar}
              disabled={fase === 'enviando' || brick.estado !== 'pronto'}
              className={`${classeBrilho('verde', 'lg')} min-h-12 w-full`}
            >
              {fase === 'enviando' ? textos.pagamento.enviando : t.botao}
            </button>
          </>
        )}
      </div>
    </main>
  )
}
