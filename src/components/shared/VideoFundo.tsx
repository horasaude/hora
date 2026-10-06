import { useEffect, useRef, useState } from 'react'

type Clipe = { src: string; poster: string }

// Pexels (licença livre, sem crédito obrigatório): corrida, academia, salada e refeição.
// Verticais para tela em pé, horizontais para tela deitada.
const PADRAO: Clipe = { src: '/videos/corrida.mp4', poster: '/videos/corrida.webp' } // 7884055
const VERTICAIS: Clipe[] = [
  PADRAO,
  { src: '/videos/academia.mp4', poster: '/videos/academia.webp' }, // 6326781
  { src: '/videos/salada.mp4', poster: '/videos/salada.webp' }, // 6162045
  { src: '/videos/refeicao.mp4', poster: '/videos/refeicao.webp' }, // 9034023
]
const HORIZONTAIS: Clipe[] = [
  { src: '/videos/corrida-largo.mp4', poster: '/videos/corrida-largo.webp' }, // 7884028
  { src: '/videos/academia-largo.mp4', poster: '/videos/academia-largo.webp' }, // 32239227
  { src: '/videos/salada-largo.mp4', poster: '/videos/salada-largo.webp' }, // 8802441
  { src: '/videos/refeicao-largo.mp4', poster: '/videos/refeicao-largo.webp' }, // 8171533
]
/** Cada vídeo passa no máximo este tempo antes do próximo: cortes curtos, mais ritmo. */
const TAKE_SEGUNDOS = 6
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

/**
 * Toca garantindo o "mudo" que o iPhone exige. Se o navegador recusar (economia de bateria),
 * tenta de novo no primeiro toque ou clique na tela.
 */
function tocar(v: HTMLVideoElement) {
  v.muted = true
  v.defaultMuted = true
  v.setAttribute('muted', '')
  const tentativa = v.play()
  if (!tentativa || typeof tentativa.catch !== 'function') return
  tentativa.catch(() => {
    const deNovo = () => void v.play().catch(() => {})
    window.addEventListener('touchstart', deNovo, { once: true, passive: true })
    window.addEventListener('click', deNovo, { once: true })
  })
}

/**
 * Corrida, academia, salada e refeição, em cortes curtos, sem som, cobrindo todo o fundo.
 * Um único vídeo que só troca de arquivo: no iPhone, o vídeo que já começou continua liberado
 * para tocar os próximos. Enquanto o próximo carrega, a primeira imagem dele fica por cima e
 * some quando ele começa, para a troca nunca ficar preta.
 */
export function VideoFundo({ className }: { className: string }) {
  const clipes = useClipes()
  const [indice, setIndice] = useState(0)
  const [carregando, setCarregando] = useState(true)
  const [comVideo] = useState(podeTocarVideo)
  const video = useRef<HTMLVideoElement | null>(null)
  const n = clipes.length
  const atual = indice % n
  const clipe = clipes[atual] ?? PADRAO

  useEffect(() => {
    if (video.current) tocar(video.current)
  }, [clipe.src])

  // Pede ao navegador para adiantar o próximo arquivo (Chrome e Android; o iPhone ignora).
  const seguinte = clipes[(atual + 1) % n]?.src
  useEffect(() => {
    if (!seguinte || !comVideo) return
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = seguinte
    document.head.appendChild(link)
    return () => link.remove()
  }, [seguinte, comVideo])

  // Só avança a partir do clipe atual: vários avisos seguidos de tempo não pulam clipes.
  const avancar = () => {
    setCarregando(true)
    setIndice((i) => (i % n === atual ? (atual + 1) % n : i))
  }

  if (!comVideo) return <img src={clipe.poster} alt="" className={className} />
  return (
    <>
      <video
        ref={(el) => {
          video.current = el
          if (el) el.setAttribute('muted', '')
        }}
        className={className}
        src={clipe.src}
        poster={clipe.poster}
        autoPlay
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        onPlaying={() => setCarregando(false)}
        onEnded={avancar}
        onTimeUpdate={(e) => e.currentTarget.currentTime >= TAKE_SEGUNDOS && avancar()}
      />
      <img
        src={clipe.poster}
        alt=""
        aria-hidden="true"
        data-cobertura={carregando ? '' : undefined}
        className={`${className} pointer-events-none transition-opacity duration-500 ${carregando ? 'opacity-100' : 'opacity-0'}`}
      />
    </>
  )
}
