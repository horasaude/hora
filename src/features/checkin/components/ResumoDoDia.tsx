import { Link } from 'react-router-dom'
import { useMeusCheckins } from '../hooks/useCheckin'
import { textos } from '../textos'
import { IconeAgua, IconeDieta, IconeSono, IconeTreino } from './IconesHabito'

const t = textos.seuDia
const QUATRO = [
  { id: 'sono', Icone: IconeSono },
  { id: 'agua', Icone: IconeAgua },
  { id: 'dieta', Icone: IconeDieta },
  { id: 'treino', Icone: IconeTreino },
] as const

/** Início: "Seu dia" com as 4 bolinhas de hoje (Sono, Água, Dieta, Treino) e o Ver tudo. */
export function ResumoDoDia() {
  const meus = useMeusCheckins()
  const hoje = meus.data?.hoje ?? []
  return (
    <section className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[15px] font-bold text-tinta">{t.titulo}</h2>
        <Link to="/app/dia" className="text-[13px] font-bold text-[#167a50] hover:underline">
          {t.verTudo}
        </Link>
      </div>
      <Link to="/app/dia" aria-busy={meus.isPending} className="grid grid-cols-4 gap-2">
        {QUATRO.map(({ id, Icone }) => {
          const feito = hoje.includes(id)
          return (
            <span
              key={id}
              className="flex flex-col items-center gap-1.5 rounded-2xl border border-linha bg-white px-1 py-2.5 text-[12px] font-bold text-tinta"
            >
              <span
                className={`relative grid size-9 place-items-center rounded-full transition ${feito ? 'bg-verde-vivo text-white' : 'bg-trilho text-suave'}`}
              >
                <Icone className="size-5" />
              </span>
              <span aria-hidden>{t.curtos[id]}</span>
              <span className="sr-only">{t.mini(t.curtos[id], feito)}</span>
            </span>
          )
        })}
      </Link>
    </section>
  )
}
