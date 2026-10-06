import { linkDeIncorporacao } from '@/lib/video'
import { textos } from '../textos'

/** Prévia do vídeo assim que o link é colado. */
export function PreviaVideo({ link }: { link: string }) {
  if (!link.trim()) return null
  const incorporar = linkDeIncorporacao(link)
  if (!incorporar) return <p className="text-sm text-suave">{textos.aulas.semPrevia}</p>
  return (
    <div className="aspect-video overflow-hidden rounded-2xl bg-tinta">
      <iframe
        src={incorporar}
        title="Prévia do vídeo"
        className="h-full w-full"
        allow="encrypted-media; picture-in-picture; fullscreen"
        loading="lazy"
      />
    </div>
  )
}
