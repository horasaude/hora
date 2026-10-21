import { useMeusCheckins, usePontosDoDia } from '../hooks/useCheckin'
import { textos } from '../textos'
import { IconeVenci } from './IconesHabito'

const t = textos.seuDia.venci

/** Fica dourado sozinho quando o banco marca Venci o dia (os 4 hábitos feitos). Só mostra o estado. */
export function VenciODia() {
  const feito = useMeusCheckins().data?.hoje.includes('venci') ?? false
  const pontos = usePontosDoDia().data?.find((r) => r.acao === 'venci')?.pontos ?? 0
  return (
    <section aria-label={t.titulo} className="flex flex-col gap-2.5">
      <h2 className="text-[15px] font-bold text-tinta">{t.titulo}</h2>
      <div
        role="status"
        className={`flex items-center gap-3 rounded-[20px] p-4 transition ${feito ? 'bg-gradient-to-br from-dourado to-[#f5c35c] text-verde-escuro' : 'bg-trilho text-suave'}`}
      >
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white/50">
          <IconeVenci className="size-6" />
        </span>
        <div>
          <p className="text-[15px] font-bold">{feito ? t.feito : t.marca}</p>
          <p className="text-[13px]">
            {feito ? `${t.ganhou} · ${textos.pontosDia.cada(pontos)}` : t.quando}
          </p>
        </div>
      </div>
    </section>
  )
}
