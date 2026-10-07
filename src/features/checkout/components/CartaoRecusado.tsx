import { classeBrilho } from '@/components/ui'
import type { Motivo } from '../api/pedido.api'
import { textos } from '../textos'

const t = textos.recusado

/** Recusa do cartão em português claro, conforme o motivo, com nova tentativa. */
export function CartaoRecusado({ motivo, aoTentar }: { motivo: Motivo; aoTentar: () => void }) {
  return (
    <section
      role="alert"
      className="flex flex-col gap-3 rounded-2xl border border-terracota bg-white p-5 font-sistema"
    >
      <h2 className="text-lg font-bold text-terracota-escuro">{t.titulo}</h2>
      <p className="text-tinta">{t.motivos[motivo]}</p>
      <button type="button" onClick={aoTentar} className={`${classeBrilho('verde', 'lg')} w-full`}>
        {t.tentar}
      </button>
    </section>
  )
}
