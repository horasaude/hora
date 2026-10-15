import { IconeCheck, PontosGanhos } from '@/components/ui'
import { HABITOS, textos, type Habito } from '../textos'
import { ICONES } from './icones'

export type Ganho = { tipo: Habito; pontos: number; chave: number }

type Props = {
  dias: string[]
  hoje: string
  porDia: Record<string, Habito[]>
  carregando: boolean
  ganho: Ganho | null
  aoTocar: (tipo: Habito, comFoto: boolean) => void
}

function Celula({
  feito,
  ehHoje,
  automatico,
  futuro,
  rotulo,
  desligado,
  aoTocar,
}: {
  feito: boolean
  ehHoje: boolean
  automatico: boolean
  futuro: boolean
  rotulo: string
  desligado: boolean
  aoTocar: () => void
}) {
  const cor = feito
    ? 'brilho brilho-verde'
    : ehHoje && automatico
      ? 'border-2 border-dashed border-[#4A9BD8] bg-white'
      : ehHoje
        ? 'border-2 border-ora bg-white hover:bg-[#EAF5EE]'
        : futuro
          ? 'bg-[#F4F5F4]'
          : 'bg-[#DCDDD8]'
  if (!ehHoje || automatico)
    return (
      <span
        role="img"
        aria-label={rotulo}
        className={`grid size-8 place-items-center rounded-md ${cor}`}
      >
        {feito && <IconeCheck className="size-3.5" />}
      </span>
    )
  return (
    <button
      type="button"
      aria-pressed={feito}
      aria-label={rotulo}
      disabled={desligado || feito}
      onClick={aoTocar}
      className={`grid size-8 place-items-center rounded-md transition ${cor}`}
    >
      {feito && <IconeCheck className="size-3.5" />}
    </button>
  )
}

function Cabecalho({ dias, hoje }: { dias: string[]; hoje: string }) {
  return (
    <thead>
      <tr>
        <th className="w-[76px] sm:w-40" />
        {dias.map((d, i) => (
          <th
            key={d}
            scope="col"
            className={`text-center text-[11px] font-bold tracking-wide uppercase ${d === hoje ? 'text-ora' : 'text-suave'}`}
          >
            {textos.diasCurtos[i]}
          </th>
        ))}
      </tr>
    </thead>
  )
}

/** Legenda dos ícones no celular, onde os nomes não cabem ao lado. */
export function LegendaHabitos() {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-suave sm:hidden">
      {HABITOS.map((h) => {
        const { Icone, cor } = ICONES[h.id]
        return (
          <li key={h.id} className="flex items-center gap-1.5">
            <Icone className={`size-4 ${cor}`} />
            {h.nome}
          </li>
        )
      })}
    </ul>
  )
}

/** Grade da semana: hábitos nas linhas, segunda a domingo nas colunas; hoje em destaque. */
export function GradeSemana({ dias, hoje, porDia, carregando, ganho, aoTocar }: Props) {
  return (
    <table
      className="w-full table-fixed border-separate border-spacing-y-1.5"
      aria-busy={carregando}
    >
      <Cabecalho dias={dias} hoje={hoje} />
      <tbody>
        {HABITOS.map((h) => {
          const { Icone, cor } = ICONES[h.id]
          return (
            <tr key={h.id}>
              <th scope="row" className="text-left">
                <span className="flex items-center gap-2">
                  <Icone className={`size-6 shrink-0 ${cor}`} />
                  <span className="hidden text-[13px] font-medium text-tinta sm:inline">
                    {h.nome}
                  </span>
                </span>
              </th>
              {dias.map((d, i) => (
                <td
                  key={d}
                  className={`relative text-center ${d === hoje ? 'rounded-md bg-[#F3FAF6]' : ''}`}
                >
                  <span className="inline-grid">
                    <Celula
                      feito={(porDia[d] ?? []).includes(h.id)}
                      ehHoje={d === hoje}
                      automatico={h.auto}
                      futuro={d > hoje}
                      rotulo={textos.dia(
                        h.nome,
                        textos.diasCurtos[i] ?? '',
                        (porDia[d] ?? []).includes(h.id),
                      )}
                      desligado={carregando}
                      aoTocar={() => aoTocar(h.id, h.foto)}
                    />
                  </span>
                  {d === hoje && ganho?.tipo === h.id && (
                    <PontosGanhos pontos={ganho.pontos} chave={ganho.chave} />
                  )}
                </td>
              ))}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
