import { pontosDoGrafico } from '@/domain/engajamento'
import { diaMesDeData } from '@/lib/datas'

const L = 600
const A = 180

type Props = { serie: { dia: string; valor: number }[]; unidade: string; rotulo: string }

const formatar = (v: number) => v.toLocaleString('pt-BR', { maximumFractionDigits: 1 })

/** Linha simples da evolução, da data mais antiga à mais nova, com o valor em cada ponto. */
export function GraficoLinha({ serie, unidade, rotulo }: Props) {
  const pontos = pontosDoGrafico(
    serie.map((s) => s.valor),
    L,
    A,
    24,
  )
  const descricao = serie
    .map((s) => `${diaMesDeData(s.dia)}: ${formatar(s.valor)} ${unidade}`)
    .join(', ')
  return (
    <figure className="flex flex-col gap-1">
      <svg
        viewBox={`0 -22 ${L} ${A + 48}`}
        role="img"
        aria-label={`${rotulo}. ${descricao}`}
        className="h-auto w-full"
      >
        <line x1="0" x2={L} y1={A - 4} y2={A - 4} stroke="#eef1ef" strokeWidth="2" />
        <polyline
          points={pontos.map((p) => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke="#6f9582"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {pontos.map((p, i) => (
          <g key={serie[i]?.dia ?? i}>
            <circle cx={p.x} cy={p.y} r="5" fill="#fff" stroke="#1f4a41" strokeWidth="2.5" />
            <text
              x={p.x}
              y={p.y - 14}
              textAnchor="middle"
              className="fill-tinta text-[17px] font-bold"
            >
              {formatar(serie[i]?.valor ?? 0)}
            </text>
            <text x={p.x} y={A + 20} textAnchor="middle" className="fill-suave text-[15px]">
              {diaMesDeData(serie[i]?.dia ?? '')}
            </text>
          </g>
        ))}
      </svg>
    </figure>
  )
}
