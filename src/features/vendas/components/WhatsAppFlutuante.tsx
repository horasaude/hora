import { linkWhatsApp } from '@/lib/whatsapp'
import { textos } from '../textos'

/** Botão flutuante. Sem número válido em VITE_WHATSAPP_NUMERO, não aparece. */
export function WhatsAppFlutuante({ numero }: { numero?: string }) {
  const link = linkWhatsApp(numero, textos.whatsapp.mensagem)
  if (!link) return null
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener"
      className="fixed right-4 bottom-4 z-20 inline-flex min-h-12 items-center rounded-full bg-[#25D366] px-5 font-bold text-tinta shadow-md"
    >
      {textos.whatsapp.rotulo}
    </a>
  )
}
