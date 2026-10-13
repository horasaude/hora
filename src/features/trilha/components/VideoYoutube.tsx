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
  const { pronto, inicio, ligar } = useAssistir({ aula, gravar, aoConcluir })
  return (
    <div className="-mx-5 aspect-video overflow-hidden bg-tinta sm:mx-0 sm:rounded-[22px] sm:shadow-cartao">
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
    </div>
  )
}
