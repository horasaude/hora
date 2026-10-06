import { useState } from 'react'
import { BotaoBrilho } from '@/components/ui'
import { useEncerrar, useVencedoras } from '../hooks/useModulos'
import { textos } from '../textos'

const t = textos.desafios

/** Encerrar pede um segundo toque para confirmar. */
export function BotaoEncerrar({ id }: { id: string }) {
  const encerrar = useEncerrar()
  const [confirmando, setConfirmando] = useState(false)
  return (
    <BotaoBrilho
      tom="coral"

      disabled={encerrar.isPending}
      onClick={() => (confirmando ? encerrar.mutate(id) : setConfirmando(true))}
    >
      {confirmando ? `${t.encerrar}?` : t.encerrar}
    </BotaoBrilho>
  )
}

/** Vencedoras do desafio encerrado: quem cumpriu a meta de dias. */
export function Vencedoras({ id }: { id: string }) {
  const lista = useVencedoras(id, true)
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-[1.35rem] leading-snug font-bold text-ora">{t.vencedoras}</h3>
      {lista.isPending && <p className="text-sm text-suave">{textos.carregando}</p>}
      {lista.data?.length === 0 && <p className="text-sm text-suave">{t.semVencedoras}</p>}
      <ol className="flex flex-col divide-y divide-linha rounded-2xl border border-linha">
        {lista.data?.map((v, i) => (
          <li key={v.perfil_id} className="flex items-center gap-3 px-4 py-3 text-sm">
            <span className="brilho brilho-leve brilho-dourado grid size-7 place-items-center rounded-full text-xs font-bold">
              {i + 1}
            </span>
            <span className="flex-1 font-semibold text-tinta">
              {v.nome}
              {v.apelido && <span className="font-normal text-suave"> · {v.apelido}</span>}
            </span>
            <span className="text-suave">{t.dias(v.dias)}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}
