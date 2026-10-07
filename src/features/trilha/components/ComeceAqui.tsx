import { useState } from 'react'
import { BarraProgresso, Cartao, classeBrilho } from '@/components/ui'
import { linkDeIncorporacao } from '@/lib/video'
import { ITENS_COMECE } from '../api/comece.api'
import { useComeceAqui } from '../hooks/useTrilha'
import { usePrevia } from '../previa'
import { textos } from '../textos'
import { PassosComece } from './PassosComece'

const t = textos.comece

/** Bloco fixo no topo até completar os 5 passos; completo, vira um link pequeno que reabre. */
export function ComeceAqui() {
  const comece = useComeceAqui()
  const previa = usePrevia()
  const [aberto, setAberto] = useState(false)
  if (!comece.data) return null
  const { video_url, texto } = comece.data
  const feitos = previa ? [] : comece.data.feitos
  const completo = feitos.length === ITENS_COMECE.length
  if (completo && !aberto)
    return (
      <button
        type="button"
        onClick={() => setAberto(true)}
        className={`${classeBrilho('cinza', 'sm')} self-start`}
      >
        {t.recolhido}
      </button>
    )
  const video = video_url ? linkDeIncorporacao(video_url) : null
  return (
    <Cartao className="grid gap-5 lg:grid-cols-2 lg:gap-8">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[19px] font-bold text-verde-escuro">{t.titulo}</h2>
          {completo && (
            <button
              type="button"
              onClick={() => setAberto(false)}
              className="text-sm text-suave underline"
            >
              {t.recolher}
            </button>
          )}
        </div>
        {video && (
          <div className="aspect-video overflow-hidden rounded-[18px] bg-tinta">
            <iframe
              src={video}
              title={t.titulo}
              className="h-full w-full"
              allow="encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
            />
          </div>
        )}
        {texto && (
          <p className="text-[15px] leading-relaxed whitespace-pre-line text-tinta">{texto}</p>
        )}
      </div>
      <div className="flex flex-col gap-3">
        <BarraProgresso
          pct={(feitos.length / ITENS_COMECE.length) * 100}
          legenda={t.progresso(feitos.length, ITENS_COMECE.length)}
        />
        <PassosComece feitos={feitos} soVer={Boolean(previa)} />
      </div>
    </Cartao>
  )
}
