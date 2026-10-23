import { VideoIncorporado } from '@/components/ui'
import { useParams } from 'react-router-dom'
import { DuvidasDaAula } from '@/features/forum'
import { sanitizarHtml, textoParaHtml } from '@/lib/html'
import { idDoYoutube, linkDeIncorporacao } from '@/lib/video'
import type { AulaAberta } from '../api/trilha.api'
import { CabecalhoAula } from '../components/CabecalhoAula'
import { Concluir } from '../components/Concluir'
import { VideoYoutube } from '../components/VideoYoutube'
import { useConclusao, type Conclusao } from '../hooks/useConclusao'
import { MateriaisDaAula } from '../components/MateriaisDaAula'
import { EstadoAluna } from '../components/EstadoAluna'
import { LinkVoltar } from '../components/TopoVoltar'
import { aulasDaMesmaLista } from '@/domain/trilha'
import { NavegacaoAulas, ProximaAula } from '../components/NavegacaoAulas'
import { useAula, useTrilha } from '../hooks/useTrilha'
import { useLinkTema, usePrevia } from '../previa'
import { textos } from '../textos'

const t = textos.aula

function Video({ aula, c, gravar }: { aula: AulaAberta; c: Conclusao; gravar: boolean }) {
  if (!aula.video_url) return null
  const youtube = idDoYoutube(aula.video_url)
  if (youtube)
    return (
      <VideoYoutube
        video={youtube}
        aula={aula.id}
        titulo={aula.titulo}
        gravar={gravar && !c.concluida}
        aoConcluir={c.concluir}
      />
    )
  const link = linkDeIncorporacao(aula.video_url)
  if (!link) return <EstadoAluna tipo="aviso" texto={t.semVideo} />
  return (
    <div className="-mx-5 aspect-video overflow-hidden bg-tinta sm:mx-0 sm:rounded-[22px] sm:shadow-cartao">
      <VideoIncorporado src={link} titulo={aula.titulo} />
    </div>
  )
}

/** Descrição feita no editor do painel (negrito, listas, links); texto antigo sem marcação mantém as quebras. */
function Descricao({ html }: { html: string }) {
  return (
    <div
      className="texto-rico text-base leading-relaxed text-tinta"
      dangerouslySetInnerHTML={{ __html: sanitizarHtml(textoParaHtml(html), { links: true }) }}
    />
  )
}

/** Aula: vídeo, descrição, concluir, próxima e as aulas do tema ao lado. Cada aula abre um player novo (key),
 * senão o YouTube perde a ligação com o acompanhamento ao trocar de aula e fica na qualidade baixa. */
export function AulaPage() {
  const { aulaId = '' } = useParams()
  return <ConteudoDaAula key={aulaId} aulaId={aulaId} />
}

function ConteudoDaAula({ aulaId }: { aulaId: string }) {
  const previa = usePrevia()
  const aula = useAula(aulaId)
  const conclusao = useConclusao(aulaId)
  const trilha = useTrilha().data
  const lista = aulasDaMesmaLista(trilha, aulaId)
  const linkTema = useLinkTema()
  const tema = trilha?.temas.find((x) => x.aulas.some((y) => y.id === aulaId))
  const voltar = (
    <LinkVoltar
      para={tema ? linkTema(tema.id) : previa ? `/app/previa${previa.sufixo}` : '/app/trilha'}
    >
      {t.voltar}
    </LinkVoltar>
  )
  if (!aula.data)
    return (
      <section className="flex flex-col gap-3">
        {voltar}
        {aula.isPending ? (
          <EstadoAluna tipo="carregando" />
        ) : aula.isError ? (
          <EstadoAluna tipo="erro" tentar={() => aula.refetch()} />
        ) : (
          <EstadoAluna tipo="aviso" texto={t.fechada} />
        )}
      </section>
    )
  const a = aula.data
  const youtube = idDoYoutube(a.video_url) !== null
  const numero = (tema?.aulas.findIndex((x) => x.id === a.id) ?? -1) + 1
  return (
    <article className="flex flex-col gap-5">
      {voltar}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start lg:gap-10">
        <div className="flex flex-col gap-5">
          <Video key={a.id} aula={a} c={conclusao} gravar={!previa} />
          <CabecalhoAula a={a} tema={tema?.titulo} numero={numero} />
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <Concluir c={conclusao} automatico={youtube} />
              <ProximaAula aulas={lista} id={a.id} />
            </div>
            {youtube && !conclusao.concluida && (
              <p className="text-[13px] text-suave">{t.dicaVideo}</p>
            )}
          </div>
          {a.descricao && <Descricao html={a.descricao} />}
          <MateriaisDaAula aula={a.id} />
          {!previa && <DuvidasDaAula aula={a.id} />}
        </div>
        <aside className="flex flex-col gap-5 lg:sticky lg:top-8">
          <NavegacaoAulas aulas={lista} id={a.id} />
        </aside>
      </div>
    </article>
  )
}
