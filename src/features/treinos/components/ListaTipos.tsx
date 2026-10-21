import { combinaCom, ordenarTipos } from '@/domain/treinos'
import type { RotinaAluna, TreinoResumo } from '../api/treinos.api'
import { textos } from '../textos'
import { CartaoTipo } from './CartaoTipo'
import { Estado } from './Estado'
import { ListaTreinos } from './ListaTreinos'

type Props = {
  tipos: RotinaAluna[]
  avulsos: TreinoResumo[]
  nivel: string
  local: string
  feitos: Set<string>
  link: (id: string) => string
  abrir: (id: string) => void
}

/** Tipos de treino do tema em cartões (os do nível e local dela primeiro) e os treinos avulsos. */
export function ListaTipos({ tipos, avulsos, nivel, local, feitos, link, abrir }: Props) {
  if (tipos.length === 0 && avulsos.length === 0)
    return <Estado tipo="vazio" texto={textos.tipos.vazio} />
  return (
    <div className="flex flex-col gap-7">
      {tipos.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-[19px] font-bold text-verde-escuro">{textos.tipos.titulo}</h2>
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {ordenarTipos(tipos, nivel, local).map((r) => (
              <li key={r.id}>
                <CartaoTipo
                  rotina={r}
                  paraVoce={combinaCom(r, nivel, local) === 2}
                  aoAbrir={() => abrir(r.id)}
                />
              </li>
            ))}
          </ul>
        </section>
      )}
      {avulsos.length > 0 && (
        <ListaTreinos
          titulo={textos.outros}
          vazio={textos.semOutros}
          lista={avulsos}
          feitos={feitos}
          link={link}
        />
      )}
    </div>
  )
}
