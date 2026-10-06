import { Link, useParams } from 'react-router-dom'
import { IconeCheck } from '@/components/ui'
import { linkDeIncorporacao } from '@/lib/video'
import type { AulaAberta } from '../api/trilha.api'
import { EstadoAluna } from '../components/EstadoAluna'
import { useAula, useConcluida, useMarcarConcluida } from '../hooks/useTrilha'
import { textos } from '../textos'

const t = textos.aula

function Video({ aula }: { aula: AulaAberta }) {
  const link = linkDeIncorporacao(aula.video_url)
  if (!link) return <EstadoAluna tipo="aviso" texto={t.semVideo} />
  return (
    <div className="-mx-5 aspect-video overflow-hidden bg-tinta sm:mx-0 sm:rounded-[1.25rem]">
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

function Concluir({ id }: { id: string }) {
  const concluida = useConcluida(id)
  const marcar = useMarcarConcluida(id)
  const feita = concluida.data === true
  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        disabled={concluida.isPending || marcar.isPending}
        onClick={() => marcar.mutate(!feita)}
        aria-pressed={feita}
        className={`inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl text-base font-semibold disabled:opacity-60 ${feita ? 'bg-salvia-suave text-ora' : 'bg-terracota-escuro text-white'}`}
      >
        {feita && <IconeCheck />}
        {feita ? t.desmarcar : t.marcar}
      </button>
      {marcar.isError && (
        <p role="alert" className="text-center text-sm text-terracota-escuro">
          {t.erroMarcar}
        </p>
      )}
    </div>
  )
}

/** Material para baixar e marcar como concluída. */
function Acoes({ aula }: { aula: AulaAberta }) {
  return (
    <>
      {aula.material_url && (
        <a
          href={aula.material_url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-ocre bg-ocre-suave px-4 text-sm font-semibold text-[#80591c]"
        >
          {t.material}
        </a>
      )}
      <Concluir id={aula.id} />
    </>
  )
}

/** Aula: vídeo no topo, título, profissional e duração, texto de apoio, material e concluir. */
export function AulaPage() {
  const { aulaId = '' } = useParams()
  const aula = useAula(aulaId)
  const voltar = (
    <Link
      to="/app/trilha"
      className="inline-flex min-h-11 items-center text-sm text-suave underline underline-offset-4"
    >
      {t.voltar}
    </Link>
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
  const detalhe = [a.profissional, a.duracao_minutos && textos.minutos(a.duracao_minutos)]
    .filter(Boolean)
    .join(' · ')
  const cabecalho = (
    <header>
      <h1 className="font-titulo text-[1.6rem] leading-tight text-ora lg:text-[2rem]">
        {a.titulo}
      </h1>
      {detalhe && <p className="mt-1 text-sm text-suave">{detalhe}</p>}
    </header>
  )
  return (
    <article className="flex flex-col gap-5">
      {voltar}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-10">
        <div className="flex flex-col gap-5">
          <Video aula={a} />
          <div className="lg:hidden">{cabecalho}</div>
          {a.descricao && (
            <p className="text-[0.95rem] leading-relaxed whitespace-pre-line text-tinta">
              {a.descricao}
            </p>
          )}
        </div>
        <aside className="flex flex-col gap-4 lg:sticky lg:top-8">
          <div className="hidden lg:block">{cabecalho}</div>
          <Acoes aula={a} />
        </aside>
      </div>
    </article>
  )
}
