import { EtiquetaBrilho } from '@/components/ui'
import { diaEMes } from '@/lib/datas'
import type { Indicacao } from '../api/pontos.api'
import { textos } from '../textos'

const t = textos.indicar
const CORES = ['#e2588f', '#6f9582', '#8b6fd6', '#c26e4f'] as const

/** Situação de cada indicação: confirmada com os pontos em verde, aguardando cinza, cancelada coral. */
function Situacao({ i }: { i: Indicacao }) {
  if (i.status === 'confirmada')
    return <EtiquetaBrilho tom="verde">{t.pontos(i.pontos, i.status)}</EtiquetaBrilho>
  return (
    <EtiquetaBrilho tom={i.status === 'cancelada' ? 'coral' : 'cinza'}>
      {t.status[i.status]}
    </EtiquetaBrilho>
  )
}

/** Suas indicações: inicial colorida, nome, data e a situação. */
export function ListaIndicacoes({ lista, erro }: { lista: Indicacao[]; erro: boolean }) {
  if (lista.length === 0)
    return <p className="text-sm text-suave">{erro ? textos.erro : t.vazio}</p>
  return (
    <ul className="flex flex-col gap-2">
      {lista.map((i, n) => {
        const nome = i.indicada_nome || t.semNome
        return (
          <li
            key={i.id}
            className="flex items-center gap-3 rounded-[16px] border border-linha bg-white px-3 py-2.5"
          >
            <span
              aria-hidden
              style={{ background: CORES[n % CORES.length] }}
              className="grid size-9 shrink-0 place-items-center rounded-full font-bold text-white"
            >
              {nome[0]?.toUpperCase()}
            </span>
            <span className="min-w-0 flex-1">
              <b className="block truncate text-[15px] text-tinta">{nome}</b>
              <span className="text-[12px] text-suave">{diaEMes(new Date(i.created_at))}</span>
            </span>
            <Situacao i={i} />
          </li>
        )
      })}
    </ul>
  )
}
