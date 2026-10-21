import { useState } from 'react'
import { useMeuPerfil } from '@/features/auth'
import { linkWhatsAppMensagem } from '@/lib/whatsapp'
import { textos } from '../textos'

const t = textos.indicar

/** Link pessoal de indicação, o link do WhatsApp com a mensagem pronta e o copiar. */
export function useLinkIndicacao() {
  const codigo = useMeuPerfil().data?.codigo_indicacao
  const [copiado, setCopiado] = useState(false)
  const link = codigo ? `${window.location.origin}/?ind=${codigo}` : ''
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(link)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2500)
    } catch {
      setCopiado(false)
    }
  }
  return { link, copiar, copiado, whatsapp: linkWhatsAppMensagem(t.mensagem(link)) }
}
