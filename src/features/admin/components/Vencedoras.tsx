import { useState } from 'react'
import { Botao } from '@/components/ui'
import { useEncerrar, useVencedoras } from '../hooks/useModulos'
import { textos } from '../textos'

const t = textos.desafios

/** Encerrar pede um segundo toque para confirmar. */
export function BotaoEncerrar({ id }: { id: string }) {
  const encerrar = useEncerrar()
  const [confirmando, setConfirmando] = useState(false)
  return (
    <Botao
      variante="secundario"
      className="rounded-xl border-terracota-escuro text-sm text-terracota-escuro"
      disabled={encerrar.isPending}
      onClick={() => (confirmando ? encerrar.mutate(id) : setConfirmando(true))}
    >
      {confirmando ? `${t.encerrar}?` : t.encerrar}
    </Botao>
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
      <ol className="flex flex-col divide-y divide-linha rounded-xl border border-linha">
        {lista.data?.map((v, i) => (
          <li key={v.perfil_id} className="flex items-center gap-3 px-4 py-3 text-sm">
            <span className="grid size-7 place-items-center rounded-full bg-ocre-suave text-xs font-semibold text-[#80591c]">
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
