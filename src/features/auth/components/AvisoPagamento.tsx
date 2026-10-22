import type { ReactNode } from 'react'
import { Cartao, classeBrilho } from '@/components/ui'
import type { Pendencia } from '../api/pendencia.api'
import { usePendencia } from '../hooks/usePendencia'
import { textos } from '../textos'

const t = textos.pagamento

function CartaoPagar({ p, texto }: { p: Pendencia; texto: string }) {
  return (
    <Cartao role="alert" className="flex flex-col items-start gap-3 text-sm text-tinta">
      <p>{texto}</p>
      {p.fatura_url && (
        <a href={p.fatura_url} target="_blank" rel="noreferrer" className={classeBrilho('dourado')}>
          {t.pagar}
        </a>
      )}
    </Cartao>
  )
}

/** Sem acesso: se foi pausado por falta de pagamento, mostra isso com Pagar agora; senão, o aviso de sempre. */
export function AcessoPausado({ padrao }: { padrao: ReactNode }) {
  const p = usePendencia()
  return p?.pausado ? <CartaoPagar p={p} texto={t.pausado} /> : padrao
}

/** Com acesso, mas com a mensalidade em aberto: aviso no Início antes de pausar. */
export function MensalidadeEmAberto() {
  const p = usePendencia()
  return p && !p.pausado ? <CartaoPagar p={p} texto={t.emAberto} /> : null
}
