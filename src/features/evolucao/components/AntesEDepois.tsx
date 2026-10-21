import { useState } from 'react'
import { useHoje } from '@/features/checkin'
import { diaMesDeData } from '@/lib/datas'
import type { Medida } from '../api/medidas.api'
import { useMedidas } from '../hooks/useMedidas'
import { textos } from '../textos'
import { JanelaMedida } from './JanelaMedida'

const t = textos.antesDepois
const quadro =
  'relative flex aspect-[3/4] flex-col items-center justify-center gap-1.5 overflow-hidden rounded-[16px] bg-trilho text-[12px] font-bold text-suave'

function Foto({ m, rotulo }: { m: Medida; rotulo: string }) {
  const legenda = `${rotulo} · ${diaMesDeData(m.dia)}`
  return (
    <figure className={quadro}>
      <img src={m.foto} alt={legenda} className="absolute inset-0 size-full object-cover" />
      <figcaption className="absolute inset-x-2 bottom-2 rounded-full bg-white/90 px-2 py-1 text-center text-tinta">
        {legenda}
      </figcaption>
    </figure>
  )
}

function Adicionar({ aoClicar }: { aoClicar: () => void }) {
  return (
    <button type="button" onClick={aoClicar} className={`${quadro} transition hover:bg-linha`}>
      <svg viewBox="0 0 24 24" aria-hidden className="size-6">
        <path
          d="M4 8h3l1.5-2.5h7L17 8h3v11H4zM12 16.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
      {t.adicionar}
    </button>
  )
}

/** Antes e depois: a foto mais antiga das medidas e a mais nova; o que faltar vira "Adicionar foto". */
export function AntesEDepois() {
  const hoje = useHoje()
  const medidas = useMedidas()
  const [abrir, setAbrir] = useState(false)
  if (medidas.isError) return null
  const comFoto = (medidas.data ?? []).filter((m) => m.foto)
  const antes = comFoto.at(-1)
  const depois = comFoto.length > 1 ? comFoto[0] : undefined
  return (
    <div className="grid grid-cols-2 gap-2" aria-busy={medidas.isPending}>
      {antes ? <Foto m={antes} rotulo={t.antes} /> : <Adicionar aoClicar={() => setAbrir(true)} />}
      {depois ? (
        <Foto m={depois} rotulo={t.agora} />
      ) : (
        <Adicionar aoClicar={() => setAbrir(true)} />
      )}
      {abrir && <JanelaMedida hoje={hoje} aoFechar={() => setAbrir(false)} />}
    </div>
  )
}
