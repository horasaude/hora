import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Aula, Etapa } from '../api/conteudo.api'
import { salvarEtapa } from '../api/conteudo.api'
import { useAcoes, useSalvar } from '../hooks/usePainel'
import { textos } from '../textos'
import { FormNome } from './FormNome'
import { Linha } from './Linha'

type Props = { etapa: Etapa; aulas: Aula[]; temaId: string; primeira: boolean; ultima: boolean }

function ListaAulas({
  aulas,
  temaId,
  etapaId,
}: {
  aulas: Aula[]
  temaId: string
  etapaId: string
}) {
  const { publicar, ordenar } = useAcoes()
  const ocupado = publicar.isPending || ordenar.isPending
  return (
    <>
      <p className="mt-2 text-[0.7rem] font-semibold tracking-[0.14em] text-suave uppercase">
        {textos.aulas.titulo}
      </p>
      {aulas.length === 0 && <p className="text-sm text-suave">{textos.aulas.vazio}</p>}
      <ul className="flex flex-col divide-y divide-linha">
        {aulas.map((a, i) => (
          <Linha
            key={a.id}
            titulo={a.titulo}
            detalhe={textos.aulas.dia(a.dia_liberacao)}
            publicado={a.publicado}
            para={`/app/admin/aulas/${a.id}?tema=${temaId}`}
            ocupado={ocupado}
            aoPublicar={() =>
              publicar.mutate({ tabela: 'aulas', id: a.id, publicado: !a.publicado })
            }
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
        to={`/app/admin/aulas/nova?etapa=${etapaId}&tema=${temaId}`}
        className="mt-1 inline-flex min-h-11 items-center justify-center rounded-xl border border-ora bg-white text-sm font-semibold text-ora hover:bg-salvia-suave"
      >
        + {textos.aulas.nova}
      </Link>
    </>
  )
}

/** Uma etapa com as suas aulas: editar, publicar, reordenar e criar aula. */
export function EtapaCartao({ etapa, aulas, temaId, primeira, ultima }: Props) {
  const { publicar, ordenar } = useAcoes()
  const salvar = useSalvar(salvarEtapa)
  const [editando, setEditando] = useState(false)
  const ocupado = publicar.isPending || ordenar.isPending
  return (
    <li className="flex flex-col gap-1 rounded-xl border border-linha bg-areia px-4 py-3">
      {editando ? (
        <FormNome
          rotulo={textos.etapas.campoTitulo}
          inicial={{ titulo: etapa.titulo, descricao: etapa.descricao }}
          aoCancelar={() => setEditando(false)}
          aoSalvar={async (d) => {
            await salvar.mutateAsync({ ...d, id: etapa.id, tema_id: temaId, ordem: etapa.ordem })
            setEditando(false)
          }}
        />
      ) : (
        <>
          <ul>
            <Linha
              titulo={`${etapa.ordem}. ${etapa.titulo}`}
              detalhe={etapa.descricao}
              publicado={etapa.publicado}
              ocupado={ocupado}
              aoPublicar={() =>
                publicar.mutate({ tabela: 'etapas', id: etapa.id, publicado: !etapa.publicado })
              }
              aoSubir={
                primeira
                  ? undefined
                  : () => ordenar.mutate({ tipo: 'etapa', id: etapa.id, direcao: -1 })
              }
              aoDescer={
                ultima
                  ? undefined
                  : () => ordenar.mutate({ tipo: 'etapa', id: etapa.id, direcao: 1 })
              }
            />
          </ul>
          <button
            type="button"
            onClick={() => setEditando(true)}
            className="min-h-11 self-start text-xs font-semibold text-ora underline underline-offset-4"
          >
            {textos.editar}
          </button>
        </>
      )}
      <ListaAulas aulas={aulas} temaId={temaId} etapaId={etapa.id} />
    </li>
  )
}
