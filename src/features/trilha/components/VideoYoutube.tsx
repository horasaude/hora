import { linkComApi } from '@/lib/youtube'
import { useAssistir } from '../hooks/useAssistir'
import { EstadoAluna } from './EstadoAluna'

type Props = {
  video: string
  aula: string
  titulo: string
  gravar: boolean
  aoConcluir: () => void
}

/** Vídeo do YouTube que acompanha o tempo assistido e retoma de onde a aluna parou. */
export function VideoYoutube({ video, aula, titulo, gravar, aoConcluir }: Props) {
  const { pronto, inicio, ligar, comecou } = useAssistir({ aula, gravar, aoConcluir })
  return (
    <div className="relative -mx-5 aspect-video overflow-hidden bg-tinta sm:mx-0 sm:rounded-[22px] sm:shadow-cartao">
      {pronto ? (
        <iframe
          ref={ligar}
          src={linkComApi(video, inicio)}
          title={titulo}
          className="h-full w-full"
          allow="encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <EstadoAluna tipo="carregando" />
      )}
      {pronto && <TampaYoutube comecou={comecou} />}
    </div>
  )
}

/** Tampa por cima do título, do "Assista no YouTube" e do logo para a aluna não abrir o vídeo fora do ORA.
 * Antes do play tampa a faixa de baixo inteira; tocando, só o logo (play, som, legenda e tela cheia seguem livres). */
function TampaYoutube({ comecou }: { comecou: boolean }) {
  return (
    <>
      <span aria-hidden className="absolute inset-x-0 top-0 h-[18%] min-h-12" />
      {comecou ? (
        <span
          aria-hidden
          className="absolute right-11 bottom-0 h-10 w-[4.5rem] sm:right-12 sm:h-12"
        />
      ) : (
        <span aria-hidden className="absolute inset-x-0 bottom-0 h-[22%] min-h-14" />
      )}
    </>
  )
}
