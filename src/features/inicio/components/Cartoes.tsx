import { Link } from 'react-router-dom'
import { Cartao, IconePlay } from '@/components/ui'
import { textos } from '../textos'

type Aula = { id: string; titulo: string; duracao_minutos: number | null }

/** Aula de hoje: play verde escuro, título e duração. */
export function AulaDeHoje({ aula }: { aula: Aula }) {
  return (
    <Link to={`/app/trilha/aula/${aula.id}`} aria-label={textos.aula.abrir(aula.titulo)}>
      <Cartao className="flex items-center gap-4">
        <span className="brilho brilho-escuro grid size-10 shrink-0 place-items-center rounded-full">
          <IconePlay className="ml-0.5 size-3.5" />
        </span>
        <span className="min-w-0">
          <span className="block text-base font-bold text-tinta">{textos.aula.titulo}</span>
          <span className="block text-sm text-suave">
            {aula.titulo}
            {aula.duracao_minutos ? ` · ${aula.duracao_minutos} min` : ''}
          </span>
        </span>
      </Cartao>
    </Link>
  )
}
