import { useState } from 'react'
import { EtiquetaBrilho } from '@/components/ui'
import { formatarData } from '@/lib/datas'
import { Estado } from '../../components/Estado'
import type { Foto } from '../api/pontos.api'
import { useFotos } from '../hooks/usePontos'
import { t } from '../textos'
import { FotoJanela } from './FotoJanela'

const f = t.fotos

function Miniatura({ foto, abrir }: { foto: Foto; abrir: () => void }) {
  return (
    <button
      type="button"
      onClick={abrir}
      className="flex flex-col overflow-hidden rounded-[18px] border border-[#ECEFED] bg-white text-left shadow-painel transition hover:-translate-y-0.5"
    >
      <div className="relative aspect-square w-full bg-trilho">
        {foto.url && (
          <img
            src={foto.url}
            alt=""
            loading="lazy"
            className={`size-full object-cover ${foto.invalidado_em ? 'opacity-40' : ''}`}
          />
        )}
        <span className="absolute top-2 left-2 flex flex-wrap gap-1">
          {foto.invalidado_em && <EtiquetaBrilho tom="coral">{f.invalidada}</EtiquetaBrilho>}
          {foto.denuncias_checkin.length > 0 && (
            <EtiquetaBrilho tom="dourado">
              {f.denunciada(foto.denuncias_checkin.length)}
            </EtiquetaBrilho>
          )}
        </span>
      </div>
      <div className="px-3 py-2.5 text-[13px]">
        <p className="truncate font-bold text-tinta">{foto.perfis?.nome ?? '-'}</p>
        <p className="truncate text-xs text-suave">
          {formatarData(new Date(foto.created_at))} · {foto.tipo_treino ?? f.tipos[foto.tipo]}
        </p>
      </div>
    </button>
  )
}

/** Fotos de treino em grade; ao clicar, a foto abre grande. */
export function AbaFotos() {
  const fotos = useFotos()
  const [aberta, setAberta] = useState<Foto | null>(null)
  if (fotos.isPending) return <Estado tipo="carregando" />
  if (fotos.isError) return <Estado tipo="erro" tentar={() => fotos.refetch()} />
  if (fotos.data.length === 0) return <Estado tipo="vazio" texto={f.vazio} />
  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {fotos.data.map((foto) => (
          <Miniatura key={foto.id} foto={foto} abrir={() => setAberta(foto)} />
        ))}
      </div>
      {aberta && <FotoJanela foto={aberta} aoFechar={() => setAberta(null)} />}
    </>
  )
}
