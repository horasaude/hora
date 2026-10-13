import { useQuery } from '@tanstack/react-query'
import { linkDeIncorporacao } from '@/lib/video'
import { linkDaFoto } from '../api/treinos.api'
import { textos } from '../textos'

/** Demonstração do exercício: vídeo; sem vídeo, a foto; sem os dois, um aviso discreto. */
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
        <iframe
          src={link}
          title={nome}
          className="h-full w-full"
          allow="encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
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
