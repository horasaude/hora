// Envio de arquivo ao Storage com barra de progresso (o supabase-js não informa o progresso).
import { env } from './env'
import { supabase } from './supabase'

/** Sobe o arquivo no espaço e caminho dados; chama aoProgresso com 0 a 100. */
export async function enviarComProgresso(
  espaco: string,
  caminho: string,
  arquivo: File,
  aoProgresso: (pct: number) => void,
): Promise<void> {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (!token) throw new Error('sem sessão')
  await new Promise<void>((ok, falha) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `${env.VITE_SUPABASE_URL}/storage/v1/object/${espaco}/${caminho}`)
    xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    xhr.setRequestHeader('apikey', env.VITE_SUPABASE_ANON_KEY)
    xhr.setRequestHeader('Content-Type', arquivo.type || 'application/octet-stream')
    xhr.setRequestHeader('x-upsert', 'false')
    xhr.upload.onprogress = (e) =>
      e.lengthComputable && aoProgresso(Math.round((e.loaded / e.total) * 100))
    xhr.onload = () =>
      xhr.status < 300 ? ok() : falha(new Error(`envio recusado (${xhr.status})`))
    xhr.onerror = () => falha(new Error('falha de rede'))
    xhr.send(arquivo)
  })
  aoProgresso(100)
}
