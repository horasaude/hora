import { IconeCheck } from '@/components/ui'
import { diasDoDesafio } from '@/domain/engajamento'
import { diaMesDeData } from '@/lib/datas'
import type { Desafio, DiaDesafio } from '../api/desafios.api'
import { textos } from '../textos'

/** Conta o dia: no desafio de número, só quando bateu a meta do dia. */
function contou(d: Desafio, dia: DiaDesafio | undefined) {
  if (!dia) return false
  return d.tipo_checkin !== 'numero' || (dia.valor ?? 0) >= (d.meta_diaria ?? 0)
}

/** Calendário do desafio: dias feitos em vidro verde com ✓, hoje com contorno, futuros apagados. */
export function CalendarioDesafio({
  d,
  dias,
  hoje,
}: {
  d: Desafio
  dias: DiaDesafio[]
  hoje: string
}) {
  const marcados = new Map(dias.map((x) => [x.dia, x]))
  return (
    <ol aria-label={textos.calendario} className="grid max-w-[380px] grid-cols-7 gap-2">
      {diasDoDesafio(d.inicio, d.fim).map((dia) => {
        const feito = contou(d, marcados.get(dia))
        const ehHoje = dia === hoje
        const rotulo = feito
          ? textos.diaFeito(diaMesDeData(dia))
          : ehHoje
            ? textos.diaHoje(diaMesDeData(dia))
            : textos.diaVazio(diaMesDeData(dia))
        return (
          <li
            key={dia}
            aria-label={rotulo}
            className={`grid aspect-square place-items-center rounded-full text-[13px] font-bold ${
              feito
                ? 'brilho brilho-verde'
                : ehHoje
                  ? 'border-2 border-dourado text-tinta'
                  : dia > hoje
                    ? 'bg-white text-suave/60 ring-1 ring-linha'
                    : 'bg-trilho text-suave'
            }`}
          >
            {feito ? <IconeCheck className="size-3.5" /> : Number(dia.slice(8, 10))}
          </li>
        )
      })}
    </ol>
  )
}
