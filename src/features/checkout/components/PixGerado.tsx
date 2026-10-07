import { useCallback, useState } from 'react'
import { classeBrilho } from '@/components/ui'
import type { Pix } from '../api/pedido.api'
import { irParaObrigada } from '../hooks/useFinalizar'
import { usePixPendente } from '../hooks/usePixPendente'
import { textos } from '../textos'

const t = textos.pix

type Props = { pedido: string; pix: Pix; aoGerarOutro: () => void }

/** QR Code grande, copia e cola, contagem de 30 min e espera da confirmação. */
export function PixGerado({ pedido, pix, aoGerarOutro }: Props) {
  const aprovado = useCallback(() => irParaObrigada(pedido), [pedido])
  const { tempo, expirou } = usePixPendente(pedido, pix.expira_em, aprovado)
  const [copiado, setCopiado] = useState(false)

  async function copiar() {
    try {
      await navigator.clipboard.writeText(pix.copia_cola)
      setCopiado(true)
    } catch {
      setCopiado(false)
    }
  }

  return (
    <section className="flex flex-col items-center gap-4 rounded-2xl border border-ora bg-white p-5 text-center font-sistema">
      <h2 className="text-lg font-bold text-ora">{t.titulo}</h2>
      {expirou ? (
        <>
          <p role="alert" className="text-tinta">
            {t.expirou}
          </p>
          <button
            type="button"
            onClick={aoGerarOutro}
            className={`${classeBrilho('verde', 'lg')} w-full max-w-xs`}
          >
            {t.outro}
          </button>
        </>
      ) : (
        <>
          <img
            src={`data:image/png;base64,${pix.qr_base64}`}
            alt={t.qr}
            className="aspect-square w-full max-w-64 rounded-xl border border-linha"
          />
          <button
            type="button"
            onClick={copiar}
            className={`${classeBrilho('verde', 'lg')} w-full max-w-xs`}
          >
            {copiado ? t.copiado : t.copiar}
          </button>
          <p className="text-sm text-suave" aria-live="polite">
            {t.expira(tempo)}
          </p>
          <p role="status" className="rounded-xl bg-salvia-suave px-4 py-3 text-sm text-tinta">
            {t.aviso}
          </p>
        </>
      )}
    </section>
  )
}
