import { useEffect, useRef, useState } from 'react'

type Clipe = { src: string; poster: string }

// Pexels (licença livre, sem crédito obrigatório): corrida, salada e yoga.
// Verticais para tela em pé, horizontais para tela deitada.
const PADRAO: Clipe = { src: '/videos/corrida.mp4', poster: '/videos/corrida.webp' } // 7884055
const VERTICAIS: Clipe[] = [
  PADRAO,
  { src: '/videos/salada.mp4', poster: '/videos/salada.webp' }, // 6162045
  { src: '/videos/exercicio.mp4', poster: '/videos/exercicio.webp' }, // 8045825
]
const HORIZONTAIS: Clipe[] = [
  { src: '/videos/corrida-largo.mp4', poster: '/videos/corrida-largo.webp' }, // 7884028
  { src: '/videos/salada-largo.mp4', poster: '/videos/salada-largo.webp' }, // 8802441
  { src: '/videos/exercicio-largo.mp4', poster: '/videos/exercicio-largo.webp' }, // 8045817
]
const TELA_DEITADA = '(min-aspect-ratio: 1/1)'

type Conexao = { connection?: { saveData?: boolean } }

/** Sem vídeo para quem pediu menos movimento ou economia de dados: fica a imagem parada. */
function podeTocarVideo(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  const menosMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const economia = (navigator as Navigator & Conexao).connection?.saveData === true
  return !menosMovimento && !economia
}

function telaDeitada(): boolean {
  return typeof window !== 'undefined' && !!window.matchMedia?.(TELA_DEITADA).matches
}

/** Acompanha a orientação da tela (girar o celular ou redimensionar a janela troca o conjunto). */
function useClipes(): Clipe[] {
  const [deitada, setDeitada] = useState(telaDeitada)
  useEffect(() => {
    const consulta = window.matchMedia?.(TELA_DEITADA)
    if (!consulta) return
    const mudou = () => setDeitada(consulta.matches)
    consulta.addEventListener('change', mudou)
    return () => consulta.removeEventListener('change', mudou)
  }, [])
  return deitada ? HORIZONTAIS : VERTICAIS
}

/** Corrida, alimentação e yoga, em sequência, sem som, cobrindo todo o fundo. */
export function VideoFundo({ className }: { className: string }) {
  const clipes = useClipes()
  const [indice, setIndice] = useState(0)
  const [comVideo] = useState(podeTocarVideo)
  const video = useRef<HTMLVideoElement>(null)
  const clipe = clipes[indice % clipes.length] ?? PADRAO

  // iOS só toca sozinho com muted definido no elemento antes do play.
  useEffect(() => {
    const v = video.current
    if (!v) return
    v.muted = true
    const tocando = v.play()
    if (tocando && typeof tocando.catch === 'function') tocando.catch(() => {})
  }, [clipe.src])

  if (!comVideo) return <img src={clipe.poster} alt="" className={className} />
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
      onEnded={() => setIndice((i) => (i + 1) % clipes.length)}
    />
  )
}
