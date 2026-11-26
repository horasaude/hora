import { Bloco, BotaoBlack } from './base'
import { dois, useFaltaBlack } from './tempo'
import { black } from './textos'

const t = black.oferta

function Contagem() {
  const f = useFaltaBlack()
  if (!f) return null
  const partes = [f.dias, f.horas, f.minutos, f.segundos]
  return (
    <div className="mt-8">
      <p className="text-[11px] tracking-[0.2em] text-creme/60 uppercase">{t.contagem}</p>
      <div role="timer" aria-live="off" className="mx-auto mt-3 grid max-w-xs grid-cols-4 gap-2">
        {partes.map((v, i) => (
          <div key={t.unidades[i]} className="rounded-xl bg-white/5 py-2">
            <p className="text-2xl font-bold text-creme tabular-nums">{dois(v)}</p>
            <p className="text-[10px] tracking-[0.14em] text-creme/55 uppercase">{t.unidades[i]}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Caixa do preço da Black: âncora riscada, preço grande, contagem, botão e garantia. */
export function Oferta() {
  const g = black.garantia
  return (
    <Bloco id="oferta">
      <div className="mx-auto max-w-xl rounded-[2rem] border-2 border-verde-vivo bg-[#0c120f] px-6 py-10 text-center shadow-[0_0_100px_rgb(31_168_110/0.25)] sm:px-10">
        <p className="mx-auto w-fit rounded-full bg-verde-vivo px-4 py-1 text-[11px] font-bold tracking-[0.2em] text-[#04140d] uppercase">
          {t.etiqueta}
        </p>
        <p className="mt-6 text-creme/50 line-through">{t.de}</p>
        <p className="font-texto text-7xl leading-none font-extrabold tracking-tight text-verde-vivo sm:text-8xl">
          {t.preco}
        </p>
        <p className="mt-1 text-sm text-creme/60">{t.mensal}</p>
        <p className="mt-3 font-semibold text-creme">{t.dia}</p>
        <p className="mt-1 text-sm text-verde-vivo">{t.economia}</p>
        <Contagem />
        <div className="mt-8">
          <BotaoBlack>{t.botao}</BotaoBlack>
        </div>
        <p className="mt-4 text-xs text-creme/55">{t.seguro}</p>
      </div>
      <div className="mx-auto mt-8 flex max-w-xl items-center gap-5 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
        <span className="grid size-20 shrink-0 place-items-center rounded-full border-2 border-verde-vivo text-center text-sm leading-tight font-bold text-verde-vivo">
          {g.selo}
        </span>
        <div>
          <p className="font-titulo text-xl text-creme">{g.titulo}</p>
          <p className="mt-1 text-sm leading-relaxed text-creme/70">{g.texto}</p>
        </div>
      </div>
    </Bloco>
  )
}
