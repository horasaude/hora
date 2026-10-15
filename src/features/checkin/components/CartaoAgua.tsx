import { useState } from 'react'
import { AvisoErro, IconeCheck, PontosGanhos } from '@/components/ui'
import { useAguaHoje, usePontosDoDia, useRegistrarAgua } from '../hooks/useCheckin'
import { textos } from '../textos'
import { IconeAgua } from './IconesHabito'
import { LembreteAgua } from './LembreteAgua'

const t = textos.agua
const litros = (ml: number) =>
  ml >= 1000 ? `${(ml / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} L` : `${ml} ml`
const COPOS = [250, 500] as const

function Copos({
  total,
  ocupado,
  somar,
}: {
  total: number
  ocupado: boolean
  somar: (ml: number) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {COPOS.map((ml) => (
        <button
          key={ml}
          type="button"
          disabled={ocupado}
          onClick={() => somar(ml)}
          className="inline-flex min-h-9 items-center rounded-full bg-[#4A9BD8] px-4 text-[13px] font-bold text-white disabled:opacity-60"
        >
          {t.copo(ml)}
        </button>
      ))}
      {total > 0 && (
        <button
          type="button"
          disabled={ocupado}
          onClick={() => somar(-1)}
          className="inline-flex min-h-9 items-center rounded-full px-3 text-[13px] font-bold text-suave underline"
        >
          {t.desfazer}
        </button>
      )}
    </div>
  )
}

/** Água de hoje: copos somados até a meta diária da equipe; bater a meta marca Hidratar-se e dá os pontos. */
export function CartaoAgua() {
  const agua = useAguaHoje()
  const registrar = useRegistrarAgua()
  const valor = usePontosDoDia().data?.find((a) => a.acao === 'agua')?.pontos ?? 5
  const [ganho, setGanho] = useState<{ pontos: number; chave: number } | null>(null)
  const total = agua.data?.total ?? 0
  const meta = agua.data?.meta ?? 2000
  const pct = Math.min(100, Math.round((total / meta) * 100))
  const somar = (ml: number) =>
    registrar.mutate(ml, {
      onSuccess: (r) => r.pontos > 0 && setGanho({ pontos: r.pontos, chave: Date.now() }),
    })
  return (
    <section className="relative flex flex-col gap-3 rounded-[18px] bg-[#EEF6FC] p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-sm font-bold text-tinta">
          <IconeAgua className="size-5 text-[#4A9BD8]" />
          {t.titulo}
        </h3>
        <span className="text-sm font-bold text-[#2F7DB8]">
          {t.progresso(litros(total), litros(meta))}
        </span>
      </div>
      <div
        className="h-3 overflow-hidden rounded-full bg-white"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={t.titulo}
      >
        <div
          className="h-full rounded-full bg-[#4A9BD8] transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      {total >= meta ? (
        <p className="flex items-center gap-1 text-sm font-bold text-verde-escuro">
          <IconeCheck className="size-3.5" />
          {t.batida}
        </p>
      ) : (
        <p className="text-xs text-suave">{t.pontos(valor)}</p>
      )}
      <Copos total={total} ocupado={registrar.isPending} somar={somar} />
      <LembreteAgua />
      {ganho && <PontosGanhos pontos={ganho.pontos} chave={ganho.chave} />}
      <AvisoErro texto={registrar.isError ? textos.erro : null} />
    </section>
  )
}
