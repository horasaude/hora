import { useEffect, useState } from 'react'
import { BotaoBrilho } from '@/components/ui'
import { tipoMime, validarArquivo } from '@/domain/arquivos'
import { enviarComProgresso } from '@/lib/envio'
import { supabase } from '@/lib/supabase'
import { textos } from '../textos'
import { AreaArquivos } from './AreaArquivos'
import { BarraEnvio } from './BarraEnvio'

const t = textos.arquivos

export type EstadoCapa = { caminho: string | null; enviando: boolean }

/** Link de leitura da capa já salva (o painel lê o espaço materiais). */
function usePreviaSalva(caminho: string | null, local: string | null) {
  const [url, setUrl] = useState<string | null>(null)
  useEffect(() => {
    if (!caminho || local) return
    supabase.storage
      .from('materiais')
      .createSignedUrl(caminho, 3600)
      .then(({ data }) => setUrl(data?.signedUrl ?? null))
  }, [caminho, local])
  return local ?? (caminho ? url : null)
}

/** Estado da capa: envio com progresso, prévia local e tirar. */
function useCapa(inicial: string | null, aoMudar: (c: EstadoCapa) => void) {
  const [caminho, setCaminho] = useState(inicial)
  const [local, setLocal] = useState<string | null>(null)
  const [progresso, setProgresso] = useState<number | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)
  const escolher = (arquivos: File[]) => {
    const f = arquivos[0]
    if (!f) return
    const v = validarArquivo(f, 'capa')
    if (!v.ok) return setAviso(t.recusado(f.name, v.motivo))
    setAviso(null)
    const ext = tipoMime(f.name, f.type).split('/')[1]?.replace('jpeg', 'jpg') ?? 'jpg'
    const novo = `capas/${crypto.randomUUID()}.${ext}`
    setLocal(URL.createObjectURL(f))
    setProgresso(0)
    aoMudar({ caminho: novo, enviando: true })
    enviarComProgresso('materiais', novo, f, setProgresso)
      .then(() => {
        setCaminho(novo)
        aoMudar({ caminho: novo, enviando: false })
      })
      .catch(() => {
        setLocal(null)
        setAviso(t.falhou)
        aoMudar({ caminho, enviando: false })
      })
      .finally(() => setProgresso(null))
  }
  const tirar = () => {
    setCaminho(null)
    setLocal(null)
    aoMudar({ caminho: null, enviando: false })
  }
  return { previa: usePreviaSalva(caminho, local), progresso, aviso, escolher, tirar }
}

/** Capa da gravação: arrastar e soltar uma imagem (até 5 MB), com prévia e progresso. */
export function CapaLive({
  inicial,
  aoMudar,
}: {
  inicial: string | null
  aoMudar: (c: EstadoCapa) => void
}) {
  const c = useCapa(inicial, aoMudar)
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-sm font-medium">{t.capa}</h3>
      {c.previa ? (
        <div className="flex flex-wrap items-end gap-3">
          <img
            src={c.previa}
            alt={t.previaCapa}
            className="aspect-video w-64 rounded-[14px] object-cover"
          />
          <BotaoBrilho tom="coral" tamanho="sm" onClick={c.tirar} disabled={c.progresso !== null}>
            {t.tirarCapa}
          </BotaoBrilho>
        </div>
      ) : (
        <AreaArquivos
          aceita=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          multiplos={false}
          dica={t.dicaCapa}
          aoEscolher={c.escolher}
        />
      )}
      {c.progresso !== null && <BarraEnvio pct={c.progresso} />}
      {c.aviso && (
        <p role="alert" className="text-sm text-terracota-escuro">
          {c.aviso}
        </p>
      )}
    </section>
  )
}
