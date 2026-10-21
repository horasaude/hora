import { useId } from 'react'
import { Link } from 'react-router-dom'
import { textos } from '../textos'

const t = textos.previa

/** Faixa ocre do topo: Pré-visualização e o dia da aluna (1 a 365). */
export function FaixaPrevia({ dia, aoMudar }: { dia: number; aoMudar: (dia: number) => void }) {
  const id = useId()
  const campo =
    'min-h-9 rounded-full border border-[#E3CF9E] bg-white px-3 text-sm text-tinta focus:border-ora focus:outline-none'
  return (
    <div className="sticky top-0 z-10 -mx-5 mb-6 flex flex-wrap items-center gap-3 border-b border-[#E3CF9E] bg-[#F6EBD3] px-5 py-3 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
      <span className="text-[13px] font-bold tracking-[0.08em] text-[#7A5617] uppercase">
        {t.titulo}
      </span>
      <label htmlFor={`${id}-dia`} className="flex items-center gap-2 text-sm text-[#7A5617]">
        {t.dia}
        <input
          id={`${id}-dia`}
          type="number"
          min={1}
          max={365}
          value={dia}
          onChange={(e) => aoMudar(Math.min(365, Math.max(1, Number(e.target.value) || 1)))}
          className={`${campo} w-20`}
        />
      </label>
      <input
        type="range"
        min={1}
        max={365}
        value={dia}
        aria-label={t.dia}
        onChange={(e) => aoMudar(Number(e.target.value))}
        className="w-40 accent-[#C98410]"
      />
      <span className="text-xs text-[#7A5617]">{t.aviso}</span>
      <Link
        to="/app/admin/conteudo"
        className="ml-auto text-sm font-bold text-[#7A5617] underline underline-offset-2"
      >
        {t.sair}
      </Link>
    </div>
  )
}
