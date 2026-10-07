import { useState } from 'react'
import { Link } from 'react-router-dom'
import { classeBrilho } from '@/components/ui'
import type { Aula, Etapa } from '../api/conteudo.api'
import { salvarEtapa } from '../api/conteudo.api'
import { useAcoes, useSalvar } from '../hooks/usePainel'
import { textos } from '../textos'
import { FormNome } from './FormNome'
import { Linha } from './Linha'
import { ConfirmarPublicar, EtiquetaVisivel } from './Visibilidade'

type Props = {
  etapa: Etapa
  aulas: Aula[]
  temaId: string
  temaPublicado: boolean
  primeira: boolean
  ultima: boolean
}

type Contexto = { temaId: string; etapa: Etapa; temaPublicado: boolean }

/** Publica a aula; se a etapa ou o tema está em rascunho, pergunta se publica tudo junto. */
function usePublicarAula({ etapa, temaId, temaPublicado }: Contexto) {
  const { publicar } = useAcoes()
  const [confirmar, setConfirmar] = useState<Aula | null>(null)
  const tabelaPublicar = (tabela: 'aulas' | 'etapas' | 'temas', id: string) =>
    publicar.mutateAsync({ tabela, id, publicado: true })
  const aoPublicar = (a: Aula) => {
    if (!a.publicado && (!etapa.publicado || !temaPublicado)) return setConfirmar(a)
    publicar.mutate({ tabela: 'aulas', id: a.id, publicado: !a.publicado })
  }
  const janela = confirmar && (
    <ConfirmarPublicar
      etapaRascunho={!etapa.publicado}
      aoFechar={() => setConfirmar(null)}
      aoSoAula={async () => {
        setConfirmar(null)
        await tabelaPublicar('aulas', confirmar.id)
      }}
      aoTudo={async () => {
        setConfirmar(null)
        await tabelaPublicar('aulas', confirmar.id)
        if (!etapa.publicado) await tabelaPublicar('etapas', etapa.id)
        if (!temaPublicado) await tabelaPublicar('temas', temaId)
      }}
    />
  )
  return { aoPublicar, janela, ocupado: publicar.isPending }
}

function ListaAulas({ aulas, ...ctx }: Contexto & { aulas: Aula[] }) {
  const { ordenar } = useAcoes()
  const pub = usePublicarAula(ctx)
  const ocupado = pub.ocupado || ordenar.isPending
  return (
    <>
      {pub.janela}
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
            para={`/app/admin/aulas/${a.id}?tema=${ctx.temaId}`}
            ocupado={ocupado}
            extra={
              <EtiquetaVisivel
                s={{ aula: a.publicado, etapa: ctx.etapa.publicado, tema: ctx.temaPublicado }}
              />
            }
            aoPublicar={() => pub.aoPublicar(a)}
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
        to={`/app/admin/aulas/nova?etapa=${ctx.etapa.id}&tema=${ctx.temaId}`}
        className={`mt-1 self-start ${classeBrilho('dourado')}`}
      >
        + {textos.aulas.nova}
      </Link>
    </>
  )
}

/** Uma etapa com as suas aulas: editar, publicar, reordenar e criar aula. */
export function EtapaCartao({ etapa, aulas, temaId, temaPublicado, primeira, ultima }: Props) {
  const { publicar, ordenar } = useAcoes()
  const salvar = useSalvar(salvarEtapa)
  const [editando, setEditando] = useState(false)
  const ocupado = publicar.isPending || ordenar.isPending
  return (
    <li className="flex flex-col gap-1 rounded-2xl border border-linha bg-white px-4 py-3">
      {editando && (
        <FormNome
          titulo={textos.etapas.editar}
          rotulo={textos.etapas.campoTitulo}
          inicial={{ titulo: etapa.titulo, descricao: etapa.descricao }}
          aoCancelar={() => setEditando(false)}
          aoSalvar={async (d) => {
            await salvar.mutateAsync({ ...d, id: etapa.id, tema_id: temaId, ordem: etapa.ordem })
            setEditando(false)
          }}
        />
      )}
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
            ultima ? undefined : () => ordenar.mutate({ tipo: 'etapa', id: etapa.id, direcao: 1 })
          }
        />
      </ul>
      <button
        type="button"
        onClick={() => setEditando(true)}
        className="min-h-9 self-start text-xs font-bold text-verde-escuro underline underline-offset-4"
      >
        {textos.editar}
      </button>
      <ListaAulas aulas={aulas} temaId={temaId} etapa={etapa} temaPublicado={temaPublicado} />
    </li>
  )
}
