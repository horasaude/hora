import { useId } from 'react'
import { Link } from 'react-router-dom'
import type { TemaOpcao } from '@/domain/trilha'
import { textos } from '../textos'

const t = textos.previa

type Props = {
  dia: number
  tema: string | null
  temas: TemaOpcao[]
  aoMudar: (dia: number, tema: string | null) => void
}

/** Faixa ocre do topo: Pré-visualização, dia (1 a 365) e tema. */
export function FaixaPrevia({ dia, tema, temas, aoMudar }: Props) {
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
          onChange={(e) => aoMudar(Math.min(365, Math.max(1, Number(e.target.value) || 1)), tema)}
          className={`${campo} w-20`}
        />
      </label>
      <input
        type="range"
        min={1}
        max={365}
        value={dia}
        aria-label={t.dia}
        onChange={(e) => aoMudar(Number(e.target.value), tema)}
        className="w-40 accent-[#C98410]"
      />
      <label htmlFor={`${id}-tema`} className="flex items-center gap-2 text-sm text-[#7A5617]">
        {t.tema}
        <select
          id={`${id}-tema`}
          value={tema ?? ''}
          onChange={(e) => aoMudar(dia, e.target.value || null)}
          className={campo}
        >
          <option value="">{t.semTema}</option>
          {temas.map((x) => (
            <option key={x.id} value={x.id}>
              {x.titulo}
            </option>
          ))}
        </select>
      </label>
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
