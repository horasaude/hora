import { useState } from 'react'
import { AvisoErro } from '@/components/ui'
import { useAguaHoje, useRegistrarAgua } from '../hooks/useCheckin'
import { textos } from '../textos'
import { IconeAgua } from './IconesHabito'
import { LembreteAgua } from './LembreteAgua'
import { LinhaHabito, Marca } from './LinhaHabito'

const COPO = 250
const ml = (n: number) => n.toLocaleString('pt-BR')
const botao =
  'inline-flex min-h-9 shrink-0 items-center rounded-full border border-[#4A9BD8] bg-white px-3 text-[13px] font-bold text-[#2F7DB8] disabled:opacity-60'

/** Copos de 250 ml que vão enchendo até a meta do dia. */
function Copos({ total, meta }: { total: number; meta: number }) {
  const n = Math.max(1, Math.ceil(meta / COPO))
  const cheios = Math.floor(total / COPO)
  return (
    <span className="mt-1.5 flex flex-wrap gap-1" aria-hidden>
      {Array.from({ length: n }, (_, i) => (
        <span
          key={i}
          className={`h-[18px] w-3.5 rounded-t-[3px] rounded-b-[5px] ${i < cheios ? 'bg-[#5fb7e6]' : 'bg-trilho'}`}
        />
      ))}
    </span>
  )
}

/** Água na lista do dia: copos até a meta, +250 ml, +500 ml, desfazer e o lembrete. Bater a meta marca sozinho. */
export function LinhaAgua({ feito, pontos }: { feito: boolean; pontos: number }) {
  const agua = useAguaHoje()
  const registrar = useRegistrarAgua()
  const [ganho, setGanho] = useState<{ pontos: number; chave: number } | null>(null)
  const total = agua.data?.total ?? 0
  const meta = agua.data?.meta ?? 2000
  const ocupado = registrar.isPending || agua.isPending
  const somar = (n: number) =>
    registrar.mutate(n, {
      onSuccess: (r) => r.pontos > 0 && setGanho({ pontos: r.pontos, chave: Date.now() }),
    })
  const mais = (n: number) => (
    <button type="button" disabled={ocupado} onClick={() => somar(n)} className={botao}>
      {textos.agua.copo(n)}
    </button>
  )
  return (
    <LinhaHabito
      icone={<IconeAgua className="size-6" />}
      cor="bg-[#e4f3fb] text-[#3a9bd1]"
      nome={textos.seuDia.agua.nome}
      sub={`${textos.agua.progresso(`${ml(total)} ml`, `${ml(meta)} ml`)} · ${textos.seuDia.pontos(pontos)}`}
      feito={feito}
      ganho={ganho}
      lado={feito ? <Marca feito /> : mais(COPO)}
    >
      <Copos total={total} meta={meta} />
      <span className="mt-2 flex flex-wrap items-center gap-2">
        {feito && mais(COPO)}
        {mais(500)}
        {total > 0 && (
          <button
            type="button"
            disabled={ocupado}
            onClick={() => somar(-1)}
            className="min-h-9 px-1 text-[13px] font-bold text-suave underline"
          >
            {textos.agua.desfazer}
          </button>
        )}
      </span>
      <span className="mt-2 block">
        <LembreteAgua />
      </span>
      <AvisoErro texto={registrar.isError ? textos.erro : null} />
    </LinhaHabito>
  )
}
