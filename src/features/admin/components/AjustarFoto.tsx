import { useRef, useState, type PointerEvent } from 'react'
import { BotaoBrilho } from '@/components/ui'
import { ENQUADRE_INICIAL, arrastar, recortar, retangulo, type Enquadre } from '@/lib/recorte'
import { textos } from '../textos'

const t = textos.arquivos
const PROPORCAO = 16 / 9
type Medida = { w: number; h: number }

/** Posição da imagem dentro do quadro, em porcentagem, para o enquadre escolhido. */
function estilo(m: Medida | null, e: Enquadre) {
  if (!m) return { width: '100%', left: 0, top: 0 }
  const r = retangulo(m.w, m.h, PROPORCAO, e)
  return {
    width: `${(m.w / r.sw) * 100}%`,
    left: `${-(r.sx / r.sw) * 100}%`,
    top: `${-(r.sy / r.sh) * 100}%`,
  }
}

/** Enquadre que muda ao arrastar com o dedo ou o mouse dentro do quadro. */
function useArrastar(medida: Medida | null) {
  const ponto = useRef<{ x: number; y: number } | null>(null)
  const [e, setE] = useState(ENQUADRE_INICIAL)
  const soltar = () => (ponto.current = null)
  const eventos = {
    onPointerDown: (ev: PointerEvent<HTMLDivElement>) => {
      ev.currentTarget.setPointerCapture(ev.pointerId)
      ponto.current = { x: ev.clientX, y: ev.clientY }
    },
    onPointerMove: (ev: PointerEvent<HTMLDivElement>) => {
      if (!ponto.current || !medida) return
      const dx = ev.clientX - ponto.current.x
      const dy = ev.clientY - ponto.current.y
      ponto.current = { x: ev.clientX, y: ev.clientY }
      const w = ev.currentTarget.clientWidth
      setE((a) => arrastar(medida.w, medida.h, PROPORCAO, a, dx, dy, w))
    },
    onPointerUp: soltar,
    onPointerCancel: soltar,
  }
  return { e, setE, eventos }
}

/** Controle de aproximar a foto (1x a 3x). */
function Aproximar({ zoom, mudar }: { zoom: number; mudar: (z: number) => void }) {
  return (
    <label className="flex max-w-md items-center gap-3 text-sm">
      {t.aproximar}
      <input
        type="range"
        min={1}
        max={3}
        step={0.01}
        value={zoom}
        onChange={(ev) => mudar(Number(ev.target.value))}
        className="flex-1 accent-verde-escuro"
      />
    </label>
  )
}

/** Arrastar e aproximar a foto no quadro 16:9; Usar esta foto gera a imagem recortada. */
export function AjustarFoto({
  src,
  aoUsar,
  aoCancelar,
}: {
  src: string
  aoUsar: (f: File) => void
  aoCancelar: () => void
}) {
  const img = useRef<HTMLImageElement>(null)
  const [medida, setMedida] = useState<Medida | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)
  const { e, setE, eventos } = useArrastar(medida)
  const usar = () => {
    if (!img.current) return
    recortar(img.current, PROPORCAO, e)
      .then(aoUsar)
      .catch(() => setAviso(t.ajusteFalhou))
  }
  return (
    <div className="flex flex-col gap-3">
      <div
        className="relative aspect-video w-full max-w-md cursor-grab touch-none overflow-hidden rounded-[14px] bg-tinta select-none active:cursor-grabbing"
        {...eventos}
      >
        <img
          ref={img}
          src={src}
          alt={t.previaCapa}
          crossOrigin="anonymous"
          draggable={false}
          onLoad={(ev) =>
            setMedida({ w: ev.currentTarget.naturalWidth, h: ev.currentTarget.naturalHeight })
          }
          onError={() => setAviso(t.ajusteFalhou)}
          className="absolute max-w-none"
          style={estilo(medida, e)}
        />
      </div>
      <Aproximar zoom={e.zoom} mudar={(zoom) => setE((a) => ({ ...a, zoom }))} />
      {aviso && (
        <p role="alert" className="text-sm text-terracota-escuro">
          {aviso}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <BotaoBrilho tom="cinza" tamanho="sm" onClick={aoCancelar}>
          {t.cancelarAjuste}
        </BotaoBrilho>
        <BotaoBrilho tom="escuro" tamanho="sm" onClick={usar} disabled={!medida}>
          {t.usarFoto}
        </BotaoBrilho>
      </div>
    </div>
  )
}
