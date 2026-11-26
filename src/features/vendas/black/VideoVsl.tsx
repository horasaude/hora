import { useRef, useState } from 'react'
import { black } from './textos'

const t = black.hero

/** VSL em pé: começa sozinha e muda; o primeiro toque liga o som e volta para o começo. */
export function VideoVsl() {
  const ref = useRef<HTMLVideoElement>(null)
  const [comSom, setComSom] = useState(false)
  const ligarSom = () => {
    const v = ref.current
    if (!v) return
    v.currentTime = 0
    v.muted = false
    v.loop = false
    void v.play()
    setComSom(true)
  }
  return (
    <figure className="relative mx-auto mt-10 w-full max-w-[340px] sm:max-w-[380px]">
      <video
        ref={ref}
        src="/black/vsl.mp4"
        poster="/black/vsl-capa.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        controls={comSom}
        width={720}
        height={1280}
        className="aspect-[9/16] w-full rounded-3xl border border-verde-vivo/40 bg-[#0f1412] object-cover shadow-[0_0_80px_rgb(31_168_110/0.25)]"
      />
      {!comSom && (
        <button
          type="button"
          onClick={ligarSom}
          className="absolute inset-0 grid place-items-center rounded-3xl bg-black/35"
        >
          <span className="flex flex-col items-center gap-3">
            <span className="grid size-20 place-items-center rounded-full bg-verde-vivo text-[#04140d] shadow-[0_0_40px_rgb(31_168_110/0.6)]">
              <svg viewBox="0 0 24 24" className="size-9" fill="currentColor" aria-hidden="true">
                <path d="M3 9v6h4l5 4V5L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z" />
              </svg>
            </span>
            <span className="rounded-full bg-black/70 px-4 py-2 text-sm font-bold text-creme">
              {t.video}
            </span>
          </span>
        </button>
      )}
    </figure>
  )
}
