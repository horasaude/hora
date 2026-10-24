import { useEffect, useState } from 'react'
import { ehVideo, extensaoDe, validarArquivo } from '@/domain/arquivos'
import { enviarComProgresso } from '@/lib/envio'
import { supabase } from '@/lib/supabase'
import { textos } from '../textos'
import type { Destino, EstadoCapa } from './CapaLive'

const t = textos.arquivos

/** Link de leitura da imagem já salva (o painel lê o espaço). */
function usePreviaSalva(caminho: string | null, local: string | null, espaco: string) {
  const [url, setUrl] = useState<string | null>(null)
  useEffect(() => {
    if (!caminho || local) return
    supabase.storage
      .from(espaco)
      .createSignedUrl(caminho, 3600)
      .then(({ data }) => setUrl(data?.signedUrl ?? null))
  }, [caminho, local, espaco])
  return local ?? (caminho ? url : null)
}

/** Estado da capa: envio com progresso, prévia local e tirar. */
export function useCapa(inicial: string | null, aoMudar: (c: EstadoCapa) => void, d: Destino) {
  const [caminho, setCaminho] = useState(inicial)
  const [local, setLocal] = useState<string | null>(null)
  const [video, setVideo] = useState(() => ehVideo(inicial))
  const [progresso, setProgresso] = useState<number | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)
  const [ajustando, setAjustando] = useState<string | null>(null)
  const ajustavel = d.uso !== 'exercicio'
  const escolher = (arquivos: File[]) => {
    const f = arquivos[0]
    if (!f) return
    const v = validarArquivo(f, d.uso ?? 'capa')
    if (!v.ok) return setAviso(t.recusado(f.name, v.motivo))
    setAviso(null)
    if (ajustavel) return setAjustando(URL.createObjectURL(f))
    enviar(f)
  }
  const enviar = (f: File) => {
    const ext = extensaoDe(f.name, f.type)
    const novo = `${d.pasta}/${crypto.randomUUID()}.${ext}`
    setLocal(URL.createObjectURL(f))
    setVideo(ext === 'mp4' || ext === 'webm' || ext === 'mov')
    setProgresso(0)
    aoMudar({ caminho: novo, enviando: true })
    enviarComProgresso(d.espaco, novo, f, setProgresso)
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
  const previa = usePreviaSalva(caminho, local, d.espaco)
  return {
    previa,
    ajustando,
    podeAjustar: ajustavel && !video && Boolean(previa),
    ajustar: () => setAjustando(previa),
    usarAjuste: (f: File) => {
      setAjustando(null)
      enviar(f)
    },
    cancelarAjuste: () => setAjustando(null),
    video,
    progresso,
    aviso,
    escolher,
    tirar,
  }
}
