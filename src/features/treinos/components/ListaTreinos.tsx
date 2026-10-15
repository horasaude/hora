import type { TreinoResumo } from '../api/treinos.api'
import { CartaoTreino } from './CartaoTreino'

type Props = {
  titulo: string
  vazio: string
  lista: TreinoResumo[]
  feitos: Set<string>
  link: (id: string) => string
}

/** Lista de treinos em cartões (Outros treinos ou a aba Aeróbico). */
export function ListaTreinos({ titulo, vazio, lista, feitos, link }: Props) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-[19px] font-bold text-verde-escuro">{titulo}</h2>
      {lista.length === 0 ? (
        <p className="text-sm text-suave">{vazio}</p>
      ) : (
        <ul className="grid gap-3 lg:grid-cols-2">
          {lista.map((x) => (
            <li key={x.id}>
              <CartaoTreino x={x} para={link(x.id)} feito={feitos.has(x.id)} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
