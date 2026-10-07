import { useSequencia } from '../hooks/useCheckin'
import { textos } from '../textos'

/** Bolinhas douradas dos últimos 7 dias e "X dias seguidos". */
export function Sequencia() {
  const { seguidos, semana } = useSequencia()
  const feitos = semana.filter(Boolean).length
  return (
    <div className="flex items-center gap-3">
      <span className="flex gap-1.5" role="img" aria-label={textos.semanaRotulo(feitos)}>
        {semana.map((feito, i) => (
          <span key={i} className={`size-3 rounded-full ${feito ? 'bg-dourado' : 'bg-trilho'}`} />
        ))}
      </span>
      <span className="text-sm text-suave">{textos.seguidos(seguidos)}</span>
    </div>
  )
}
