import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { classeBrilho } from '@/components/ui'
import type { Aula } from '../api/conteudo.api'
import { excluirAula } from '../api/excluir.api'
import { useAcoes } from '../hooks/usePainel'
import { textos } from '../textos'
import { Linha } from './Linha'
import { ConfirmarPublicar, EtiquetasAula } from './Visibilidade'

type Props = { aulas: Aula[]; temaId: string; temaPublicado: boolean }

/** Publica a aula; se o tema está em rascunho, pergunta se publica os dois juntos. */
function usePublicarAula(temaId: string, temaPublicado: boolean) {
  const { publicar } = useAcoes()
  const [confirmar, setConfirmar] = useState<Aula | null>(null)
  const aoPublicar = (a: Aula) => {
    if (!a.publicado && !temaPublicado) return setConfirmar(a)
    publicar.mutate({ tabela: 'aulas', id: a.id, publicado: !a.publicado })
  }
  const janela = confirmar && (
    <ConfirmarPublicar
      etapaRascunho={false}
      aoFechar={() => setConfirmar(null)}
      aoSoAula={async () => {
        setConfirmar(null)
        await publicar.mutateAsync({ tabela: 'aulas', id: confirmar.id, publicado: true })
      }}
      aoTudo={async () => {
        setConfirmar(null)
        await publicar.mutateAsync({ tabela: 'aulas', id: confirmar.id, publicado: true })
        await publicar.mutateAsync({ tabela: 'temas', id: temaId, publicado: true })
      }}
    />
  )
  return { aoPublicar, janela, ocupado: publicar.isPending }
}

/** Aulas do tema: editar, publicar, reordenar e criar (todas abrem juntas com o tema para a aluna). */
export function AulasDoTema({ aulas, temaId, temaPublicado }: Props) {
  const { ordenar } = useAcoes()
  const cliente = useQueryClient()
  const pub = usePublicarAula(temaId, temaPublicado)
  const ocupado = pub.ocupado || ordenar.isPending
  return (
    <div className="flex flex-col gap-1">
      {pub.janela}
      {aulas.length === 0 && <p className="text-sm text-suave">{textos.aulas.vazio}</p>}
      <ul className="flex flex-col divide-y divide-linha">
        {aulas.map((a, i) => (
          <Linha
            key={a.id}
            titulo={a.titulo}
            publicado={a.publicado}
            para={`/app/admin/aulas/${a.id}?tema=${temaId}`}
            ocupado={ocupado}
            extra={
              <EtiquetasAula s={{ aula: a.publicado, etapa: true, tema: temaPublicado }} l={a} />
            }
            aoPublicar={() => pub.aoPublicar(a)}
            aoExcluir={async () => {
              await excluirAula(a.id)
              await cliente.invalidateQueries()
            }}
            aoSubir={
              i > 0 ? () => ordenar.mutate({ tipo: 'aula', id: a.id, direcao: -1 }) : undefined
            }
            aoDescer={
              i < aulas.length - 1
                ? () => ordenar.mutate({ tipo: 'aula', id: a.id, direcao: 1 })
                : undefined
            }
          />
        ))}
      </ul>
      <Link
        to={`/app/admin/aulas/nova?tema=${temaId}`}
        className={`mt-1 self-start ${classeBrilho('dourado')}`}
      >
        + {textos.aulas.nova}
      </Link>
    </div>
  )
}
