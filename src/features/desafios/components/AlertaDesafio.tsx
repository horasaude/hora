import { LinkBrilho } from '@/components/ui'
import { escolher } from '../escolher'
import { useDesafios } from '../hooks/useDesafios'
import { textoPremio } from '../premio'
import { textos } from '../textos'
import { IconePresente } from './IconesDesafio'

const t = textos.alerta

/** Faixa no topo do Início enquanto o check-in de hoje do desafio do mês não foi feito (ou ela ainda não entrou). */
export function AlertaDesafio({ hoje, temaId = null }: { hoje: string; temaId?: string | null }) {
  const desafios = useDesafios()
  const d = escolher(desafios.data ?? [], hoje, temaId)
  if (!d || hoje < d.inicio || (d.participando && d.feito_hoje)) return null
  const premio = textoPremio(d)
  return (
    <section
      role="status"
      className="flex flex-wrap items-center gap-3 rounded-[20px] border border-[#f6d48a] bg-gradient-to-br from-[#fff6e2] to-[#fde3a8] p-4"
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-dourado text-verde-escuro">
        <IconePresente className="size-6" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[15px] leading-snug font-bold text-verde-escuro">
          {d.participando ? t.falta : t.entrar}
        </p>
        <p className="text-[13px] text-[#7a5a12]">
          {premio ? `${d.nome} · ${textos.premio}: ${premio}` : `${d.nome} · ${t.naoPerca}`}
        </p>
      </div>
      <LinkBrilho to={`/app/desafios/${d.id}`} tom="dourado">
        {d.participando ? t.fazer : t.ver}
      </LinkBrilho>
    </section>
  )
}
