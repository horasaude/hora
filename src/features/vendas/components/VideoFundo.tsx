import { useEffect, useRef, useState } from 'react'

type Clipe = { src: string; poster: string }

// Pexels (licença livre, sem crédito obrigatório): 8045825, 7026643 e 6812958.
const PRIMEIRO: Clipe = { src: '/videos/exercicio.mp4', poster: '/videos/exercicio.webp' }
const CLIPES: Clipe[] = [
  PRIMEIRO,
  { src: '/videos/alimentacao.mp4', poster: '/videos/alimentacao.webp' },
  { src: '/videos/cuidado.mp4', poster: '/videos/cuidado.webp' },
]

type Conexao = { connection?: { saveData?: boolean } }

/** Sem vídeo para quem pediu menos movimento ou economia de dados: fica a imagem parada. */
function podeTocarVideo(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  const menosMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const economia = (navigator as Navigator & Conexao).connection?.saveData === true
  return !menosMovimento && !economia
}

/** Exercício, alimentação e cuidado, em sequência, sem som e em loop. */
export function VideoFundo({ className }: { className: string }) {
  const [indice, setIndice] = useState(0)
  const [comVideo] = useState(podeTocarVideo)
  const video = useRef<HTMLVideoElement>(null)
  const clipe = CLIPES.at(indice) ?? PRIMEIRO

  // iOS só toca sozinho com muted definido no elemento antes do play.
  useEffect(() => {
    const v = video.current
    if (!v) return
    v.muted = true
    const tocando = v.play()
    if (tocando && typeof tocando.catch === 'function') tocando.catch(() => {})
  }, [indice])

  if (!comVideo) return <img src={PRIMEIRO.poster} alt="" className={className} />
  return (
    <video
      key={clipe.src}
      ref={video}
      className={className}
      src={clipe.src}
      poster={clipe.poster}
      autoPlay
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
      onEnded={() => setIndice((i) => (i + 1) % CLIPES.length)}
    />
  )
}
