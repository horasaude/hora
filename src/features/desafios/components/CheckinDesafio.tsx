import { useId, useState } from 'react'
import { BotaoBrilho, EtiquetaBrilho, IconeCheck, PontosGanhos } from '@/components/ui'
import { diaMesDeData } from '@/lib/datas'
import type { Desafio } from '../api/desafios.api'
import { useCheckinDesafio, useEntrarDesafio } from '../hooks/useDesafios'
import { textos } from '../textos'

const t = textos.checkin

/** Botão do check-in do dia conforme o tipo: sim ou não, foto ou número. */
export function CheckinDesafio({ d, hoje }: { d: Desafio; hoje: string }) {
  const entrar = useEntrarDesafio()
  const marcar = useCheckinDesafio()
  const [ganho, setGanho] = useState({ pontos: 0, chave: 0 })
  if (d.encerrado) return null
  if (!d.participando)
    return (
      <BotaoBrilho
        tom="dourado"
        className="self-start"
        disabled={entrar.isPending}
        onClick={() => entrar.mutate(d.id)}
      >
        {entrar.isPending ? textos.entrando : textos.entrarNoDesafio}
      </BotaoBrilho>
    )
  if (hoje < d.inicio)
    return <p className="text-sm text-suave">{textos.comecaEm(diaMesDeData(d.inicio))}</p>
  const enviar = (extra: { valor?: number; arquivo?: File }) =>
    marcar.mutate(
      { desafio: d.id, ...extra },
      { onSuccess: (pontos) => setGanho({ pontos, chave: Date.now() }) },
    )
  return (
    <div className="relative flex flex-col gap-2">
      {d.feito_hoje ? (
        <span className="self-start">
          <EtiquetaBrilho tom="verde">
            <IconeCheck className="mr-1 size-3" />
            {t.feito}
          </EtiquetaBrilho>
        </span>
      ) : d.tipo_checkin === 'sim_nao' ? (
        <BotaoBrilho
          tom="verde"
          className="self-start"
          disabled={marcar.isPending}
          onClick={() => enviar({})}
        >
          {t.simNao}
        </BotaoBrilho>
      ) : d.tipo_checkin === 'numero' ? (
        <CampoNumero d={d} enviando={marcar.isPending} aoEnviar={(valor) => enviar({ valor })} />
      ) : (
        <CampoFoto enviando={marcar.isPending} aoEnviar={(arquivo) => enviar({ arquivo })} />
      )}
      <PontosGanhos pontos={ganho.pontos} chave={ganho.chave} />
      {(marcar.isError || entrar.isError) && (
        <p role="alert" className="text-sm text-terracota-escuro">
          {t.erro}
        </p>
      )}
    </div>
  )
}

function CampoNumero({
  d,
  enviando,
  aoEnviar,
}: {
  d: Desafio
  enviando: boolean
  aoEnviar: (v: number) => void
}) {
  const id = useId()
  const [valor, setValor] = useState('')
  const unidade = d.unidade ?? ''
  return (
    <form
      className="flex flex-col gap-1.5 text-sm"
      onSubmit={(e) => {
        e.preventDefault()
        if (valor !== '') aoEnviar(Number(valor))
      }}
    >
      <label htmlFor={id} className="font-bold text-tinta">
        {t.numero(unidade)}
      </label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          inputMode="numeric"
          required
          value={valor}
          onChange={(e) => setValor(e.target.value.replace(/\D/g, '').slice(0, 5))}
          className="min-h-9 w-24 rounded-full border border-linha bg-white px-4 focus:border-ora focus:outline-none"
        />
        <BotaoBrilho type="submit" tom="verde" disabled={enviando || valor === ''}>
          {t.registrar}
        </BotaoBrilho>
      </div>
    </form>
  )
}

function CampoFoto({ enviando, aoEnviar }: { enviando: boolean; aoEnviar: (f: File) => void }) {
  const id = useId()
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        aria-disabled={enviando}
        className={`brilho brilho-verde inline-flex min-h-9 cursor-pointer items-center self-start rounded-full px-4 text-[13px] font-bold ${enviando ? 'opacity-50' : ''}`}
      >
        {enviando ? t.enviando : t.foto}
      </label>
      <input
        id={id}
        type="file"
        accept="image/*"
        capture="environment"
        disabled={enviando}
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) aoEnviar(f)
        }}
      />
      <p className="text-[13px] text-suave">{t.privado}</p>
    </div>
  )
}
