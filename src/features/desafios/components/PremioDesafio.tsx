import type { Desafio } from '../api/desafios.api'
import { textos } from '../textos'
import { IconePresente } from './IconesDesafio'

const t = textos.premioCartao

/** Prêmio em destaque: fundo dourado claro, caixa dourada com presente, etiqueta Prêmio e o texto grande. */
export function PremioDesafio({ d }: { d: Desafio }) {
  const premio = d.premio.trim() || (d.premio_surpresa ? textos.surpresa : '')
  if (!premio) return null
  const extra = d.premio.trim() && d.premio_surpresa ? t.maisSurpresa : ''
  return (
    <section className="flex items-center gap-3.5 rounded-[22px] border border-[#f6d48a] bg-gradient-to-br from-[#fff6e2] to-[#fde3a8] p-4">
      <span className="grid size-[60px] shrink-0 place-items-center rounded-[18px] bg-dourado text-verde-escuro shadow-[0_8px_20px_rgb(242_169_34/0.35)]">
        <IconePresente className="size-7" />
      </span>
      <div className="min-w-0">
        <span className="inline-flex rounded-full bg-white px-2.5 py-[3px] text-[11px] font-bold text-[#a86d05]">
          {textos.premio}
        </span>
        <p className="mt-1.5 text-[20px] leading-tight font-bold text-verde-escuro">
          {premio}
          {extra}
        </p>
        <p className="text-[12.5px] text-[#7a5a12]">{t.paraQuem(d.meta_dias)}</p>
      </div>
    </section>
  )
}

/** Faixa dourada do prêmio no cartão da lista. */
export function FaixaPremio({ texto }: { texto: string }) {
  return (
    <p className="flex items-center gap-2 rounded-[14px] border border-[#f6d48a] bg-[#fdf1d8] px-3 py-2 text-[13px] text-[#7a5a12]">
      <span className="grid size-7 shrink-0 place-items-center rounded-[9px] bg-dourado text-verde-escuro">
        <IconePresente className="size-4" />
      </span>
      <span className="min-w-0">
        <b className="text-[#a86d05]">{textos.premio}: </b>
        {texto}
      </span>
    </p>
  )
}
