import { Cartao, LinkBrilho } from '@/components/ui'
import { escolher } from '../escolher'
import { useDesafios } from '../hooks/useDesafios'
import { textoPremio } from '../premio'
import { textos } from '../textos'
import { CheckinDesafio } from './CheckinDesafio'
import { ProgressoDesafio } from './Progresso'

function IconeTrofeu() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="size-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 4h10v4a5 5 0 0 1-10 0V4ZM7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4M12 13v4M8.5 20h7M9.5 17h5" />
    </svg>
  )
}

/** Início: "Desafio do mês" com troféu, prêmio, barra "Dia X de N" e o check-in (ou Entrar) do dia. */
export function CartaoDesafioAtivo({
  hoje,
  temaId = null,
}: {
  hoje: string
  temaId?: string | null
}) {
  const desafios = useDesafios()
  const d = escolher(desafios.data ?? [], hoje, temaId)
  if (!d) return null
  const premio = textoPremio(d)
  return (
    <section className="flex flex-col gap-2.5">
      <h2 className="text-[15px] font-bold text-tinta">{textos.inicio.titulo}</h2>
      <Cartao className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#fdf1d8] text-[#a86d05]">
            <IconeTrofeu />
          </span>
          <div className="min-w-0">
            <p className="text-[15px] leading-snug font-bold text-tinta">{d.nome}</p>
            {premio && <p className="text-[13px] text-suave">{`${textos.premio}: ${premio}`}</p>}
          </div>
        </div>
        <ProgressoDesafio d={d} hoje={hoje} />
        <div className="flex flex-wrap items-end justify-between gap-3">
          <CheckinDesafio d={d} hoje={hoje} />
          <LinkBrilho to={`/app/desafios/${d.id}`} tom="cinza">
            {textos.inicio.ver}
          </LinkBrilho>
        </div>
      </Cartao>
    </section>
  )
}
