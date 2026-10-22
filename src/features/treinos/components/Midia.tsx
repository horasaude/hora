import { VideoIncorporado } from '@/components/ui'
import { useQuery } from '@tanstack/react-query'
import { ehVideo } from '@/domain/arquivos'
import { linkDeIncorporacao } from '@/lib/video'
import { linkDaFoto } from '../api/treinos.api'
import { textos } from '../textos'

/** Demonstração do exercício: vídeo do YouTube ou enviado (em loop, sem som); sem vídeo, a foto ou o GIF inteiro; sem nada, um aviso discreto. */
export function Midia({ nome, video, foto }: { nome: string; video: string; foto: string | null }) {
  const link = linkDeIncorporacao(video)
  const url = useQuery({
    queryKey: ['foto-exercicio', foto],
    queryFn: () => linkDaFoto(foto ?? ''),
    enabled: !link && Boolean(foto),
    staleTime: 30 * 60_000,
  }).data
  if (link)
    return (
      <div className="aspect-video overflow-hidden rounded-[20px] bg-tinta">
        <VideoIncorporado src={link} titulo={nome} />
      </div>
    )
  if (url && ehVideo(foto))
    return (
      <div className="overflow-hidden rounded-[20px] bg-tinta">
        <video
          src={url}
          aria-label={nome}
          autoPlay
          loop
          muted
          playsInline
          className="mx-auto aspect-video w-full object-contain"
        />
      </div>
    )
  if (url && foto?.endsWith('.gif'))
    return (
      <div className="flex justify-center rounded-[20px] bg-white py-2">
        <img src={url} alt={nome} className="aspect-square w-full max-w-[300px] object-contain" />
      </div>
    )
  if (url)
    return <img src={url} alt={nome} className="aspect-video w-full rounded-[20px] object-cover" />
  return (
    <div className="grid aspect-[16/7] place-items-center rounded-[20px] bg-[#FFF1EA] text-sm text-suave">
      {textos.execucao.semVideo}
    </div>
  )
}
