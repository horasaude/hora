import { useParams } from 'react-router-dom'
import { classeBrilho, LinkBrilho } from '@/components/ui'
import { DuvidasDaAula } from '@/features/forum'
import { linkDeIncorporacao } from '@/lib/video'
import type { AulaAberta } from '../api/trilha.api'
import { Concluir } from '../components/Concluir'
import { EstadoAluna } from '../components/EstadoAluna'
import { aulasDaMesmaLista } from '@/domain/trilha'
import { NavegacaoAulas, ProximaAula } from '../components/NavegacaoAulas'
import { useAula, useTrilha } from '../hooks/useTrilha'
import { textos } from '../textos'

const t = textos.aula

function Video({ aula }: { aula: AulaAberta }) {
  const link = linkDeIncorporacao(aula.video_url)
  if (!link) return <EstadoAluna tipo="aviso" texto={t.semVideo} />
  return (
    <div className="-mx-5 aspect-video overflow-hidden bg-tinta sm:mx-0 sm:rounded-[22px] sm:shadow-cartao">
      <iframe
        src={link}
        title={aula.titulo}
        className="h-full w-full"
        allow="encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
      />
    </div>
  )
}

function Cabecalho({ a }: { a: AulaAberta }) {
  const detalhe = [a.profissional, a.duracao_minutos && textos.minutos(a.duracao_minutos)]
    .filter(Boolean)
    .join(' · ')
  return (
    <header>
      <h1 className="text-[26px] leading-tight font-bold text-verde-escuro">{a.titulo}</h1>
      {detalhe && <p className="mt-1 text-sm text-suave">{detalhe}</p>}
    </header>
  )
}

/** Aula: vídeo grande, descrição, material, concluir, próxima e as aulas da etapa ao lado. */
export function AulaPage() {
  const { aulaId = '' } = useParams()
  const aula = useAula(aulaId)
  const lista = aulasDaMesmaLista(useTrilha().data, aulaId)
  const voltar = (
    <LinkBrilho to="/app/trilha" tom="cinza" tamanho="sm" className="self-start">
      {t.voltar}
    </LinkBrilho>
  )
  if (aula.isPending) return <EstadoAluna tipo="carregando" />
  if (aula.isError) return <EstadoAluna tipo="erro" tentar={() => aula.refetch()} />
  if (!aula.data)
    return (
      <section className="flex flex-col gap-3">
        {voltar}
        <EstadoAluna tipo="aviso" texto={t.fechada} />
      </section>
    )
  const a = aula.data
  return (
    <article className="flex flex-col gap-5">
      {voltar}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start lg:gap-10">
        <div className="flex flex-col gap-5">
          <Video aula={a} />
          <Cabecalho a={a} />
          <div className="flex flex-wrap items-center gap-3">
            <Concluir id={a.id} />
            <ProximaAula aulas={lista} id={a.id} />
          </div>
          {a.descricao && (
            <p className="text-base leading-relaxed whitespace-pre-line text-tinta">
              {a.descricao}
            </p>
          )}
          {a.material_url && (
            <a
              href={a.material_url}
              target="_blank"
              rel="noreferrer"
              download
              className={`${classeBrilho('cinza')} self-start`}
            >
              {t.material}
            </a>
          )}
          <DuvidasDaAula aula={a.id} />
        </div>
        <aside className="lg:sticky lg:top-8">
          <NavegacaoAulas aulas={lista} id={a.id} />
        </aside>
      </div>
    </article>
  )
}
